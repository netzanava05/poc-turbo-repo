'use client';

import React from 'react';
import { createAuthStore } from '../lib/store/zustandStore';
import { useRouter } from 'next/navigation';

const UserAuth: React.FC = ({ }) => {
    const { user, setUser } = createAuthStore();
    const router = useRouter();
    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold mb-4">Auth Zustand POC</h1>

            {user ? (
                <div className="space-y-4">
                    <p>Welcome, <strong>{user.name}</strong>!</p>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded"
                        onClick={() => {
                            setUser(null);
                            router.push('/');
                        }}
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <p>You are not logged in.</p>
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded"
                        onClick={() => {
                            setUser({ id: '1', name: 'Test', role: 'admin' });
                            router.push('/landing');
                        }}
                    >
                        Login as Test
                    </button>
                </div>
            )}
        </main>
    )
};

export default UserAuth;