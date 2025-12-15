import { useQuery } from '@tanstack/react-query';
import { PM2AppInfo } from '../../../../types/pm2.js';
import Layout from '../../layout/Layout.js';
import Page from '../Page.js';
import { LayoutGrid, Table } from 'lucide-react';
import { LoadingDisplay } from '../../common/LoadingDisplay.js';
import { ErrorDisplay } from '../../common/ErrorDisplay.js';
import { parseErrorResponse } from '../../../helpers/errorResponseParser.js';
import GridAppsLayout from './GridAppsLayout.js';
import { useEffect, useState } from 'react';
import TableAppsLayout from './TableAppsLayout.js';

type ViewType = 'table' | 'grid';

const AppsPage = () => {
    const [view, setView] = useState<ViewType>(() => {
        const saved = localStorage.getItem('appView') as ViewType | null;
        return saved ?? 'grid';
    });

    useEffect(() => {
        localStorage.setItem('appView', view);
    }, [view]);

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
        retry(failureCount, error) {
            console.warn(`Retrying fetch for apps, attempt #${failureCount}. Error:`, error);
            return failureCount < 2;
        },
    });

    return (
        <Page title="Apps - PM2 Dashboard">
            <Layout>
                {appsLoading && <LoadingDisplay message="Loading processes..." />}
                {appsError && <ErrorDisplay error="Failed to load apps. Please try again later." />}
                {apps && (
                    <>
                        <header className="mb-4 flex justify-between items-center gap-2">
                            <h1 className="text-xl font-semibold flex items-center gap-2">
                                <LayoutGrid className="h-5 w-5" />
                                Processes
                            </h1>

                            <div role="group" className="button-group">
                                <button
                                    type="button"
                                    className="btn-outline"
                                    onClick={() => setView('grid')}
                                    aria-label="Grid View"
                                >
                                    <LayoutGrid />
                                    <span className="hidden sm:inline">Grid View</span>
                                </button>
                                <button
                                    type="button"
                                    className="btn-outline"
                                    onClick={() => setView('table')}
                                    aria-label="Table View"
                                >
                                    <Table />
                                    <span className="hidden sm:inline">Table View</span>
                                </button>
                            </div>
                        </header>
                        {view === 'grid' ? (
                            <GridAppsLayout apps={apps} />
                        ) : (
                            <TableAppsLayout apps={apps} />
                        )}
                    </>
                )}
            </Layout>
        </Page>
    );
};

export default AppsPage;
