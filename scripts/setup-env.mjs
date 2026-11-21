#!/usr/bin/env node
/**
 * Creates the two env files the apps actually read, from .env.example:
 *
 *   .env                -> apps/api (Node reads it via --env-file-if-exists)
 *   apps/web/.env.local -> apps/web (Next.js only reads env files in its own dir)
 *
 * Existing files are never overwritten.
 */
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, '.env.example');

if (!existsSync(source)) {
  console.error('.env.example is missing - nothing to copy from.');
  process.exit(1);
}

const targets = [join(root, '.env'), join(root, 'apps', 'web', '.env.local')];
let created = 0;

for (const target of targets) {
  if (existsSync(target)) {
    console.log(`kept    ${target.replace(root, '.')} (already exists)`);
    continue;
  }
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(source, target);
  created += 1;
  console.log(`created ${target.replace(root, '.')}`);
}

if (created > 0) {
  console.log('\nThe defaults work for local development. Run: npm run dev');
}
