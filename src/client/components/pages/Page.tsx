import React, { ReactNode, useEffect } from 'react';

interface PageProps {
    title?: string;
    children: ReactNode;
}

const Page: React.FC<PageProps> = ({ title, children }) => {
    useEffect(() => {
        if (!title) return;
        document.title = title;
    }, [title]);

    return <>{children}</>;
};

export default Page;
