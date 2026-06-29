/** @fileoverview Registration page with name, email, password, confirm password */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { register as registerAPI } from '../api/auth';
import { Zap, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const loginStore = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const data = await registerAPI(name, email, password);
      loginStore(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Zap className="w-12 h-12 text-brutal-mint mx-auto mb-3" />
          <h1 className="font-heading text-brutal-mint font-bold text-2xl tracking-wider">V</h1>
          <p className="text-text-muted text-sm mt-1">Begin your evolution.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-bg-card border-2 border-brutal-black rounded-lg shadow-brutal-lg p-6">
          <h2 className="text-lg font-heading text-text-primary mb-4">Create Account</h2>

          {error && (
            <div className="mb-4 p-3 bg-brutal-coral/20 border-2 border-brutal-black rounded-lg text-error-text text-sm">
              {error}
            </div>
          )}

          <div className="mb-3">
            <label className="block text-sm text-text-secondary mb-1">Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-bg-card border-2 border-brutal-black rounded-lg pl-10 pr-4 py-2.5 text-text-primary text-sm focus:border-brutal-purple focus:outline-none transition-colors"
                placeholder="Your name"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm text-text-secondary mb-1">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bg-card border-2 border-brutal-black rounded-lg pl-10 pr-4 py-2.5 text-text-primary text-sm focus:border-brutal-purple focus:outline-none transition-colors"
                placeholder="pilot@v.dev"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm text-text-secondary mb-1">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg-card border-2 border-brutal-black rounded-lg pl-10 pr-10 py-2.5 text-text-primary text-sm focus:border-brutal-purple focus:outline-none transition-colors"
                placeholder="Min 6 characters"
                required
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-text-secondary mb-1">Confirm Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type={showPass ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full bg-bg-card border-2 border-brutal-black rounded-lg pl-10 pr-4 py-2.5 text-text-primary text-sm focus:border-brutal-purple focus:outline-none transition-colors"
                placeholder="Repeat password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-brutal-purple text-white font-bold rounded-lg border-2 border-brutal-black shadow-brutal-sm hover:bg-brutal-purple/90 transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? 'Creating...' : 'Register'}
          </button>

          <p className="text-center text-sm text-text-muted mt-4">
            Already registered?{' '}
            <Link to="/login" className="text-brutal-purple underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
