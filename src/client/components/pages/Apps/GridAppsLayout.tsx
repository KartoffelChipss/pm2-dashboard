import { Box, ClockArrowUp, Cpu, MemoryStick } from 'lucide-react';
import { PM2AppInfo } from '../../../../types/pm2';
import { getStatusColorClass, getStatusText } from '../../../helpers/appstatus';
import { formatCpu } from '../../../helpers/cpu';
import { formatUptime } from '../../../helpers/uptime';
import { formatMemory } from '../../../helpers/memory';

interface GridAppsLayoutProps {
    apps: PM2AppInfo[];
}

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

const GridAppsLayout = ({ apps }: GridAppsLayoutProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apps.map((app) => (
                <div key={app.pm_id} className="card p-4 gap-2">
                    <a
                        href={`/process/${app.name}`}
                        className="text-xl font-bold flex items-center gap-2 group"
                    >
                        <Box />
                        <span className="group-hover:underline underline-offset-4">{app.name}</span>
                        <span className={`badge ${getStatusColorClass(app.status)}`}>
                            {getStatusText(app.status)}
                        </span>
                    </a>
                    <div className="border my-2" />
                    <div className="grid sm:grid-cols-2 gap-4">
                        <AppStat
                            label="CPU:"
                            value={formatCpu(app.cpu)}
                            icon={<Cpu className="h-6 w-6" />}
                        />
                        <AppStat
                            label="Memory:"
                            value={formatMemory(app.memory)}
                            icon={<MemoryStick className="h-6 w-6" />}
                        />
                        <AppStat
                            label="Uptime:"
                            value={app.status === 'online' ? formatUptime(app.uptime) : 'N/A'}
                            icon={<ClockArrowUp className="h-6 w-6" />}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GridAppsLayout;
