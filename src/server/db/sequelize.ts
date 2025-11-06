import { Sequelize } from 'sequelize';
import logger from '../util/logging/logger.js';
import path from 'path';
import { CONFIG_PATH } from '../util/env.js';

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(CONFIG_PATH, 'pm2-dashboard.sqlite'),
    logging: (msg) => logger.debug(`[DB] ${msg}`),
});
