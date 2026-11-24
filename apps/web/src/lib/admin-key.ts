import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

/**
 * The superadmin key is never stored in plaintext — only this salted scrypt
 * hash lives in the database (`settings` row `superadmin_key_hash`).
 */
export function hashAdminKey(key: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(key, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyAdminKey(key: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;

  const candidate = scryptSync(key, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  if (candidate.length !== expected.length) return false;

  return timingSafeEqual(candidate, expected);
}
