/** @fileoverview Pyodide loader hook - loads Python runtime from CDN for code playground */
import { useState, useRef, useCallback } from 'react';

const PYODIDE_VERSION = '0.26.2';
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
const PYODIDE_CDN = `${PYODIDE_BASE}pyodide.js`;

const usePyodide = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);
  const pyodideRef = useRef(null);

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;

    setLoading(true);
    setError(null);

    try {
      if (!window.loadPyodide) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = PYODIDE_CDN;
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load Pyodide'));
          document.head.appendChild(script);
        });
      }

      const pyodide = await window.loadPyodide({ indexURL: PYODIDE_BASE });
      pyodideRef.current = pyodide;
      setReady(true);
      return pyodide;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const runPython = useCallback(async (code) => {
    try {
      const pyodide = await loadPyodide();
      pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
`);
      await pyodide.runPythonAsync(code);
      const stdout = pyodide.runPython('sys.stdout.getvalue()');
      const stderr = pyodide.runPython('sys.stderr.getvalue()');
      return { output: stdout, error: stderr || null };
    } catch (err) {
      return { output: '', error: err.message || (typeof err === 'string' ? err : String(err)) };
    }
  }, [loadPyodide]);

  return { loadPyodide, runPython, loading, error, ready };
};

export default usePyodide;
