import { mkdirSync } from 'fs';
import { config } from 'dotenv';
config({
    quiet: true,
});

if (!process.env.CONFIG_PATH)
    throw new Error('CONFIG_PATH is not defined in environment variables');
if (!process.env.USERNAME) throw new Error('USERNAME is not defined in environment variables');
if (!process.env.PASSWORD) throw new Error('PASSWORD is not defined in environment variables');
if (!process.env.TOKEN_SECRET)
    throw new Error('TOKEN_SECRET is not defined in environment variables');

mkdirSync(process.env.CONFIG_PATH, { recursive: true });

function envNumber(envVar: string, defaultValue: number): number {
    const value = process.env[envVar];
    if (value === undefined || value === null) {
        return defaultValue;
    }
    const parsed = Number(value);
    return isNaN(parsed) ? defaultValue : parsed;
}

export const NODE_ENV: string = process.env.NODE_ENV || 'development';
export const isProduction: boolean = NODE_ENV === 'production';
export const PORT: number = envNumber('PORT', 56000);
/** The path to the config files, db, user profile pictures, etc. */
export const CONFIG_PATH: string = process.env.CONFIG_PATH as string;
export const USERNAME = process.env.USERNAME as string;
export const PASSWORD = process.env.PASSWORD as string;

// Token configuration for JWT-based auth
export const TOKEN_SECRET = process.env.TOKEN_SECRET as string;
export const TOKEN_EXPIRATION_SECONDS = envNumber('TOKEN_EXPIRATION_SECONDS', 3600);
export const SECURE_COOKIES: boolean = process.env.SECURE_COOKIES === 'true';
