import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

const LogsDisplay = ({ appName }: { appName: string }) => {
    const [logsKind, setLogsKind] = useState<'info' | 'error'>('info');
    const containerRef = useRef<HTMLDivElement | null>(null);

    const {
        data: logs,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['appLogs', appName],
        queryFn: async () => {
            const response = await fetch(`/api/apps/${encodeURIComponent(appName)}/logs?lines=100`);
            if (!response.ok) {
                throw new Error('Failed to fetch logs');
            }
            return response.json() as Promise<{ infoLogs: string; errorLogs: string }>;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
    }, [logsKind, logs?.infoLogs, logs?.errorLogs]);

    if (isLoading) {
        return <div>Loading logs...</div>;
    }

    if (isError) {
        return <div>Error loading logs</div>;
    }

    return (
        <div className="card col-span-2 p-4 py-3 w-full gap-4 flex flex-col min-h-0">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Logs</h2>
                <select
                    value={logsKind}
                    onChange={(e) => setLogsKind(e.target.value as 'info' | 'error')}
                    className="select"
                >
                    <option value="info">Info Logs</option>
                    <option value="error">Error Logs</option>
                </select>
            </div>
            <div className="border -mt-2" />
            <div ref={containerRef} className="max-h-130 overflow-auto max-w-full">
                {logsKind === 'info' ? (
                    <pre dangerouslySetInnerHTML={{ __html: logs?.infoLogs ?? '' }}></pre>
                ) : (
                    <pre dangerouslySetInnerHTML={{ __html: logs?.errorLogs ?? '' }}></pre>
                )}
            </div>
        </div>
    );
};

export default LogsDisplay;
