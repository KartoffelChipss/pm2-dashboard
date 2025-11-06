import { useMutation, useQuery } from '@tanstack/react-query';
import Layout from '../../layout/Layout';
import Page from '../Page';
import { useNavigate, useParams } from 'react-router';
import { parseErrorResponse } from '../../../helpers/errorResponseParser';
import { LoadingDisplay } from '../../common/LoadingDisplay';
import { ErrorDisplay } from '../../common/ErrorDisplay';
import { PM2AppHistory, PM2AppInfo } from '../../../../types/pm2';
import {
    ActivityIcon,
    Box,
    Check,
    ChevronRight,
    ClockArrowUp,
    Cpu,
    LayoutGrid,
    MemoryStick,
    Power,
    RotateCcw,
    Trash,
    TriangleAlert,
} from 'lucide-react';
import { formatUptime } from '../../../helpers/uptime';
import { formatMemory } from '../../../helpers/memory';
import { getStatusColorClass, getStatusText } from '../../../helpers/appstatus';
import RamChart from './RamChart';
import CpuChart from './CpuChart';
import useAppStream from '../../../helpers/useAppStream';
import { useState } from 'react';
import Modal from '../../common/Modal';

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
    const navigate = useNavigate();
    const { appName } = useParams<{ appName: string }>();
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'error' | 'success' | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useAppStream(appName);

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

    console.log('Hiostory', app?.history);

    const restartMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`/api/apps/${appName}/restart`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!response.ok) {
                const msg = await parseErrorResponse(response);
                console.error('Failed to restart app:', msg);
                throw new Error(msg);
            }
        },
        onSuccess: () => {
            console.log(`Successfully restarted app ${appName}`);
            setMessage('Process restarted successfully.');
            setMessageType('success');

            setTimeout(() => {
                setMessage(null);
                setMessageType(null);
            }, 3000);
        },
        onError: (error) => {
            console.error(`Failed to restart app ${appName}:`, error);
            setMessage(`Failed to restart process: ${String(error)}`);
            setMessageType('error');

            setTimeout(() => {
                setMessage(null);
                setMessageType(null);
            }, 3000);
        },
    });

    const stopMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`/api/apps/${appName}/stop`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!response.ok) {
                const msg = await parseErrorResponse(response);
                console.error('Failed to stop app:', msg);
                throw new Error(msg);
            }
        },
        onSuccess: () => {
            console.log(`Successfully stopped app ${appName}`);
            setMessage('Process stopped successfully.');
            setMessageType('success');

            setTimeout(() => {
                setMessage(null);
                setMessageType(null);
            }, 3000);
        },
        onError: (error) => {
            console.error(`Failed to stop app ${appName}:`, error);
            setMessage(`Failed to stop process: ${String(error)}`);
            setMessageType('error');

            setTimeout(() => {
                setMessage(null);
                setMessageType(null);
            }, 3000);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`/api/apps/${appName}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) {
                const msg = await parseErrorResponse(response);
                console.error('Failed to delete app:', msg);
                throw new Error(msg);
            }
        },
        onSuccess: () => {
            console.log(`Successfully deleted app ${appName}`);
            navigate('/apps');
        },
        onError: (error) => {
            console.error(`Failed to delete app ${appName}:`, error);
            setMessage(`Failed to delete process: ${String(error)}`);
            setMessageType('error');

            setTimeout(() => {
                setMessage(null);
                setMessageType(null);
            }, 3000);
        },
    });

    return (
        <Page title={app ? `${app.appInfo.name} - PM2 Dashboard` : 'Process'}>
            <Layout>
                {appLoading && !app && <LoadingDisplay message="Loading process details..." />}
                {appError && <ErrorDisplay error={appError} />}
                {app && (
                    <div className="max-h-full h-full relative">
                        {message && (
                            <div
                                className={`absolute card flex-row items-center gap-3 bottom-5 right-5 shadow-2xl px-4 py-3 z-10`}
                            >
                                {messageType === 'error' ? (
                                    <TriangleAlert className="text-destructive" />
                                ) : messageType === 'success' ? (
                                    <Check className="text-emerald-500" />
                                ) : null}
                                {message}
                            </div>
                        )}
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
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-semibold">Overview</h2>
                                        <div role="group" className="flex button-group">
                                            <button
                                                type="button"
                                                className="btn-outline"
                                                onClick={() => restartMutation.mutate()}
                                                disabled={
                                                    restartMutation.isPending ||
                                                    stopMutation.isPending
                                                }
                                            >
                                                <RotateCcw className="h-4 w-4 text-teal-300" />
                                                Restart
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-outline"
                                                disabled={
                                                    app.appInfo.status !== 'online' ||
                                                    stopMutation.isPending ||
                                                    restartMutation.isPending
                                                }
                                                onClick={() => stopMutation.mutate()}
                                            >
                                                <Power className="h-4 w-4 text-orange-300" />
                                                Stop
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-icon-outline"
                                                onClick={() => setDeleteModalOpen(true)}
                                                disabled={deleteMutation.isPending}
                                            >
                                                <Trash className="h-4 w-4 text-destructive" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="border -mt-2" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <AppStat
                                            label="Status:"
                                            value={
                                                <div className="flex items-center">
                                                    <span className="text-lg font-mono font-semibold">
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
                                            value={`${app.appInfo.cpu?.toFixed(2)}%`}
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
                                <div className="card p-4 py-3 gap-4">
                                    <h2 className="text-lg font-semibold">Ressource Usage</h2>
                                    <div className="border -mt-2" />
                                    <CpuChart history={app.history} />
                                    <RamChart history={app.history} />
                                </div>
                            </div>
                            <div className="card p-4 py-3 w-full gap-4">
                                <h2 className="text-lg font-semibold">Logs</h2>
                                <div className="border -mt-2" />
                            </div>
                        </div>
                        <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Confirm Deletion</h3>
                                <p>
                                    Are you sure you want to delete the process{' '}
                                    <strong>{app.appInfo.name}</strong>? This action cannot be
                                    undone.
                                </p>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        className="btn-secondary"
                                        onClick={() => setDeleteModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn-destructive"
                                        onClick={() => {
                                            deleteMutation.mutate();
                                            setDeleteModalOpen(false);
                                        }}
                                        disabled={deleteMutation.isPending}
                                    >
                                        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </Modal>
                    </div>
                )}
            </Layout>
        </Page>
    );
};

export default AppPage;
