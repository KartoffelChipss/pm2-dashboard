import express from 'express';
import logger from '../../util/logging/logger.js';
import readLastLines from 'read-last-lines';
import ansiToHtml from '../../util/ansiToHtml.js';
import path from 'path';
import { describeApp } from '../../pm2Helpers.js';
import chokidar from 'chokidar';
import authenticate from '../../db/middleware/authenticate.js';

const router = express.Router();

router.use(authenticate);

router.get('/:name/logs', async (req, res) => {
    const appName = req.params.name;
    const lines = req.query.lines ? Number(req.query.lines) : 300;

    try {
        const appInfo = await describeApp(appName);
        if (!appInfo) {
            res.status(404).json({ error: 'App not found' });
            return;
        }
        const infoPath = path.resolve(appInfo.pm_out_log_path || '');
        const errorPath = path.resolve(appInfo.pm_err_log_path || '');

        if (!infoPath && !errorPath) {
            res.status(400).json({ error: 'No log paths available for this app' });
            return;
        }

        function filterEmptyLines(logs: string): string {
            return logs
                .split('\n')
                .filter((line) => line.trim() !== '')
                .join('\n');
        }

        const lastInfoLines = ansiToHtml(
            filterEmptyLines(await readLastLines.read(infoPath, lines))
        );
        const lastErrorLines = ansiToHtml(
            filterEmptyLines(await readLastLines.read(errorPath, lines))
        );

        res.json({
            infoLogs: lastInfoLines,
            errorLogs: lastErrorLines,
        });
    } catch (error) {
        logger.error('Error retrieving logs for app:', error);
        res.status(500).json({ error: 'Failed to retrieve logs', details: error });
    }
});

router.get('/:name/logs/stream', async (req, res) => {
    const appName = req.params.name;

    res.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
    });

    try {
        res.write(': connected\n\n');
        if (typeof (res as any).flushHeaders === 'function') (res as any).flushHeaders();
    } catch (e) {
        logger.warn('Failed to send initial SSE comment:', e);
    }

    const sendPayload = (payload: any) => {
        try {
            res.write(`data: ${JSON.stringify(payload)}\n\n`);
        } catch (e) {
            logger.error('Failed to write SSE payload for logs:', e);
        }
    };

    function filterEmptyLines(logs: string): string {
        return logs
            .split('\n')
            .filter((line) => line.trim() !== '')
            .join('\n');
    }

    const sendOnce = async () => {
        try {
            const appInfo = await describeApp(appName);
            if (!appInfo) {
                sendPayload({ error: 'app_not_found' });
                return;
            }

            const infoPath = path.resolve(appInfo.pm_out_log_path || '');
            const errorPath = path.resolve(appInfo.pm_err_log_path || '');

            if (!infoPath && !errorPath) {
                sendPayload({ error: 'no_log_paths' });
                return;
            }

            const lastInfoLines = infoPath
                ? ansiToHtml(filterEmptyLines(await readLastLines.read(infoPath, 300)))
                : '';
            const lastErrorLines = errorPath
                ? ansiToHtml(filterEmptyLines(await readLastLines.read(errorPath, 300)))
                : '';

            sendPayload({
                infoLogs: lastInfoLines,
                errorLogs: lastErrorLines,
            });
        } catch (error) {
            logger.error('Error building SSE payload for app logs stream:', error);
            sendPayload({ error: 'internal_error', details: String(error) });
        }
    };

    const appInfo = await describeApp(appName);
    if (!appInfo) {
        sendPayload({ error: 'app_not_found' });
        res.end();
        return;
    }
    const infoPath = appInfo.pm_out_log_path ? path.resolve(appInfo.pm_out_log_path) : null;
    const errorPath = appInfo.pm_err_log_path ? path.resolve(appInfo.pm_err_log_path) : null;

    if (!infoPath && !errorPath) {
        sendPayload({ error: 'no_log_paths' });
        res.end();
        return;
    }

    const watchList: string[] = [];
    if (infoPath) watchList.push(infoPath);
    if (errorPath) watchList.push(errorPath);

    const watcher = chokidar.watch(watchList, {
        persistent: true,
        usePolling: false,
        // Reduce stability threshold so small/frequent writes are reported faster
        awaitWriteFinish: {
            stabilityThreshold: 50,
            pollInterval: 50,
        },
        ignoreInitial: false,
    });

    watcher.on('ready', () => {
        logger.debug('Chokidar watcher ready, watching files:', watchList);
    });

    watcher.on('all', (event, p) => {
        logger.silly(`Chokidar event: ${event} -> ${p}`);
    });

    sendOnce().catch((e) => logger.error('Initial sendOnce failed:', e));

    const minIntervalMs = 1000;
    let lastSent = 0;
    let pendingTimer: NodeJS.Timeout | null = null;
    const heartbeatIntervalMs = 15_000;
    const heartbeat = setInterval(() => {
        try {
            res.write(': heartbeat\n\n');
        } catch (e) {
            logger.warn('Failed to write SSE heartbeat:', e);
        }
    }, heartbeatIntervalMs);

    function scheduleSendSoon() {
        if (pendingTimer) return;
        pendingTimer = setTimeout(async () => {
            pendingTimer = null;
            const now = Date.now();
            const timeSinceLast = now - lastSent;
            if (timeSinceLast >= minIntervalMs) {
                await sendOnce();
                lastSent = Date.now();
            } else {
                const wait = minIntervalMs - timeSinceLast;
                pendingTimer = setTimeout(async () => {
                    pendingTimer = null;
                    await sendOnce();
                    lastSent = Date.now();
                }, wait);
            }
        }, 250);
    }

    watcher.on('change', (p) => {
        logger.silly(`Log file changed: ${p}`);
        scheduleSendSoon();
    });

    watcher.on('add', (p) => {
        logger.silly(`Log file added: ${p}`);
        scheduleSendSoon();
    });

    watcher.on('error', (err) => {
        logger.error('Watcher error:', err);
    });

    req.on('close', async () => {
        if (pendingTimer) clearTimeout(pendingTimer);
        try {
            await watcher.close();
        } catch (e) {
            logger.error('Error closing watcher:', e);
        }
        try {
            clearInterval(heartbeat);
        } catch {
            // ignore
        }
    });
});

export default router;
