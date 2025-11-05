export type PM2AppInfo = {
    name: string;
    pm_id: number;
    status?: string;
    cpu?: number;
    memory?: number;
    uptime?: number;
    pm_out_log_path?: string;
    pm_err_log_path?: string;
    pm2_env_cwd?: string;
};

export type PM2AppHistorySample = {
    /** Timestamp of the sample */
    ts: number;
    pm_id: number;
    name: string;
    status: string | null;
    cpu: number | null;
    memory: number | null;
    uptime: number | null;
};

export type PM2AppHistory = PM2AppHistorySample[];
