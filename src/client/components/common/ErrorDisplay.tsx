import { AlertTriangle } from 'lucide-react';
import { ReactNode } from 'react';

export interface ErrorDisplayProps {
    className?: string;
    message?: string;
    error: Error | string;
    icon?: ReactNode;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
    className = 'py-9',
    message,
    error,
    icon,
}) => (
    <div
        className={
            'flex flex-col justify-center items-center w-full h-full -mt-16 gap-3 text-lg text-center ' +
            className
        }
    >
        {icon || <AlertTriangle className="h-9 w-9" />}
        {message && <p>{message}</p>}
        <p>{error instanceof Error ? error.message : String(error)}</p>
    </div>
);
