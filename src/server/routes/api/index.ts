import express from 'express';
import appsRouter from './apps.js';
import logsRouter from './logs.js';
import authRouter from './auth.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/apps', logsRouter);
router.use('/apps', appsRouter);

router.use((_, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource does not exist.',
    });
});

export default router;
