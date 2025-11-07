import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import 'chart.js/auto';
import { BrowserRouter, Route, Routes } from 'react-router';
import AppsPage from './components/pages/Apps/AppsPage';
import NotFoundPage from './components/pages/NotFoundPage';
import AppPage from './components/pages/App/AppPage';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AppsPage />} />
                <Route path="/process/:appName" element={<AppPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    </QueryClientProvider>
);
