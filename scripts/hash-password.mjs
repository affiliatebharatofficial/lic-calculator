#!/usr/bin/env node
/**
 * Generates a PBKDF2 password hash for the bootstrap admin account.
 *
 * Usage:
 *   node scripts/hash-password.mjs
 *   (you will be prompted for the password; it is never echoed or stored)
 *
 * Then set the printed value as the ADMIN_PASSWORD_HASH secret on the
 * `lic-calculators` Cloudflare Worker, together with ADMIN_EMAIL and
 * ADMIN_SESSION_SECRET. The hash format matches src/lib/admin/auth.ts:
 *   pbkdf2$<iterations>$<saltB64url>$<hashB64url>
 */
import { pbkdf2Sync, randomBytes } from 'node:crypto';
import { createInterface } from 'node:readline';

const ITERATIONS = 100_000;

function toBase64Url(buf) {
  return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const rl = createInterface({ input: process.stdin, output: process.stdout });
rl.stdoutMuted = true;
process.stdout.write('New admin password: ');
rl.question('', (password) => {
  rl.close();
  process.stdout.write('\n');
  if (!password || password.length < 10) {
    console.error('Password must be at least 10 characters.');
    process.exit(1);
  }
  const salt = randomBytes(16);
  const hash = pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256');
  console.log('\nSet this as the ADMIN_PASSWORD_HASH worker secret:\n');
  console.log(`pbkdf2$${ITERATIONS}$${toBase64Url(salt)}$${toBase64Url(hash)}`);
});
rl._writeToOutput = function (text) {
  if (!rl.stdoutMuted) process.stdout.write(text);
};
