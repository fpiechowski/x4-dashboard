const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const versionArg = process.argv[2];
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const version = (versionArg || packageJson.version).replace(/^v/, '');
const bundleName = `x4-dashboard-${version}`;
const distDir = path.join(rootDir, 'dist');
const bundleDir = path.join(distDir, bundleName);

const filesToCopy = [
  'README.md',
  'LICENSE',
  'SECURITY.md',
  'server/index.js',
  'server/dataAggregator.js',
  'server/keyPresser.js',
  'server/mockData.js',
  'server/keybindingsStore.js',
  'server/requestGuards.js',
  'server/package.json',
  'server/package-lock.json',
  'server/config/keybindings.json',
  'server/utils/normalizeData.js',
  'server/public',
  'game-mods/mycu_external_app',
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyEntry(relativePath) {
  const sourcePath = path.join(rootDir, relativePath);
  const targetPath = path.join(bundleDir, relativePath);

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing required bundle input: ${relativePath}`);
  }

  ensureDir(path.dirname(targetPath));
  fs.cpSync(sourcePath, targetPath, { recursive: true });
}

function writeReleaseReadme() {
  const readmePath = path.join(bundleDir, 'RUN_RELEASE.md');
  const content = `# X4 Dashboard ${version}\n\n`
    + `This is the packaged runtime bundle for X4 Dashboard.\n\n`
    + `## Start\n\n`
    + `1. Install Node.js 18 or newer.\n`
    + `2. Install server dependencies:\n\n`
    + `   npm --prefix server install\n\n`
    + `3. Start the dashboard:\n\n`
    + `   npm --prefix server start\n\n`
    + `4. Open http://localhost:3001\n\n`
    + `## Included\n\n`
    + `- built frontend in server/public/\n`
    + `- Node.js server runtime\n`
    + `- X4 Lua mod in game-mods/mycu_external_app/\n`;

  fs.writeFileSync(readmePath, content);
}

fs.rmSync(bundleDir, { recursive: true, force: true });
ensureDir(bundleDir);

for (const entry of filesToCopy) {
  copyEntry(entry);
}

writeReleaseReadme();

console.log(`Release bundle created: ${bundleDir}`);
