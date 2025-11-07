import { Boxes, LogOut, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

const Layout = ({
    children,
    activeSection,
}: {
    children: React.ReactNode;
    activeSection?: string;
}) => {
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

    return (
        <div className="w-full flex justify-center">
            <div className="h-full flex flex-col w-full max-w-[1440px]">
                <header
                    className={`p-4 flex items-center justify-between w-full sticky top-0 backdrop-blur z-10 transition-border ${
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
                        <a
                            href="/settings"
                            className={`${activeSection === 'settings' ? 'btn-icon' : 'btn-icon-ghost'}`}
                            aria-label="Settings"
                        >
                            <Settings />
                        </a>
                        <a
                            href="/logout"
                            className={`${activeSection === 'logout' ? 'btn-icon' : 'btn-icon-ghost'}`}
                            aria-label="Logout"
                        >
                            <LogOut />
                        </a>
                    </nav>
                </header>
                <main className="p-4">{children}</main>
            </div>
        </div>
    );
};

export default Layout;
