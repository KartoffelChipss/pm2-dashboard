import { AlertTriangle } from 'lucide-react';

interface FormErrorBoxProps {
    error?: string | null;
    className?: string;
}

export const FormErrorBox = ({ error, className }: FormErrorBoxProps) => {
    if (!error) return null;

    return (
        <div
            className={`bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg ${className}`}
        >
            <AlertTriangle className="h-4 w-4 inline mr-2" />
            {error}
        </div>
    );
};
