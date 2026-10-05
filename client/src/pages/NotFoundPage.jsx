import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export const NotFoundPage = () => {
  return (
    <div className="py-20 flex items-center justify-center animate-fade-in">
      <Card className="max-w-md p-8 text-center border-purple-500/20">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center shadow-glow-sm">
          <Compass size={28} />
        </div>
        <h1 className="text-4xl font-extrabold text-text-primary tracking-tight mb-2">
          404
        </h1>
        <h2 className="text-lg font-semibold text-text-secondary mb-2">
          Off the Beaten Path
        </h2>
        <p className="text-xs text-text-muted mb-6">
          The destination or page you're searching for hasn't been charted yet.
        </p>

        <Link to="/">
          <Button size="md" variant="primary" className="mx-auto">
            <Home size={16} />
            <span>Return Home</span>
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default NotFoundPage;
