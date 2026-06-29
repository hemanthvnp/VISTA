/** Code execution output panel */
export default function OutputPanel({ output, error, loading }) {
  return (
    <div className="bg-bg-primary border border-brutal-black rounded-lg p-4 font-mono text-sm min-h-[120px]">
      <div className="text-xs text-text-muted mb-2">OUTPUT</div>
      {loading && (
        <div className="text-brutal-mint animate-pulse">Running...</div>
      )}
      {!loading && !output && !error && (
        <div className="text-text-muted">Run your code to see output here.</div>
      )}
      {output && (
        <pre className="text-brutal-mint whitespace-pre-wrap">{output}</pre>
      )}
      {error && (
        <pre className="text-brutal-pink whitespace-pre-wrap">{error}</pre>
      )}
    </div>
  );
}
