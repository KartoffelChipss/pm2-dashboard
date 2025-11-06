export function formatMemory(memory: number | undefined) {
    if (!memory) return 'N/A';
    return (memory / 1024 / 1024).toFixed(2) + ' MB';
}
