import express from 'express';
import ViteExpress from 'vite-express';
import apiRouter from './routes/api/index.js';
import { startPolling } from './pm2-history.js';
import { PORT } from './util/env.js';
import logger from './util/logging/logger.js';
import { initDatabase } from './db/initDatabase.js';
import cookieParser from 'cookie-parser';
import { HistoryCleaner } from './services/HistoryCleaner.js';

(async () => {
    await initDatabase();
    logger.info('Database ready.');

    const app = express();

    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    startPolling(5000); // poll every 5s

    HistoryCleaner.startScheduledCleanup();

    app.use('/api', apiRouter);

    ViteExpress.listen(app, PORT, () => logger.info(`Server is listening on port ${PORT}...`));
})();
