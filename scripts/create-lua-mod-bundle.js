const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const versionArg = process.argv[2];
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const version = (versionArg || packageJson.version).replace(/^v/, '');
const distDir = path.join(rootDir, 'dist');
const bundleName = `x4-dashboard-lua-mod-${version}`;
const bundleDir = path.join(distDir, bundleName);
const sourceDir = path.join(rootDir, 'game-mods', 'x4_dashboard_bridge');
const extensionDir = path.join(bundleDir, 'x4_dashboard_bridge');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeBundleReadme() {
  const readme = `# X4 Dashboard Lua Mod ${version}\n\n`
    + `Copy the included \`x4_dashboard_bridge\` folder into your X4 extensions directory.\n\n`
    + `Final path:\n\n`
    + `X4 Foundations/extensions/x4_dashboard_bridge/\n`;

  fs.writeFileSync(path.join(bundleDir, 'README.txt'), readme);
}

fs.rmSync(bundleDir, { recursive: true, force: true });
ensureDir(bundleDir);
fs.cpSync(sourceDir, extensionDir, { recursive: true });
writeBundleReadme();

console.log(`Lua mod bundle created: ${bundleDir}`);
