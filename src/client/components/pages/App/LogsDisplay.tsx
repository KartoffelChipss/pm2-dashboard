import DOMPurify from 'dompurify';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import '../../../ansiColors.css';
import useLogsStream from '../../../hooks/useLogsStream';
import { LoadingDisplay } from '../../common/LoadingDisplay';

function sanitizeAllowOnlySpanClass(html: string) {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['span'],
        ALLOWED_ATTR: ['class'],
    });
}

const LogsDisplay = ({ appName }: { appName: string }) => {
    const [logsKind, setLogsKind] = useState<'info' | 'error'>('info');
    const containerRef = useRef<HTMLDivElement | null>(null);

    useLogsStream(appName);

    const {
        data: logs,
        isLoading,
        error: logsError,
    } = useQuery({
        queryKey: ['appLogs', appName],
        queryFn: async () => {
            const response = await fetch(`/api/apps/${encodeURIComponent(appName)}/logs?lines=100`);
            if (!response.ok) {
                throw new Error('Failed to fetch logs');
            }
            return response.json() as Promise<{ infoLogs: string; errorLogs: string }>;
        },
    });

    const cleanInfoHtml = useMemo(
        () => sanitizeAllowOnlySpanClass(logs?.infoLogs ?? ''),
        [logs?.infoLogs]
    );

    const cleanErrorHtml = useMemo(
        () => sanitizeAllowOnlySpanClass(logs?.errorLogs ?? ''),
        [logs?.errorLogs]
    );

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
    }, [logsKind, logs?.infoLogs, logs?.errorLogs]);

    return (
        <div className="card col-span-2 p-4 py-3 w-full gap-4 flex flex-col min-h-0">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Logs</h2>
                <select
                    value={logsKind}
                    onChange={(e) => setLogsKind(e.target.value as 'info' | 'error')}
                    className="select"
                    disabled={isLoading}
                >
                    <option value="info">Info Logs</option>
                    <option value="error">Error Logs</option>
                </select>
            </div>
            <div className="border -mt-2" />
            {isLoading && <LoadingDisplay message="Loading logs..." className="h-full -mt-6" />}
            {logsError && (
                <div className="text-destructive">
                    Error loading logs: {(logsError as Error).message}
                </div>
            )}
            {!isLoading && !logsError && logs && (
                <div ref={containerRef} className="max-h-130 overflow-auto max-w-full">
                    {logsKind === 'info' ? (
                        <pre
                            dangerouslySetInnerHTML={{ __html: cleanInfoHtml }}
                            className="font-mono"
                        ></pre>
                    ) : (
                        <pre
                            dangerouslySetInnerHTML={{ __html: cleanErrorHtml }}
                            className="font-mono"
                        ></pre>
                    )}
                </div>
            )}
        </div>
    );
};

export default LogsDisplay;
