import { Line } from 'react-chartjs-2';
import { PM2AppHistory } from '../../../../types/pm2';
import { convertMemoryToOptimalUnit } from '../../../helpers/memory';
import { formatUptime } from '../../../helpers/uptime';
import { MemoryStick } from 'lucide-react';

const RamChart = ({ history }: { history: PM2AppHistory }) => {
    return (
        <div>
            <Line
                className="max-h-30"
                data={{
                    labels: [...history.map((point) => formatUptime(point.ts, 2) + ' ago')],
                    datasets: [
                        {
                            label: 'Total memory usage',
                            fill: true,
                            backgroundColor: (context: any) => {
                                const chart = context.chart;
                                const { ctx, chartArea } = chart;
                                if (!chartArea) {
                                    return 'rgba(255,65,54,0.15)';
                                }
                                const gradient = ctx.createLinearGradient(
                                    0,
                                    chartArea.top,
                                    0,
                                    chartArea.bottom
                                );
                                gradient.addColorStop(0, 'rgba(255,65,54,0.45)');
                                gradient.addColorStop(0.6, 'rgba(255,65,54,0.12)');
                                gradient.addColorStop(1, 'rgba(255,65,54,0)');
                                return gradient;
                            },
                            borderColor: '#FF4136',
                            data: history.map((point) => point.memory),
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
                                    return convertMemoryToOptimalUnit(tooltipItem.raw, 2);
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
                                    return convertMemoryToOptimalUnit(tickValue, 0);
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
                <MemoryStick className="h-4 w-4" />
                Memory usage over time
            </div>
        </div>
    );
};

export default RamChart;
