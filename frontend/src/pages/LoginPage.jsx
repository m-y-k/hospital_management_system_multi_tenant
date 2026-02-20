import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await authApi.login({ username, password });
            const userData = res.data.data;
            login(userData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold gradient-text">🏥 HMS</h1>
                    <p className="text-gray-400 mt-2">Hospital Management System</p>
                </div>

                {/* Login Card */}
                <div className="glass rounded-2xl p-8">
                    <h2 className="text-xl font-semibold text-gray-100 mb-6">Sign in to your account</h2>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Demo credentials */}
                    <div className="mt-6 p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                        <p className="text-xs text-gray-500 font-medium mb-2">Demo Credentials:</p>
                        <div className="space-y-1 text-xs text-gray-400">
                            <p><span className="text-primary-400">Admin:</span> admin / admin123</p>
                            <p><span className="text-accent-400">Doctor:</span> doctor / doctor123</p>
                            <p><span className="text-amber-400">Staff:</span> staff / staff123</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
