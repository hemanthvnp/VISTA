/**
 * Code execution client — routes through the VISTA backend (self-hosted Piston proxy).
 * The public Piston API (emkc.org) became whitelist-only in Feb 2026; we now
 * proxy through Express so the Piston URL stays server-side.
 */

function getAuthHeader() {
  const token = localStorage.getItem('vanta_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Execute code via the backend Piston proxy.
 *
 * @param {Object} params
 * @param {string} params.language   Piston language name (e.g. 'python', 'c++', 'dart')
 * @param {string} params.filename   Source filename — matters for Java (must match public class)
 * @param {string} params.code       Source code
 * @param {string} [params.stdin]    Optional stdin
 * @param {string} [params.version]  Runtime version, defaults to '*' (latest installed)
 * @returns {Promise<{ stdout: string, stderr: string, compileError: string, exitCode: number }>}
 */
export async function runViaPiston({ language, filename, code, stdin = '', version = '*' }) {
  const res = await fetch('/api/code/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ language, filename, code, stdin, version }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Code execution failed (${res.status})`);
  }

  return {
    stdout:       data.stdout       || '',
    stderr:       data.stderr       || '',
    compileError: data.compileError || '',
    exitCode:     data.exitCode     || 0,
  };
}
