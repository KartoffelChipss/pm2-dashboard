import Layout from '../layout/Layout';
import Page from './Page';

const NotFoundPage = () => {
    return (
        <Page title="404 - Not Found">
            <Layout activeSection={undefined}>
                <div className="flex flex-col items-center justify-center h-full -mt-16">
                    <h2 className="text-4xl font-bold mb-4 text-center">404 - Page Not Found</h2>
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
