/**
 * Thin client for the public Piston code-execution API.
 * Docs: https://github.com/engineer-man/piston
 *
 * We use the public instance at emkc.org. Rate limit: 200 req/hr per IP.
 * To self-host, override PISTON_URL below or via VITE_PISTON_URL env.
 */

const PISTON_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PISTON_URL) ||
  'https://emkc.org/api/v2/piston';

/**
 * Execute code via Piston.
 *
 * @param {Object} params
 * @param {string} params.language   Piston language name (e.g. 'python', 'c++', 'csharp.net')
 * @param {string} params.filename   Source filename (matters for Java's public class name)
 * @param {string} params.code       Source code
 * @param {string} [params.stdin]    Optional stdin fed to the program
 * @param {string} [params.version]  Runtime version, defaults to '*' (latest available)
 * @returns {Promise<{ stdout: string, stderr: string, compileError: string, exitCode: number }>}
 */
export async function runViaPiston({ language, filename, code, stdin = '', version = '*' }) {
  const res = await fetch(`${PISTON_URL}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language,
      version,
      files: [{ name: filename, content: code }],
      stdin,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Piston HTTP ${res.status}${body ? ': ' + body : ''}`);
  }

  const data = await res.json();
  return {
    stdout: data?.run?.stdout ?? '',
    stderr: data?.run?.stderr ?? '',
    compileError: data?.compile?.stderr ?? '',
    exitCode: data?.run?.code ?? 0,
  };
}
