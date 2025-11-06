export function formatMemory(memory: number | undefined) {
    if (!memory) return 'N/A';
    return (memory / 1024 / 1024).toFixed(2) + ' MB';
}

function convertToUnit(bytes: number, unit: 'B' | 'KB' | 'MB' | 'GB' | 'TB' | string): number {
    return bytes / Math.pow(1024, ['B', 'KB', 'MB', 'GB', 'TB'].indexOf(unit));
}

export function convertMemoryToOptimalUnit(bytes: number, decimalPlaces = 2) {
    if (bytes < 1024) {
        return bytes.toFixed(0) + 'B';
    } else if (bytes < 1024 * 1024) {
        return convertToUnit(bytes, 'KB').toFixed(decimalPlaces) + 'KB';
    } else if (bytes < 1024 * 1024 * 1024) {
        return convertToUnit(bytes, 'MB').toFixed(decimalPlaces) + 'MB';
    } else if (bytes < 1024 * 1024 * 1024 * 1024) {
        return convertToUnit(bytes, 'GB').toFixed(decimalPlaces) + 'GB';
    } else {
        return convertToUnit(bytes, 'TB').toFixed(decimalPlaces) + 'TB';
    }
}
