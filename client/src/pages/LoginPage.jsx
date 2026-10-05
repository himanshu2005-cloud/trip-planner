import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginWithGoogle, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/trips';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify your credentials.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Google Login failed.');
    }
  };

  return (
    <div className="py-12 flex items-center justify-center animate-fade-in">
      <Card className="w-full max-w-md p-8 border-purple-500/20 shadow-glass">
        <div className="text-center mb-6">
          <div className="w-10 h-10 mx-auto rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-3">
            <Sparkles size={20} />
          </div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">
            Welcome back
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Sign in to access your saved itineraries and personalized routes
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-danger/10 border border-danger/30 text-xs text-danger text-center">
            {error}
          </div>
        )}

        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Sign In was unsuccessful.')}
            useOneTap
            theme="outline"
            size="large"
            width="100%"
          />
        </div>

        <div className="relative mb-6 flex items-center">
          <div className="flex-grow border-t border-glass-border"></div>
          <span className="flex-shrink-0 mx-4 text-text-muted text-xs uppercase">or continue with email</span>
          <div className="flex-grow border-t border-glass-border"></div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="you@domain.com"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            size="lg"
            variant="primary"
            disabled={isLoading}
            className="mt-2 w-full"
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight size={16} />
          </Button>
        </form>

        <p className="text-center text-xs text-text-muted mt-6">
          Don't have an account?{' '}
          <Link
            to="/register"
            state={{ from }}
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            Create account
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
