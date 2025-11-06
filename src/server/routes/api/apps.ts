import express from 'express';
import logger from '../../util/logging/logger.js';
import {
    deleteApp,
    describeApp,
    listApps,
    reloadApp,
    restartApp,
    stopApp,
} from '../../pm2Helpers.js';
import { readHistory } from '../../pm2-history.js';

const router = express.Router();

router.get('/', async (_, res) => {
    try {
        const apps = await listApps();
        res.json(apps);
    } catch (error) {
        logger.error('Error listing apps:', error);
        res.status(500).json({ error: 'Failed to list apps', details: error });
    }
});

router.get('/:name', async (req, res) => {
    const appName = req.params.name;
    try {
        const appInfo = await describeApp(appName);
        const history = readHistory(appInfo?.pm_id ?? -1);
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

router.post('/:name/reload', async (req, res) => {
    const appName = req.params.name;
    try {
        await reloadApp(appName);
        res.json({ message: `App ${appName} reloaded successfully` });
    } catch (error) {
        logger.error('Error reloading app:', error);
        res.status(500).json({ error: 'Failed to reload app', details: error });
    }
});

router.post('/:name/stop', async (req, res) => {
    const appName = req.params.name;
    try {
        await stopApp(appName);
        res.json({ message: `App ${appName} stopped successfully` });
    } catch (error) {
        logger.error('Error stopping app:', error);
        res.status(500).json({ error: 'Failed to stop app', details: error });
    }
});

router.post('/:name/restart', async (req, res) => {
    const appName = req.params.name;
    try {
        await restartApp(appName);
        res.json({ message: `App ${appName} restarted successfully` });
    } catch (error) {
        logger.error('Error restarting app:', error);
        res.status(500).json({ error: 'Failed to restart app', details: error });
    }
});

router.delete('/:name', async (req, res) => {
    const appName = req.params.name;
    try {
        await deleteApp(appName);
        res.json({ message: `App ${appName} deleted successfully` });
    } catch (error) {
        logger.error('Error deleting app:', error);
        res.status(500).json({ error: 'Failed to delete app', details: error });
    }
});

export default router;
