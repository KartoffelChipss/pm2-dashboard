import { useState } from 'react';
import { Box, ClockArrowUp, Cpu, MemoryStick } from 'lucide-react';
import { PM2AppInfo, PM2AppStatus } from '../../../../types/pm2';
import { getStatusColorClass, getStatusText } from '../../../helpers/appstatus';
import { formatCpu } from '../../../helpers/cpu';
import { formatUptime } from '../../../helpers/uptime';
import { formatMemory } from '../../../helpers/memory';

interface TableAppsLayoutProps {
    apps: PM2AppInfo[];
}

const AppStat = ({ value, icon }: { value: string; icon: React.ReactNode }) => (
    <div className="flex items-center gap-2">
        {icon}
        <span className="text-md font-mono">{value}</span>
    </div>
);

type SortKey = 'name' | 'status' | 'cpu' | 'memory' | 'uptime';
type SortOrder = 'asc' | 'desc';

function statusToComparable(status: PM2AppStatus | undefined): number {
    switch (status) {
        case 'online':
            return 3;
        case 'stopped':
            return 2;
        case 'stopping':
            return 1;
        case 'errored':
            return 0;
        default:
            return -1;
    }
}

const TableAppsLayout = ({ apps }: TableAppsLayoutProps) => {
    const [sortKey, setSortKey] = useState<SortKey>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const sortedApps = [...apps].sort((a, b) => {
        let aValue: string | number | undefined = '';
        let bValue: string | number | undefined = '';

        switch (sortKey) {
            case 'name':
                aValue = a.name.toLowerCase();
                bValue = b.name.toLowerCase();
                break;
            case 'status':
                aValue = statusToComparable(a.status);
                bValue = statusToComparable(b.status);
                break;
            case 'cpu':
                aValue = a.cpu;
                bValue = b.cpu;
                break;
            case 'memory':
                aValue = a.memory;
                bValue = b.memory;
                break;
            case 'uptime':
                aValue = a.status === 'online' ? a.uptime : Infinity;
                bValue = b.status === 'online' ? b.uptime : Infinity;
                break;
        }

        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const renderSortIndicator = (key: SortKey) => {
        if (sortKey !== key) return null;
        return sortOrder === 'asc' ? ' ▲' : ' ▼';
    };

    return (
        <div className="overflow-x-auto">
            <table className="table w-full">
                <thead>
                    <tr>
                        <th onClick={() => handleSort('name')} className="cursor-pointer">
                            Process Name{renderSortIndicator('name')}
                        </th>
                        <th onClick={() => handleSort('status')} className="cursor-pointer">
                            Status{renderSortIndicator('status')}
                        </th>
                        <th onClick={() => handleSort('cpu')} className="cursor-pointer">
                            CPU{renderSortIndicator('cpu')}
                        </th>
                        <th onClick={() => handleSort('memory')} className="cursor-pointer">
                            Memory{renderSortIndicator('memory')}
                        </th>
                        <th onClick={() => handleSort('uptime')} className="cursor-pointer">
                            Uptime{renderSortIndicator('uptime')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedApps.map((app) => (
                        <tr key={app.pm_id}>
                            <td>
                                <a
                                    href={`/process/${app.name}`}
                                    className="font-bold flex items-center gap-2 group"
                                >
                                    <Box />
                                    <span className="group-hover:underline underline-offset-4">
                                        {app.name}
                                    </span>
                                </a>
                            </td>
                            <td>
                                <span className={`badge ${getStatusColorClass(app.status)}`}>
                                    {getStatusText(app.status)}
                                </span>
                            </td>
                            <td>
                                <AppStat
                                    value={formatCpu(app.cpu)}
                                    icon={<Cpu className="h-5 w-5" />}
                                />
                            </td>
                            <td>
                                <AppStat
                                    value={formatMemory(app.memory)}
                                    icon={<MemoryStick className="h-5 w-5" />}
                                />
                            </td>
                            <td>
                                <AppStat
                                    value={
                                        app.status === 'online' ? formatUptime(app.uptime) : 'N/A'
                                    }
                                    icon={<ClockArrowUp className="h-5 w-5" />}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableAppsLayout;
