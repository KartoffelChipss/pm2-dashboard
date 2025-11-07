import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../../util/env.js';

interface TokenPayload {
    name: string;
    iat?: number;
    exp?: number;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.token as string | undefined;

    if (!authHeader && !cookieToken) {
        res.set('WWW-Authenticate', 'Bearer realm="PM2 Dashboard"');
        return res.status(401).send({ error: 'Authentication required.' });
    }

    const token = authHeader
        ? authHeader.startsWith('Bearer ')
            ? authHeader.slice(7)
            : authHeader
        : cookieToken;

    if (!token) {
        res.set('WWW-Authenticate', 'Bearer realm="PM2 Dashboard"');
        return res.status(401).send({ error: 'Authentication required.' });
    }

    try {
        const payload = jwt.verify(token, TOKEN_SECRET) as TokenPayload;
        (req as any).user = payload;
        return next();
    } catch {
        res.set('WWW-Authenticate', 'Bearer realm="PM2 Dashboard", error="invalid_token"');
        return res.status(401).send({
            error: 'Invalid or expired token.',
        });
    }
};

export default authenticate;
