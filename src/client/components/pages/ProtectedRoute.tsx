import { ReactNode, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: ReactNode;
    unauthorizedPage?: ReactNode;
    requiredRole?: string;
}

const fetchMe = async () => {
    const response = await fetch('/api/auth/me');
    if (!response.ok) throw new Error('Not authenticated');
    return response.json();
};

export default function ProtectedRoute({
    children,
    unauthorizedPage,
    requiredRole,
}: ProtectedRouteProps) {
    const navigate = useNavigate();

    const {
        data: me,
        isLoading: meLoading,
        isError: meError,
    } = useQuery({
        queryKey: ['me'],
        queryFn: fetchMe,
        retry: 1,
        refetchInterval: 5_000_000,
    });

    useEffect(() => {
        if (meError || (!meLoading && !me)) {
            navigate('/login', { replace: true });
        }
    }, [meError, meLoading, me, navigate]);

    const [showSpinner, setShowSpinner] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setShowSpinner(true), 500);
        return () => clearTimeout(t);
    }, [meLoading]);

    const deciding = meLoading || meError || (!meLoading && !me);
    if (deciding) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                {showSpinner && <Loader2 className="animate-spin h-8 w-8" />}
            </div>
        );
    }

    if (!me) return null;

    if (requiredRole && !me.roles?.includes(requiredRole)) {
        if (unauthorizedPage) return unauthorizedPage;
        navigate('/unauthorized', { replace: true });
        return null;
    }

    return <>{children}</>;
}
