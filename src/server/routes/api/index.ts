import express from 'express';
import appsRouter from './apps.js';

const router = express.Router();

router.use('/apps', appsRouter);

router.use((_, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource does not exist.',
    });
});

export default router;
