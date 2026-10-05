import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import Logo from '../components/ui/Logo';
import TravelButton from '../components/editorial/TravelButton';
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
    <div className="w-full py-16 px-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-[#131317] border border-[#23232c] p-8 sm:p-10 shadow-editorial flex flex-col">
        {/* Brand Logo Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <Logo size="lg" className="mb-4" />
          <h2 className="font-serif-headline text-3xl text-[#f5f2eb]">
            Access Your Trips
          </h2>
          <p className="font-serif italic text-xs text-[#9e9a91] mt-1">
            Sign in to retrieve your saved Indian itineraries and custom waypoints.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-950/20 border border-red-800/40 text-xs font-mono text-red-300 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] tracking-[0.2em] text-[#9e9a91] uppercase">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="editorial-input"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] tracking-[0.2em] text-[#9e9a91] uppercase">
              PASSWORD
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="editorial-input"
              required
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-[#432357] hover:bg-[#522a6a] border border-[#7a5293] text-[#f5f2eb] font-mono text-xs font-semibold tracking-[0.16em] uppercase transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'AUTHENTICATING...' : 'SIGN IN →'}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-[1px] bg-[#1c1c23]" />
          <span className="font-mono text-[10px] text-[#5c5851] uppercase">OR</span>
          <div className="flex-1 h-[1px] bg-[#1c1c23]" />
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google sign-in was unsuccessful.')}
            theme="filled_black"
            shape="rectangular"
            size="large"
            text="signin_with"
          />
        </div>

        <div className="mt-8 pt-4 border-t border-[#1c1c23] text-center font-mono text-xs text-[#9e9a91]">
          <span>Need a new dossier? </span>
          <Link to="/register" className="text-[#cebfdf] hover:underline font-semibold ml-1">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
