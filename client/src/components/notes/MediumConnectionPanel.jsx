import { useState } from 'react';
import { ExternalLink, Link2, Unlink } from 'lucide-react';
import BrutalCard from '../ui/BrutalCard';

export default function MediumConnectionPanel({ status, onConnect, onDisconnect, connecting }) {
  const [token, setToken] = useState('');
  const [error, setError] = useState(null);

  const handleConnect = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await onConnect(token);
      setToken('');
    } catch (err) {
      setError(err.payload?.message || err.message);
    }
  };

  if (status?.connected) {
    return (
      <BrutalCard color="mint" className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-text-primary">
          <Link2 size={14} className="text-brutal-mint" />
          Connected to Medium as <span className="font-semibold">@{status.username}</span>
        </div>
        <button
          onClick={onDisconnect}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs border-2 border-brutal-black rounded-lg text-text-secondary hover:border-brutal-coral hover:text-brutal-coral transition-colors"
        >
          <Unlink size={12} /> Disconnect
        </button>
      </BrutalCard>
    );
  }

  return (
    <BrutalCard>
      <h4 className="text-sm font-semibold text-text-primary mb-1">Connect Medium</h4>
      <p className="text-xs text-text-muted mb-3">
        Medium no longer supports new app sign-ins, so paste your personal Integration Token instead.{' '}
        <a
          href="https://medium.com/me/settings"
          target="_blank"
          rel="noreferrer"
          className="text-brutal-purple hover:underline inline-flex items-center gap-0.5"
        >
          Get yours here <ExternalLink size={10} />
        </a>
      </p>
      <form onSubmit={handleConnect} className="flex gap-2">
        <input
          required
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Medium Integration Token"
          className="flex-1 bg-bg-card border-2 border-brutal-black rounded-lg px-3 py-2 text-text-primary text-sm focus:border-brutal-purple focus:outline-none"
        />
        <button
          type="submit"
          disabled={connecting}
          className="px-4 py-2 bg-brutal-purple text-white border-2 border-brutal-black rounded-lg text-sm font-semibold hover:bg-brutal-purple/90 transition-colors disabled:opacity-50"
        >
          {connecting ? 'Connecting...' : 'Connect'}
        </button>
      </form>
      {error && <p className="text-xs text-brutal-coral mt-2">{error}</p>}
    </BrutalCard>
  );
}
