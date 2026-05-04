#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const exts = new Set(['.js', '.jsx', '.ts', '.tsx', '.css', '.html']);
const excludeDirs = new Set(['node_modules', '.git', 'uploads', 'dist', 'build', '.vite', '.cache', '.github']);

function stripComments(content) {
  content = content.replace(
  content = content.replace(/\/\*[\s\S]*?\*\
  content = content.replace(/(^|[^:])\/\/.*$/gm, '$1');
  return content;
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const name = e.name;
    const full = path.join(dir, name);
    if (e.isDirectory()) {
      if (excludeDirs.has(name)) continue;
      if (name === 'node_modules' || name === '.git') continue;
      walk(full);
    } else {
      const ext = path.extname(name).toLowerCase();
      if (!exts.has(ext)) continue;
      try {
        const orig = fs.readFileSync(full, 'utf8');
        const stripped = stripComments(orig);
        if (stripped !== orig) {
          fs.writeFileSync(full, stripped, 'utf8');
          console.log('Stripped comments:', full);
        }
      } catch (err) {
        console.error('Error processing', full, err.message);
      }
    }
  }
}

walk(root);
console.log('Comment stripping complete.');
