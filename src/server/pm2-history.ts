import pm2 from 'pm2';
import logger from './util/logging/logger.js';
import { db } from './db/initDatabase.js';
import { Op } from 'sequelize';
import { PM2AppHistory } from '../types/pm2.js';
import { sequelize } from './db/sequelize.js';

export async function pollOnce(): Promise<void> {
    return new Promise((resolve, reject) => {
        pm2.connect((err) => {
            if (err) return reject(err);
            pm2.list(async (err, apps) => {
                pm2.disconnect();
                if (err) return reject(err);
                const ts = Date.now();
                const t = await sequelize.transaction();
                try {
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

                        await db.History.create(sample, { transaction: t });
                    }
                    await t.commit();
                    resolve();
                } catch (error) {
                    await t.rollback();
                    reject(error);
                }
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

/**
 * Read history samples for a given pm_id within an optional time range.
 * @param pm_id The PM2 process ID.
 * @param fromTs The start timestamp (inclusive).
 * @param toTs The end timestamp (inclusive).
 * @returns An array of PM2AppHistory samples.
 */
export async function readHistory(
    pm_id: number,
    fromTs?: number,
    toTs?: number
): Promise<PM2AppHistory> {
    if (pm_id < 0) return [];

    const whereClause: any = { pm_id };
    if (fromTs !== undefined) {
        whereClause.ts = { ...(whereClause.ts || {}), [Op.gte]: fromTs };
    }
    if (toTs !== undefined) {
        whereClause.ts = { ...(whereClause.ts || {}), [Op.lte]: toTs };
    }

    const samples = await db.History.findAll({ where: whereClause, order: [['ts', 'ASC']] });
    return samples.map((s) => s.toJSON());
}
