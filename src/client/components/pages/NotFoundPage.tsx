import Layout from '../layout/Layout';
import Page from './Page';

const NotFoundPage = () => {
    return (
        <Page title="404 - Not Found">
            <Layout>
                <div className="flex flex-col items-center justify-center gap-6 h-full pt-50">
                    <h2 className="text-4xl font-bold text-center">404 - Page Not Found</h2>
                    <p className="text-lg text-center">
                        The page you are looking for does not exist. Please check the URL or return
                        to the home page.
                    </p>
                </div>
            </Layout>
        </Page>
    );
};

export default NotFoundPage;
