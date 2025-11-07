import { useMutation } from '@tanstack/react-query';
import { Boxes, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);

        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const logoutMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error('Logout failed');
            }
        },
        onSuccess: () => {
            navigate('/login');
        },
    });

    return (
        <div className="w-full flex justify-center">
            <div className="h-full flex flex-col w-full max-w-[1440px]">
                <header
                    className={`p-4 flex items-center justify-between w-full sticky top-0 backdrop-blur z-10 transition-border h-16 ${
                        scrolled ? 'border-b' : ''
                    }`}
                >
                    <a href="/" className="text-inherit no-underline">
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Boxes className="text-primary" />
                            PM2 Dashboard
                        </h1>
                    </a>
                    <nav className="flex items-start gap-4">
                        <button
                            onClick={() => logoutMutation.mutate()}
                            className={`btn-icon-ghost`}
                            aria-label="Logout"
                        >
                            <LogOut />
                        </button>
                    </nav>
                </header>
                <main className="p-4">{children}</main>
            </div>
        </div>
    );
};

export default Layout;
