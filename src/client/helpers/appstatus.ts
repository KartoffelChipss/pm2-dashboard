import { PM2AppStatus } from '../../types/pm2';

export function getStatusColorClass(status?: PM2AppStatus) {
    switch (status) {
        case 'online':
            return 'bg-emerald-500';
        case 'stopped':
            return 'bg-destructive';
        case 'stopping':
        case 'launching':
            return 'bg-orange-500';
        default:
            return 'bg-secondary';
    }
}

export function getStatusText(status?: PM2AppStatus) {
    switch (status) {
        case 'online':
            return 'Online';
        case 'stopped':
            return 'Stopped';
        case 'stopping':
            return 'Stopping';
        case 'launching':
            return 'Launching';
        default:
            return 'Unknown';
    }
}
