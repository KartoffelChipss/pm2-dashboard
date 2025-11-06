export function formatUptime(uptime: number | undefined, maxElements = 2) {
    const startTime = uptime ? new Date(uptime) : null;
    if (!startTime) return 'N/A';

    const now = new Date();
    const diff = now.getTime() - startTime.getTime();

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0) parts.push(`${seconds}s`);

    return parts.slice(0, maxElements).join(' ');
}
