import { LoaderCircle } from 'lucide-react';

export interface LoadingDisplayProps {
    className?: string;
    message?: string;
}

export const LoadingDisplay: React.FC<LoadingDisplayProps> = ({
    className = 'py-9 h-full',
    message,
}) => (
    <div className={'flex flex-col justify-center items-center gap-3 text-lg ' + className}>
        <LoaderCircle className="animate-spin h-9 w-9" />
        {message && <p>{message}</p>}
    </div>
);
