const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const viteEsbuildPath = path.join(root, 'node_modules', 'vite', 'node_modules', 'esbuild');
const topEsbuildPath = path.join(root, 'node_modules', 'esbuild');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

if (fs.existsSync(viteEsbuildPath) && fs.existsSync(topEsbuildPath)) {
  try {
    const viteVer = JSON.parse(fs.readFileSync(path.join(viteEsbuildPath, 'package.json'), 'utf8')).version;
    const topVer = JSON.parse(fs.readFileSync(path.join(topEsbuildPath, 'package.json'), 'utf8')).version;
    if (viteVer !== topVer) {
      console.log('Patching vite esbuild ' + viteVer + ' -> ' + topVer);
      copyDir(topEsbuildPath, viteEsbuildPath);
      const topAt = path.join(root, 'node_modules', '@esbuild');
      const viteAt = path.join(root, 'node_modules', 'vite', 'node_modules', '@esbuild');
      if (fs.existsSync(topAt) && fs.existsSync(viteAt)) {
        copyDir(topAt, viteAt);
      }
      console.log('Patch done!');
    } else {
      console.log('esbuild already up to date (' + topVer + ')');
    }
  } catch(e) {
    console.log('Patch skipped:', e.message);
  }
} else {
  console.log('No nested vite esbuild, skip patch');
}
