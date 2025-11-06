import { Boxes, ChartColumn, House, LayoutGrid, Settings } from 'lucide-react';

const Layout = ({
    children,
    activeSection,
}: {
    children: React.ReactNode;
    activeSection?: string;
}) => {
    return (
        <div className="h-full flex flex-col bg-card max-w-full">
            <header className="p-4 flex items-center min-h-16 h-16 border-b">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Boxes className="text-primary" />
                    PM2 Dashboard
                </h1>
            </header>
            <div className="flex w-full h-full max-w-full">
                <aside className="flex h-full flex-col p-4 border-r">
                    <nav className="flex flex-col items-start gap-4">
                        <a
                            href="/"
                            className={`${activeSection === 'home' ? 'btn-icon' : 'btn-icon-secondary'}`}
                        >
                            <House />
                        </a>
                        <a
                            href="/apps"
                            className={`${activeSection === 'apps' ? 'btn-icon' : 'btn-icon-secondary'}`}
                            aria-label="Apps"
                        >
                            <LayoutGrid />
                        </a>
                        <a
                            href="/monitoring"
                            className={`${activeSection === 'monitoring' ? 'btn-icon' : 'btn-icon-secondary'}`}
                            aria-label="Monitoring"
                        >
                            <ChartColumn />
                        </a>
                        <a
                            href="/settings"
                            className={`${activeSection === 'settings' ? 'btn-icon' : 'btn-icon-secondary'}`}
                            aria-label="Settings"
                        >
                            <Settings />
                        </a>
                    </nav>
                </aside>
                <main className="grow p-4 bg-background overflow-y-scroll max-h-[calc(100vh-4rem)]">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
