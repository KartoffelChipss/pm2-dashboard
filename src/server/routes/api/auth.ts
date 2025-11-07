import express, { Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import {
    USERNAME,
    PASSWORD,
    TOKEN_SECRET,
    TOKEN_EXPIRATION_SECONDS,
    SECURE_COOKIES,
} from '../../util/env.js';
import logger from '../../util/logging/logger.js';
import authenticate from '../../db/middleware/authenticate.js';

const router = express.Router();

/**
 * Compares two buffers for equality in a timing-safe manner.
 * @param a The first buffer.
 * @param b The second buffer.
 * @returns True if the buffers are equal, false otherwise.
 */
function safeEqual(a: Buffer, b: Buffer) {
    if (a.length !== b.length) {
        const dummy = crypto.randomBytes(Math.max(a.length, b.length));
        crypto.timingSafeEqual(
            Buffer.concat([a, Buffer.alloc(dummy.length - a.length)]),
            Buffer.concat([dummy, Buffer.alloc(a.length ? 0 : 1)])
        );
        return false;
    }
    return crypto.timingSafeEqual(a, b);
}

router.get('/me', authenticate, (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        return res.json({ user });
    } catch (error) {
        logger.error('Error fetching user info:', error);
        return res.status(500).json({ error: 'Failed to fetch user info', details: error });
    }
});

router.post('/login', (req: Request, res: Response) => {
    try {
        const username = (req.body && (req.body.username || req.body.name)) as string | undefined;
        const password = (req.body && req.body.password) as string | undefined;

        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        if (!username || !password) {
            return res.status(400).json({ error: 'Missing credentials' });
        }

        if (username !== USERNAME || !safeEqual(Buffer.from(password), Buffer.from(PASSWORD))) {
            res.set('WWW-Authenticate', 'Basic realm="PM2 Dashboard"');
            logger.warn(`Failed login attempt for user '${username}' from IP: ${ip}`);
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ name: USERNAME }, TOKEN_SECRET, {
            expiresIn: TOKEN_EXPIRATION_SECONDS,
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: SECURE_COOKIES,
            maxAge: TOKEN_EXPIRATION_SECONDS * 1000,
            sameSite: 'lax',
        });

        logger.info(`User '${username}' logged in successfully from IP: ${ip}`);

        return res.status(200).json({ message: 'Logged in successfully' });
    } catch (error) {
        logger.error('Login error:', error);
        return res.status(500).json({ error: 'Login failed', details: error });
    }
});

router.post('/logout', (req: Request, res: Response) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: SECURE_COOKIES,
            sameSite: 'lax',
        });
        return res.json({ message: 'Logged out successfully.' });
    } catch (error) {
        logger.error('Logout error:', error);
        return res.status(500).json({ error: 'Logout failed', details: error });
    }
});

export default router;
