import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
    <div className="font-mono text-xs tracking-widest text-accent uppercase mb-3">404</div>
    <h1 className="font-display text-2xl font-semibold mb-2">Page not found</h1>
    <p className="text-sm text-muted mb-6">The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn-primary">Go home</Link>
  </div>
);

export default NotFound;
