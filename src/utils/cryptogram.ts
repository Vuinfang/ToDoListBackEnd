import * as crypto from 'crypto';

/**
 * Make salt
 */
export function makeSalt(): string {
  return crypto.randomBytes(3).toString('base64');
}

/**
 * Encrypt password
 * @param password
 * @param salt password salt
 */
export function encryptPassword(password: string, salt: string): string {
  if (!password || !salt) {
    return '';
  }
  const tempSalt = Buffer.from(salt, 'base64');
  return (
    // 100 means iterating times 16means length
    crypto.pbkdf2Sync(password, tempSalt, 100, 16, 'sha1').toString('base64')
  );
}
