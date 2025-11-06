import logger from '../util/logging/logger.js';
import { sequelize } from './sequelize.js';
import { initModels } from './models/index.js';

export let db: ReturnType<typeof initModels>;

export async function initDatabase() {
    try {
        await sequelize.authenticate();
        logger.info('Database connection has been established successfully.');
        db = initModels(sequelize);
        await sequelize.sync({ alter: false });
        logger.info('Database tables created or updated.');
    } catch (error) {
        logger.error('Unable to initialize database:', error);
        throw error;
    }
}
