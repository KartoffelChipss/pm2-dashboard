import { Op } from 'sequelize';
import { db } from '../db/initDatabase.js';
import cron from 'node-cron';
import logger from '../util/logging/logger.js';

export class HistoryCleaner {
    private static readonly MAX_HISTORY_AGE_MILLIS = 12 * 60 * 60 * 1000; // 12 hours
    private static task?: cron.ScheduledTask;

    /**
     * Start the scheduled cleanup task if not already running
     */
    public static startScheduledCleanup(): void {
        if (this.task) {
            logger.warn('History cleanup task is already running.');
            return;
        }

        // Schedule the cleanup to run every hour
        this.task = cron.schedule(
            '0 * * * *',
            async () => {
                logger.info('Running scheduled history cleanup...');
                try {
                    await this.cleanOldHistoryEntries();
                } catch (error) {
                    logger.error('Scheduled history cleanup failed:', error);
                }
            },
            {
                timezone: 'UTC',
            }
        );

        this.task.start();
        logger.info('Started scheduled history cleanup task to run every hour.');
    }

    /**
     * Stop the scheduled cleanup task if running
     */
    public static stopScheduledCleanup(): void {
        if (!this.task) {
            logger.warn('History cleanup task is not running.');
            return;
        }

        this.task.stop();
        this.task = undefined;
        logger.info('Stopped scheduled history cleanup task.');
    }

    public static async cleanOldHistoryEntries(): Promise<void> {
        const count = await db.History.destroy({
            where: {
                ts: {
                    [Op.lt]: Date.now() - HistoryCleaner.MAX_HISTORY_AGE_MILLIS,
                },
            },
        });
        logger.info(`Cleaned up ${count} old history entries.`);
    }
}
