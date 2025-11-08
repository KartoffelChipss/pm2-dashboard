export function formatCpu(cpu: number | null | undefined): string {
    if (cpu === null || cpu === undefined || isNaN(cpu)) return 'N/A';
    return `${cpu.toFixed(2)}%`;
}
