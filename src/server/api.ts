import express from 'express';
import { describeApp, listApps, reloadApp, restartApp, stopApp } from './pm2Helpers.js';
import logger from './util/logging/logger.js';
import { readHistory } from './pm2-history.js';

const router = express.Router();

router.get('/apps', async (_, res) => {
    try {
        const apps = await listApps();
        res.json(apps);
    } catch (error) {
        logger.error('Error listing apps:', error);
        res.status(500).json({ error: 'Failed to list apps', details: error });
    }
});

router.get('/apps/:name', async (req, res) => {
    const appName = req.params.name;
    try {
        const appInfo = await describeApp(appName);
        const history = await readHistory(appName);
        if (!appInfo) {
            res.status(404).json({ error: 'App not found' });
            return;
        }
        res.json({ appInfo, history });
    } catch (error) {
        logger.error('Error describing app:', error);
        res.status(500).json({ error: 'Failed to describe app', details: error });
    }
});

router.post('/apps/:name/reload', async (req, res) => {
    const appName = req.params.name;
    try {
        await reloadApp(appName);
        res.json({ message: `App ${appName} reloaded successfully` });
    } catch (error) {
        logger.error('Error reloading app:', error);
        res.status(500).json({ error: 'Failed to reload app', details: error });
    }
});

router.post('/apps/:name/stop', async (req, res) => {
    const appName = req.params.name;
    try {
        await stopApp(appName);
        res.json({ message: `App ${appName} stopped successfully` });
    } catch (error) {
        logger.error('Error stopping app:', error);
        res.status(500).json({ error: 'Failed to stop app', details: error });
    }
});

router.post('/apps/:name/restart', async (req, res) => {
    const appName = req.params.name;
    try {
        await restartApp(appName);
        res.json({ message: `App ${appName} restarted successfully` });
    } catch (error) {
        logger.error('Error restarting app:', error);
        res.status(500).json({ error: 'Failed to restart app', details: error });
    }
});

router.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource does not exist.',
    });
});

export default router;
