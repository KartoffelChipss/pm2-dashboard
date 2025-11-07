import { isPM2AppStatus, PM2AppInfo, PM2AppStatus } from '../types/pm2.js';
import pm2 from 'pm2';

let pm2Connected = false;
let pm2Connecting: Promise<void> | null = null;

function ensurePm2Connected(): Promise<void> {
    if (pm2Connected) return Promise.resolve();
    if (pm2Connecting) return pm2Connecting;

    pm2Connecting = new Promise((resolve, reject) => {
        pm2.connect((err) => {
            pm2Connecting = null;
            if (err) return reject(err);
            pm2Connected = true;
            resolve();
        });
    });

    return pm2Connecting;
}

process.on('exit', () => {
    try {
        if (pm2Connected) pm2.disconnect();
    } catch {
        // ignore
    }
});

function parseStatus(status: string | undefined): PM2AppStatus | undefined {
    if (status && isPM2AppStatus(status)) return status;
    else return undefined;
}

/**
 * Lists all PM2 managed applications with their status and resource usage.
 * @returns A promise that resolves to an array of application information.
 */
export function listApps(): Promise<PM2AppInfo[]> {
    return new Promise((resolve, reject) => {
        ensurePm2Connected()
            .then(() => {
                pm2.list((err, apps) => {
                    if (err) return reject(err);
                    try {
                        const newApps: PM2AppInfo[] = apps
                            .filter((app) => app.pm2_env?.pm_exec_path !== undefined)
                            .map((app) => {
                                if (!app.name || app.pm_id === undefined) {
                                    throw new Error('Invalid PM2 app data');
                                }

                                return {
                                    name: app.name,
                                    pm_id: app.pm_id,
                                    status: parseStatus(app.pm2_env?.status),
                                    cpu: app.monit?.cpu,
                                    memory: app.monit?.memory,
                                    uptime: app.pm2_env?.pm_uptime,
                                    pm_out_log_path: app.pm2_env?.pm_out_log_path,
                                    pm_err_log_path: app.pm2_env?.pm_err_log_path,
                                    pm2_env_cwd: app.pm2_env?.pm_cwd,
                                };
                            });
                        resolve(newApps);
                    } catch (e) {
                        reject(e);
                    }
                });
            })
            .catch(reject);
    });
}

/**
 * Describes a specific PM2 managed application by its name.
 * @param appName The name of the application to describe.
 * @returns A promise that resolves to the application information or null if not found.
 */
export function describeApp(appName: string | number): Promise<PM2AppInfo | null> {
    return new Promise((resolve, reject) => {
        ensurePm2Connected()
            .then(() => {
                pm2.describe(appName, (err, apps) => {
                    if (err) return reject(err);
                    if (Array.isArray(apps) && apps.length > 0) {
                        for (const app of apps) {
                            if (!app.name || app.pm_id === undefined) continue;

                            if (app.name === appName) {
                                const appInfo: PM2AppInfo = {
                                    name: app.name,
                                    pm_id: app.pm_id,
                                    status: parseStatus(app.pm2_env?.status),
                                    cpu: app.monit?.cpu,
                                    memory: app.monit?.memory,
                                    uptime: app.pm2_env?.pm_uptime,
                                    pm_out_log_path: app.pm2_env?.pm_out_log_path,
                                    pm_err_log_path: app.pm2_env?.pm_err_log_path,
                                    pm2_env_cwd: app.pm2_env?.pm_cwd,
                                };
                                resolve(appInfo);
                                return;
                            }
                        }

                        resolve(null);
                    } else {
                        resolve(null);
                    }
                });
            })
            .catch(reject);
    });
}

/**
 * Reloads a PM2 managed application.
 * @param process The name or ID of the process to reload.
 * @returns A promise that resolves when the process is reloaded.
 */
export function reloadApp(process: string | number): Promise<void> {
    return new Promise((resolve, reject) => {
        ensurePm2Connected()
            .then(() => {
                pm2.reload(process, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            })
            .catch(reject);
    });
}

/**
 * Stops a PM2 managed application.
 * @param process The name or ID of the process to stop.
 * @returns A promise that resolves when the process is stopped.
 */
export function stopApp(process: string | number): Promise<void> {
    return new Promise((resolve, reject) => {
        ensurePm2Connected()
            .then(() => {
                pm2.stop(process, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            })
            .catch(reject);
    });
}

/**
 * Restarts a PM2 managed application.
 * @param process The name or ID of the process to restart.
 * @returns A promise that resolves when the process is restarted.
 */
export function restartApp(process: string | number): Promise<void> {
    return new Promise((resolve, reject) => {
        ensurePm2Connected()
            .then(() => {
                pm2.restart(process, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            })
            .catch(reject);
    });
}

/**
 * Starts a new PM2 managed application.
 * @param process The process configuration object.
 * @returns A promise that resolves when the process is started.
 */
export function startApp(process: {
    name: string;
    script: string;
    args?: string[];
    cwd?: string;
}): Promise<void> {
    return new Promise((resolve, reject) => {
        ensurePm2Connected()
            .then(() => {
                pm2.start(process, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            })
            .catch(reject);
    });
}

/** * Deletes a PM2 managed application.
 * @param process The name or ID of the process to delete.
 * @returns A promise that resolves when the process is deleted.
 */
export function deleteApp(process: string | number): Promise<void> {
    return new Promise((resolve, reject) => {
        ensurePm2Connected()
            .then(() => {
                pm2.delete(process, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            })
            .catch(reject);
    });
}
