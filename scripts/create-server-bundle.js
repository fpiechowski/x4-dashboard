const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const versionArg = process.argv[2];
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const version = (versionArg || packageJson.version).replace(/^v/, '');
const bundleName = `x4-dashboard-server-${version}`;
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
  'server/node_modules',
  'server/config/keybindings.json',
  'server/utils/normalizeData.js',
  'server/public',
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyEntry(relativePath) {
  const sourcePath = path.join(rootDir, relativePath);
  const targetPath = path.join(bundleDir, relativePath);

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing required server bundle input: ${relativePath}`);
  }

  ensureDir(path.dirname(targetPath));

  if (relativePath === 'server/node_modules') {
    fs.cpSync(sourcePath, targetPath, {
      recursive: true,
      dereference: true,
      filter: (currentPath) => !currentPath.endsWith(`${path.sep}server${path.sep}node_modules${path.sep}x4-dashboard`),
    });
    return;
  }

  fs.cpSync(sourcePath, targetPath, { recursive: true, dereference: true });
}

function writeLaunchFiles() {
  fs.writeFileSync(
    path.join(bundleDir, 'start-server.bat'),
    '@echo off\r\nnode server\\index.js\r\n',
  );

  fs.writeFileSync(
    path.join(bundleDir, 'start-server.sh'),
    '#!/usr/bin/env sh\nnode server/index.js\n',
  );

  const readme = `# X4 Dashboard Server ${version}\n\n`
    + `This package contains the standalone dashboard server for browser-based clients.\n\n`
    + `## Start\n\n`
    + `- Windows: run \`start-server.bat\`\n`
    + `- Any platform with Node.js 18+: run \`node server/index.js\`\n\n`
    + `## What this package includes\n\n`
    + `- built frontend in \`server/public/\`\n`
    + `- server runtime files and dependencies\n`
    + `- keybinding configuration\n\n`
    + `## Client usage\n\n`
    + `After startup, open the dashboard from a browser on the same machine or another device on the same LAN using the URLs printed by the server.\n`;

  fs.writeFileSync(path.join(bundleDir, 'RUN_SERVER.md'), readme);
}

fs.rmSync(bundleDir, { recursive: true, force: true });
ensureDir(bundleDir);

for (const entry of filesToCopy) {
  copyEntry(entry);
}

writeLaunchFiles();

console.log(`Server bundle created: ${bundleDir}`);
