const { spawn } = require('child_process');
const path = require('path');

/**
 * Run the ML analysis Python script.
 * Passes session data via stdin and reads JSON from stdout.
 */
const runMlAnalysis = (sessionData) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '..', '..', 'ml', 'codec_typing_ml.py');
    const py = spawn('python', [scriptPath]);

    let output = '';
    let errorOutput = '';

    py.stdin.write(JSON.stringify(sessionData));
    py.stdin.end();

    py.stdout.on('data', (data) => {
      output += data.toString();
    });

    py.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    py.on('close', (code) => {
      if (code === 0) {
        try {
          resolve(JSON.parse(output));
        } catch (parseError) {
          reject(new Error('Failed to parse ML output: ' + parseError.message));
        }
      } else {
        reject(new Error(`ML script exited with code ${code}: ${errorOutput}`));
      }
    });

    py.on('error', (err) => {
      reject(new Error('Failed to start ML script: ' + err.message));
    });
  });
};

module.exports = { runMlAnalysis };
