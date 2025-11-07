import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function useLogsStream(appName?: string | null) {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!appName) return;

        const url = `/api/apps/${encodeURIComponent(appName)}/logs/stream`;
        console.log('Connecting to SSE for app logs stream at', url);
        const es = new EventSource(url, { withCredentials: true });

        es.onopen = () => {
            console.log('SSE connection opened for app logs stream', url);
        };

        es.onmessage = (e) => {
            try {
                const payload = JSON.parse(e.data);
                console.log('Received SSE payload for app logs stream:', payload);
                queryClient.setQueryData(['appLogs', appName], (old: any) => {
                    if (!old) return payload;
                    if (payload && payload.error) return payload;
                    return {
                        ...old,
                        ...payload,
                    };
                });
            } catch (err) {
                console.warn('Failed to parse SSE message for app logs stream', err);
            }
        };

        es.onerror = (ev) => {
            console.warn('SSE error for app logs stream', ev);
            if (es.readyState === EventSource.CLOSED) {
                try {
                    es.close();
                } catch {
                    // ignore
                }
            }
        };

        return () => {
            try {
                es.close();
            } catch {
                // ignore
            }
        };
    }, [appName, queryClient]);
}
