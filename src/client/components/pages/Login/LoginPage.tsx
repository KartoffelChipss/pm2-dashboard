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
                <form
                    className="card items-center p-4 max-w-sm mx-auto flex flex-col gap-4 mt-30"
                    onSubmit={handleSubmit}
                >
                    <img src="/logo.svg" alt="PM2 Dashboard Logo" className="h-14 -mb-2" />
                    <h2 className="text-4xl gap-1 font-bold">Login</h2>
                    {error && <FormErrorBox error={error || 'Login failed'} className="w-full" />}
                    <div className="grid gap-1 w-full">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            className="input"
                            id="username"
                            name="username"
                            required
                        />
                    </div>
                    <div className="grid gap-1 w-full">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            className="input"
                            id="password"
                            name="password"
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
                    <a className="text-sm text-center text-muted-foreground">
                        The username and password is set using ENV variables on the server.
                    </a>
                </form>
            </Layout>
        </Page>
    );
};

export default LoginPage;
