import pm2 from 'pm2';
import fs from 'fs';
import path from 'path';
import { CONFIG_PATH } from './util/env.js';
import logger from './util/logging/logger.js';

const DATA_DIR = path.resolve(CONFIG_PATH, 'pm2-metrics');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

export async function pollOnce(): Promise<void> {
    return new Promise((resolve, reject) => {
        pm2.connect((err) => {
            if (err) return reject(err);
            pm2.list((err, apps) => {
                pm2.disconnect();
                if (err) return reject(err);
                const ts = Date.now();
                for (const app of apps) {
                    if (app.pm_id === undefined || !app.name) continue;
                    const sample = {
                        ts,
                        pm_id: app.pm_id,
                        name: app.name,
                        status: app.pm2_env?.status ?? null,
                        cpu: app.monit?.cpu ?? null,
                        memory: app.monit?.memory ?? null,
                        uptime: app.pm2_env?.pm_uptime ?? null,
                    };
                    const file = path.join(DATA_DIR, `${app.pm_id}.jsonl`);
                    fs.appendFileSync(file, JSON.stringify(sample) + '\n');
                }
                resolve();
            });
        });
    });
}

export function startPolling(intervalMs = 10_000) {
    void pollOnce().catch((e) => logger.error('pm2 poll error:', e));
    const id = setInterval(() => {
        void pollOnce().catch((e) => logger.error('pm2 poll error:', e));
    }, intervalMs);
    return () => clearInterval(id);
}

export function readHistory(pm_id: number, fromTs?: number, toTs?: number) {
    if (pm_id < 0) return [];
    const files: string[] = [];
    const f = path.join(DATA_DIR, `${pm_id}.jsonl`);
    if (fs.existsSync(f)) files.push(f);

    const samples: Array<Record<string, any>> = [];
    for (const f of files) {
        const content = fs.readFileSync(f, 'utf8').trim();
        if (!content) continue;
        for (const line of content.split('\n')) {
            try {
                const s = JSON.parse(line);
                if ((fromTs && s.ts < fromTs) || (toTs && s.ts > toTs)) continue;
                samples.push(s);
            } catch {
                // skip malformed line
            }
        }
    }

    // sort by timestamp ascending
    samples.sort((a, b) => a.ts - b.ts);
    return samples;
}
