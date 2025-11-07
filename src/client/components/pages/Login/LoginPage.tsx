import { useState } from 'react';
import Layout from '../../layout/Layout';
import Page from '../Page';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { FormErrorBox } from '../../common/FormErrorBox';

interface LoginPayload {
    username: string;
    password: string;
}

const login = async (payload: LoginPayload): Promise<{ message: string }> => {
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || 'Login failed');
    }

    return data;
};

const LoginPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: () => {
            navigate('/');
        },
        onError: (err: unknown) => {
            console.error('Login error:', err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Something went wrong');
            }
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const payload: LoginPayload = {
            username: formData.get('username') as string,
            password: formData.get('password') as string,
        };
        setError(null);
        loginMutation.mutate(payload);
    };

    return (
        <Page title="Login">
            <Layout>
                <div className="w-screen h-screen absolute top-0 left-0 flex items-center justify-center -mt-16 p-6">
                    <form
                        className="card items-center p-8 py-10 max-w-sm mx-auto flex flex-col gap-6"
                        onSubmit={handleSubmit}
                    >
                        <img src="/logo.svg" alt="PM2 Dashboard Logo" className="h-14 -mb-4" />
                        <h2 className="text-4xl font-bold">Login</h2>
                        {error && (
                            <FormErrorBox error={error || 'Login failed'} className="w-full" />
                        )}
                        <div className="grid gap-1 w-full">
                            {/* <label htmlFor="username">Username:</label> */}
                            <input
                                type="text"
                                className="input"
                                id="username"
                                name="username"
                                placeholder="Username"
                                required
                            />
                        </div>
                        <div className="grid gap-1 w-full">
                            {/* <label htmlFor="password">Password:</label> */}
                            <input
                                type="password"
                                className="input"
                                id="password"
                                name="password"
                                placeholder="Password"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn w-full font-semibold"
                            disabled={loginMutation.isPending}
                        >
                            Login
                        </button>
                        <a
                            href="https://github.com/KartoffelChipss/pm2-dashboard?tab=readme-ov-file#installation"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-center text-muted-foreground"
                        >
                            The username and password is set using ENV variables on the server.
                        </a>
                    </form>
                </div>
            </Layout>
        </Page>
    );
};

export default LoginPage;
