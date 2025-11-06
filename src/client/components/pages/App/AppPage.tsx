import { useQuery } from '@tanstack/react-query';
import Layout from '../../layout/Layout';
import Page from '../Page';
import { useParams } from 'react-router';
import { parseErrorResponse } from '../../../helpers/errorResponseParser';
import { LoadingDisplay } from '../../common/LoadingDisplay';
import { ErrorDisplay } from '../../common/ErrorDisplay';
import { PM2AppHistory, PM2AppInfo } from '../../../../types/pm2';
import {
    ActivityIcon,
    Box,
    ChevronRight,
    ClockArrowUp,
    Cpu,
    LayoutGrid,
    MemoryStick,
} from 'lucide-react';
import { formatUptime } from '../../../helpers/uptime';
import { formatMemory } from '../../../helpers/memory';
import { getStatusColorClass, getStatusText } from '../../../helpers/appstatus';

const AppStat = ({
    label,
    value,
    icon,
}: {
    label: string | React.ReactNode;
    value: string | React.ReactNode;
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

const AppPage = () => {
    const { appName } = useParams<{ appName: string }>();

    const {
        data: app,
        isLoading: appLoading,
        error: appError,
    } = useQuery<{ appInfo: PM2AppInfo; history: PM2AppHistory }>({
        queryKey: ['app', appName],
        queryFn: async () => {
            const response = await fetch(`/api/apps/${appName}`, { credentials: 'include' });
            if (!response.ok) {
                const msg = await parseErrorResponse(response);
                console.error('Failed to fetch app:', msg);
                throw new Error(msg);
            }
            console.log('Fetched app response:', response);
            return response.json();
        },
        enabled: !!appName,
        retry(failureCount, error) {
            console.warn(
                `Retrying fetch for app ${appName}, attempt #${failureCount}. Error:`,
                error
            );
            return failureCount < 2;
        },
    });

    return (
        <Page title={app ? `${app.appInfo.name} - PM2 Dashboard` : 'Process'}>
            <Layout>
                {appLoading && !app && <LoadingDisplay message="Loading process details..." />}
                {appError && <ErrorDisplay error={appError} />}
                {app && (
                    <div className="max-h-full h-full">
                        <div className="flex justify-between">
                            <h1 className="mb-4 text-xl font-semibold flex items-center gap-2">
                                <a
                                    href="/apps"
                                    className="text-muted-foreground flex items-center gap-2"
                                >
                                    <LayoutGrid className="h-5 w-5" />
                                    Processes
                                </a>
                                <ChevronRight />
                                <div className="flex items-center gap-2">
                                    <Box className="h-5 w-5" />
                                    {app.appInfo.name}
                                </div>
                            </h1>

                            <button></button>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="grid gap-4 min-w-1/3">
                                <div className="card p-4 py-3 gap-4">
                                    <h2 className="text-lg font-semibold">Statistics</h2>
                                    <div className="border -mt-2" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <AppStat
                                            label="Status:"
                                            value={
                                                <div className="flex items-center">
                                                    <span className="text-sm font-medium">
                                                        {getStatusText(app.appInfo.status)}
                                                    </span>
                                                    <span
                                                        className={`ml-2 inline-block h-3 w-3 rounded-full ${getStatusColorClass(
                                                            app.appInfo.status
                                                        )}`}
                                                    ></span>
                                                </div>
                                            }
                                            icon={<ActivityIcon className="h-6 w-6" />}
                                        />
                                        <AppStat
                                            label="CPU:"
                                            value={`${app.appInfo.cpu}%`}
                                            icon={<Cpu className="h-6 w-6" />}
                                        />
                                        <AppStat
                                            label="Memory:"
                                            value={formatMemory(app.appInfo.memory)}
                                            icon={<MemoryStick className="h-6 w-6" />}
                                        />
                                        <AppStat
                                            label="Uptime:"
                                            value={formatUptime(app.appInfo.uptime)}
                                            icon={<ClockArrowUp className="h-6 w-6" />}
                                        />
                                    </div>
                                </div>
                                {/* <div className="card p-4 py-3 gap-4">
                                    <h2 className="text-lg font-semibold">Statistics</h2>
                                    <div className="border -mt-2" />
                                </div> */}
                            </div>
                            <div className="card p-4 py-3 w-full gap-4">
                                <h2 className="text-lg font-semibold">Logs</h2>
                                <div className="border -mt-2" />
                            </div>
                        </div>
                    </div>
                )}
            </Layout>
        </Page>
    );
};

export default AppPage;
