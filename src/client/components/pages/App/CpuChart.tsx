import { Line } from 'react-chartjs-2';
import { PM2AppHistory } from '../../../../types/pm2';
import { formatUptime } from '../../../helpers/uptime';
import { Cpu } from 'lucide-react';

const CpuChart = ({ history }: { history: PM2AppHistory }) => {
    return (
        <div>
            <Line
                className="max-h-30"
                data={{
                    labels: [...history.map((point) => formatUptime(point.ts, 2) + ' ago')],
                    datasets: [
                        {
                            label: 'CPU usage',
                            fill: true,
                            backgroundColor: (context: any) => {
                                const chart = context.chart;
                                const { ctx, chartArea } = chart;
                                if (!chartArea) {
                                    return 'rgba(59,130,246,0.15)';
                                }
                                const gradient = ctx.createLinearGradient(
                                    0,
                                    chartArea.top,
                                    0,
                                    chartArea.bottom
                                );
                                gradient.addColorStop(0, 'rgba(59,130,246,0.45)');
                                gradient.addColorStop(0.6, 'rgba(59,130,246,0.12)');
                                gradient.addColorStop(1, 'rgba(59,130,246,0)');
                                return gradient;
                            },
                            borderColor: '#3b82f6',
                            data: history.map((point) => point.cpu ?? 0),
                            tension: 0.3,
                            borderWidth: 3,
                            pointRadius: 0,
                            pointHoverRadius: 4,
                        },
                    ],
                }}
                options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false,
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function (tooltipItem: any) {
                                    const v = tooltipItem.raw;
                                    if (v === null || v === undefined) return 'N/A';
                                    return `${(v as number).toFixed(2)}%`;
                                },
                            },
                        },
                    },
                    interaction: {
                        intersect: false,
                    },
                    hover: {
                        mode: 'index',
                        intersect: false,
                    },
                    scales: {
                        x: {
                            display: false,
                            title: {
                                display: false,
                                text: 'Day',
                            },
                            grid: {
                                color: 'rgba(255,255,255,.1)',
                            },
                        },
                        y: {
                            display: true,
                            title: {
                                display: false,
                            },
                            grid: {
                                color: 'rgba(255,255,255,.1)',
                            },
                            ticks: {
                                color: 'rgba(255,255,255,.1)',
                                callback: function (tickValue: string | number) {
                                    if (typeof tickValue === 'string') {
                                        tickValue = parseFloat(tickValue);
                                    }
                                    return `${(tickValue as number).toFixed(0)}%`;
                                },
                            },
                            border: {
                                display: false,
                            },
                            suggestedMin: 0,
                        },
                    },
                }}
            />
            <div className="flex items-center justify-center text-sm text-muted-foreground gap-2">
                <Cpu className="h-4 w-4" />
                CPU usage over time
            </div>
        </div>
    );
};

export default CpuChart;
