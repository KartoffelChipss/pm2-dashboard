import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import HomePage from './components/pages/Home/HomePage';
import AppsPage from './components/pages/Apps/AppsPage';
import NotFoundPage from './components/pages/NotFoundPage';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="apps" element={<AppsPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    </QueryClientProvider>
);
