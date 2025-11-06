import { useQuery } from '@tanstack/react-query';
import { PM2AppInfo } from '../../../../types/pm2.js';
import Layout from '../../layout/Layout.js';
import Page from '../Page.js';
import { Box, ClockArrowUp, Cpu, MemoryStick } from 'lucide-react';
import { getStatusColorClass, getStatusText } from '../../../helpers/appstatus.js';
import { formatUptime } from '../../../helpers/uptime.js';
import { formatMemory } from '../../../helpers/memory.js';
import { LoadingDisplay } from '../../common/LoadingDisplay.js';
import { ErrorDisplay } from '../../common/ErrorDisplay.js';
import { parseErrorResponse } from '../../../helpers/errorResponseParser.js';

const AppStat = ({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
}) => {
    return (
        <div className="flex items-center gap-3">
            {icon}
            <div className="grid">
                <span className="text-xs text-muted-foreground -mb-1 mt-1">{label}</span>
                <span className="text-lg font-mono font-semibold">{value}</span>
            </div>
        </div>
    );
};

const AppsPage = () => {
    const {
        data: apps,
        isLoading: appsLoading,
        error: appsError,
    } = useQuery<PM2AppInfo[]>({
        queryKey: ['apps'],
        queryFn: async () => {
            const response = await fetch('/api/apps', { credentials: 'include' });
            if (!response.ok) {
                const msg = await parseErrorResponse(response);
                console.error('Failed to fetch apps:', msg);
                throw new Error(msg);
            }
            return response.json();
        },
    });

    return (
        <Page title="Apps - PM2 Dashboard">
            <Layout activeSection="apps">
                <h1 className="mb-4 text-2xl font-semibold">Processes</h1>
                {appsLoading && <LoadingDisplay />}
                {appsError && <ErrorDisplay error="Failed to load apps. Please try again later." />}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {apps?.map((app) => (
                        <div key={app.pm_id} className="card p-4 gap-2">
                            <a
                                href={`/app/${app.pm_id}`}
                                className="text-xl font-bold flex items-center gap-2 group"
                            >
                                <Box />
                                <span className="group-hover:underline underline-offset-4">
                                    {app.name}
                                </span>
                                <span className={`badge ${getStatusColorClass(app.status)}`}>
                                    {getStatusText(app.status)}
                                </span>
                            </a>
                            <div className="border my-2" />
                            <div className="grid grid-cols-2 gap-4">
                                <AppStat
                                    label="CPU:"
                                    value={`${app.cpu}%`}
                                    icon={<Cpu className="h-6 w-6" />}
                                />
                                <AppStat
                                    label="Memory:"
                                    value={formatMemory(app.memory)}
                                    icon={<MemoryStick className="h-6 w-6" />}
                                />
                                <AppStat
                                    label="Uptime:"
                                    value={formatUptime(app.uptime)}
                                    icon={<ClockArrowUp className="h-6 w-6" />}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </Layout>
        </Page>
    );
};

export default AppsPage;
