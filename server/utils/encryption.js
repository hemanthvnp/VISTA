/**
 * AES-256-GCM encryption for sensitive per-user credentials (e.g. the Medium
 * Integration Token in MediumConnection). Required env var:
 *   ENCRYPTION_KEY  — a 32-byte key, hex or base64 encoded.
 *     Generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 * Rotating this key invalidates all previously encrypted values (they will
 * fail to decrypt), so keep it stable across deploys.
 */
const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

function getKey() {
  const raw = process.env.ENCRYPTION_KEY;
  if (!raw) {
    throw new Error('ENCRYPTION_KEY is not set — cannot encrypt/decrypt credentials.');
  }
  const buf = Buffer.from(raw, raw.length === 64 ? 'hex' : 'base64');
  if (buf.length !== 32) {
    throw new Error('ENCRYPTION_KEY must decode to exactly 32 bytes.');
  }
  return buf;
}

function encrypt(text) {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv.toString('base64'), authTag.toString('base64'), encrypted.toString('base64')].join('.');
}

function decrypt(payload) {
  const key = getKey();
  const [ivB64, authTagB64, dataB64] = payload.split('.');
  if (!ivB64 || !authTagB64 || !dataB64) {
    throw new Error('Malformed encrypted payload.');
  }
  const iv = Buffer.from(ivB64, 'base64');
  const authTag = Buffer.from(authTagB64, 'base64');
  const data = Buffer.from(dataB64, 'base64');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  return decrypted.toString('utf8');
}

module.exports = { encrypt, decrypt };
