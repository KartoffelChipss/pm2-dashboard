import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook that opens an EventSource to stream `{ appInfo, history }` payloads
 * from the server and writes them into React Query cache under ['app', appName].
 */
export default function useAppStream(appName?: string | null) {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!appName) return;

        const url = `/api/apps/${encodeURIComponent(appName)}/stream`;
        const es = new EventSource(url);

        es.onmessage = (e) => {
            try {
                const payload = JSON.parse(e.data);
                console.log('Received SSE payload for app stream:', payload);
                queryClient.setQueryData(['app', appName], payload);
            } catch (err) {
                console.warn('Failed to parse SSE message for app stream', err);
            }
        };

        es.onerror = () => {
            if (es.readyState === EventSource.CLOSED) es.close();
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
