import pm2 from 'pm2';
import { PM2AppInfo } from '../types/pm2.js';

/**
 * Lists all PM2 managed applications with their status and resource usage.
 * @returns A promise that resolves to an array of application information.
 */
export function listApps(): Promise<PM2AppInfo[]> {
    return new Promise((resolve, reject) => {
        pm2.connect((err) => {
            if (err) {
                reject(err);
            }
            pm2.list((err, apps) => {
                pm2.disconnect();
                if (err) {
                    reject(err);
                }
                const newApps: PM2AppInfo[] = apps
                    .filter((app) => app.pm2_env?.pm_exec_path !== undefined)
                    .map((app) => {
                        if (!app.name || app.pm_id === undefined) {
                            throw new Error('Invalid PM2 app data');
                        }

                        return {
                            name: app.name,
                            pm_id: app.pm_id,
                            status: app.pm2_env?.status,
                            cpu: app.monit?.cpu,
                            memory: app.monit?.memory,
                            uptime: app.pm2_env?.pm_uptime,
                            pm_out_log_path: app.pm2_env?.pm_out_log_path,
                            pm_err_log_path: app.pm2_env?.pm_err_log_path,
                            pm2_env_cwd: app.pm2_env?.pm_cwd,
                        };
                    });
                resolve(newApps);
            });
        });
    });
}

/**
 * Describes a specific PM2 managed application by its name.
 * @param appName The name of the application to describe.
 * @returns A promise that resolves to the application information or null if not found.
 */
export function describeApp(appName: string): Promise<PM2AppInfo | null> {
    return new Promise((resolve, reject) => {
        pm2.connect((err) => {
            if (err) {
                reject(err);
            }
            pm2.describe(appName, (err, apps) => {
                pm2.disconnect();
                if (err) {
                    reject(err);
                }
                if (Array.isArray(apps) && apps.length > 0) {
                    for (const app of apps) {
                        if (!app.name || app.pm_id === undefined) continue;

                        if (app.name === appName) {
                            const appInfo: PM2AppInfo = {
                                name: app.name,
                                pm_id: app.pm_id,
                                status: app.pm2_env?.status,
                                cpu: app.monit?.cpu,
                                memory: app.monit?.memory,
                                uptime: app.pm2_env?.pm_uptime,
                                pm_out_log_path: app.pm2_env?.pm_out_log_path,
                                pm_err_log_path: app.pm2_env?.pm_err_log_path,
                                pm2_env_cwd: app.pm2_env?.pm_cwd,
                            };
                            resolve(appInfo);
                        }
                    }
                } else {
                    resolve(null);
                }
            });
        });
    });
}

/**
 * Reloads a PM2 managed application.
 * @param process The name or ID of the process to reload.
 * @returns A promise that resolves when the process is reloaded.
 */
export function reloadApp(process: string | number): Promise<void> {
    return new Promise((resolve, reject) => {
        pm2.connect((err) => {
            if (err) {
                reject(err);
            }
            pm2.reload(process, (err, proc) => {
                pm2.disconnect();
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    });
}

/**
 * Stops a PM2 managed application.
 * @param process The name or ID of the process to stop.
 * @returns A promise that resolves when the process is stopped.
 */
export function stopApp(process: string | number): Promise<void> {
    return new Promise((resolve, reject) => {
        pm2.connect((err) => {
            if (err) {
                reject(err);
            }
            pm2.stop(process, (err, proc) => {
                pm2.disconnect();
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    });
}

/**
 * Restarts a PM2 managed application.
 * @param process The name or ID of the process to restart.
 * @returns A promise that resolves when the process is restarted.
 */
export function restartApp(process: string | number): Promise<void> {
    return new Promise((resolve, reject) => {
        pm2.connect((err) => {
            if (err) {
                reject(err);
            }
            pm2.restart(process, (err, proc) => {
                pm2.disconnect();
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    });
}
