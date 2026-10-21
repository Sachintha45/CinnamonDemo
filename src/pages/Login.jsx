import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-primary-dark font-bold text-3xl">C</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Ceylon Cinnamon</h1>
          <p className="text-accent mt-1">Export Management System</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-6">Sign in to manage your cinnamon exports</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kamal@ceyloncinnamon.lk"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-primary hover:underline">Forgot password?</a>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-4 p-3 bg-surface rounded-lg">
            <p className="text-xs text-gray-500 text-center">Demo: Use any email/password to log in</p>
          </div>
        </div>
      </div>
    </div>
  );
}
