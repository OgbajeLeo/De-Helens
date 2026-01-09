'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  
  // Safely get auth context with error handling
  let login, isAuthenticated, authLoading;
  try {
    const auth = useAuth();
    login = auth.login;
    isAuthenticated = auth.isAuthenticated;
    authLoading = auth.loading;
  } catch (err) {
    console.error('Auth context error:', err);
    // If context fails, show form anyway
    login = async () => false;
    isAuthenticated = false;
    authLoading = false;
  }

  useEffect(() => {
    // Show form after a short delay to ensure everything is loaded
    // This ensures form always appears, even if authLoading is stuck
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 500);

    // If already authenticated, redirect
    if (!authLoading && isAuthenticated) {
      router.push('/admin');
    }

    return () => clearTimeout(timer);
  }, [isAuthenticated, authLoading, router]);

  // Safety: Always show form after 1 second max, regardless of loading state
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setShowForm(true);
    }, 1000);
    return () => clearTimeout(safetyTimer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(username, password);
    
    if (success) {
      router.push('/admin');
    } else {
      setError('Invalid username or password');
    }
    
    setLoading(false);
  };

  // Show loading only briefly while checking auth
  if (authLoading && !showForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#90EE90] to-[#FFD700]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#228B22] mx-auto mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, show redirecting message
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#90EE90] to-[#FFD700]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#228B22] mx-auto mb-4"></div>
          <p className="text-gray-700">Redirecting to admin...</p>
        </div>
      </div>
    );
  }

  // Always show the form - don't hide it
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#90EE90] to-[#FFD700]">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-[#228B22]">
          De Helen&apos;s Taste
        </h1>
        <p className="text-center text-gray-600 mb-8">Admin Login</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#228B22] focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#228B22] focus:border-transparent"
              required
            />
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#228B22] text-white py-3 rounded-lg text-lg font-semibold hover:bg-[#1a6b1a] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
