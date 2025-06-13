import React from 'react';
import UserAuth from '../../component/UserAuth';

const AuthPage: React.FC = () => {

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <UserAuth />
    </main>
  )
};

export default AuthPage;