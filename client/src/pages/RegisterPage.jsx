import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password);
      navigate('/plan');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="py-12 flex items-center justify-center animate-fade-in">
      <Card className="w-full max-w-md p-8 border-purple-500/20">
        <div className="text-center mb-6">
          <div className="w-10 h-10 mx-auto rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-3">
            <Sparkles size={20} />
          </div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">
            Create an Account
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Start planning intelligent, day-by-day travel itineraries
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-danger/10 border border-danger/30 text-xs text-danger text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="name"
            label="Full Name"
            type="text"
            placeholder="Alex Mercer"
            icon={User}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            placeholder="At least 6 characters"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          <Button
            type="submit"
            size="lg"
            variant="primary"
            disabled={isLoading}
            className="mt-2 w-full"
          >
            <span>{isLoading ? 'Creating Account...' : 'Get Started'}</span>
            <ArrowRight size={16} />
          </Button>
        </form>

        <p className="text-center text-xs text-text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;
