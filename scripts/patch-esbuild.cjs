const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

const topEsbuildPath = path.join(root, 'node_modules', 'esbuild');
if (!fs.existsSync(topEsbuildPath)) {
  console.log('No top-level esbuild, skip');
  process.exit(0);
}
const topVer = JSON.parse(fs.readFileSync(path.join(topEsbuildPath, 'package.json'), 'utf8')).version;
console.log('Top-level esbuild:', topVer);

// Search for nested esbuild in vite
const searchPaths = [
  path.join(root, 'node_modules', 'vite', 'node_modules', 'esbuild'),
  path.join(root, 'node_modules', '.pnpm', 'vite@5.4.21', 'node_modules', 'esbuild'),
];

let patched = false;
for (const p of searchPaths) {
  if (fs.existsSync(p)) {
    try {
      const ver = JSON.parse(fs.readFileSync(path.join(p, 'package.json'), 'utf8')).version;
      if (ver !== topVer) {
        console.log('Patching', p, ':', ver, '->', topVer);
        copyDir(topEsbuildPath, p);
        patched = true;
      } else {
        console.log('Already up to date at', p);
      }
    } catch(e) { console.log('Error at', p, ':', e.message); }
  }
}

// Also patch @esbuild platform binaries
const atEsbuildTop = path.join(root, 'node_modules', '@esbuild');
if (fs.existsSync(atEsbuildTop)) {
  const vitePath = path.join(root, 'node_modules', 'vite', 'node_modules', '@esbuild');
  if (fs.existsSync(vitePath)) {
    console.log('Patching @esbuild binaries in vite/node_modules');
    copyDir(atEsbuildTop, vitePath);
    patched = true;
  }
}

if (!patched) {
  // Try to find esbuild used by vite via require.resolve
  try {
    const viteMain = require.resolve('vite');
    const viteDir = path.dirname(path.dirname(viteMain));
    const esbuildInVite = path.join(viteDir, 'node_modules', 'esbuild');
    if (fs.existsSync(esbuildInVite)) {
      const ver = JSON.parse(fs.readFileSync(path.join(esbuildInVite, 'package.json'), 'utf8')).version;
      console.log('Found esbuild in vite via require.resolve:', ver, 'at', esbuildInVite);
      if (ver !== topVer) {
        copyDir(topEsbuildPath, esbuildInVite);
        console.log('Patched!');
      }
    } else {
      console.log('No nested esbuild found - Vite uses top-level esbuild directly');
      console.log('Top-level esbuild is', topVer, '- should be fine');
    }
  } catch(e) {
    console.log('require.resolve failed:', e.message);
  }
}
