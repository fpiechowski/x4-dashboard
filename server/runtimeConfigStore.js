const fs = require('fs');
const path = require('path');

const DEFAULT_RUNTIME_CONFIG_PATH = path.join(__dirname, 'config', 'runtime.json');

function getRuntimeConfigPath() {
  return process.env.X4_USER_DATA_PATH
    ? path.join(process.env.X4_USER_DATA_PATH, 'runtime.json')
    : DEFAULT_RUNTIME_CONFIG_PATH;
}

function readConfigFile(configPath) {
  return sanitizeRuntimeConfig(JSON.parse(fs.readFileSync(configPath, 'utf8')));
}

function getDefaultRuntimeConfig() {
  return {
    allowRemoteControls: process.env.ALLOW_REMOTE_CONTROLS === 'true',
    autoHotkeyPath: process.env.AUTOHOTKEY_PATH || '',
    forceActivateGameWindow: process.env.X4_FORCE_ACTIVATE === 'true',
    gameWindowTitle: process.env.X4_WINDOW_TITLE || 'X4',
  };
}

function sanitizeRuntimeConfig(value) {
  const defaults = getDefaultRuntimeConfig();
  const input = value || {};

  return {
    allowRemoteControls: typeof input.allowRemoteControls === 'boolean'
      ? input.allowRemoteControls
      : defaults.allowRemoteControls,
    autoHotkeyPath: typeof input.autoHotkeyPath === 'string'
      ? input.autoHotkeyPath.trim()
      : defaults.autoHotkeyPath,
    forceActivateGameWindow: typeof input.forceActivateGameWindow === 'boolean'
      ? input.forceActivateGameWindow
      : defaults.forceActivateGameWindow,
    gameWindowTitle: typeof input.gameWindowTitle === 'string' && input.gameWindowTitle.trim()
      ? input.gameWindowTitle.trim()
      : defaults.gameWindowTitle,
  };
}

function readRuntimeConfig() {
  const runtimeConfigPath = getRuntimeConfigPath();

  if (fs.existsSync(runtimeConfigPath)) {
    return readConfigFile(runtimeConfigPath);
  }

  if (runtimeConfigPath !== DEFAULT_RUNTIME_CONFIG_PATH && fs.existsSync(DEFAULT_RUNTIME_CONFIG_PATH)) {
    return readConfigFile(DEFAULT_RUNTIME_CONFIG_PATH);
  }

  return getDefaultRuntimeConfig();
}

function writeRuntimeConfig(value) {
  const next = sanitizeRuntimeConfig(value);
  const runtimeConfigPath = getRuntimeConfigPath();

  fs.mkdirSync(path.dirname(runtimeConfigPath), { recursive: true });
  fs.writeFileSync(runtimeConfigPath, JSON.stringify(next, null, 2));
  return next;
}

function mergeRuntimeConfigUpdates(current, updates) {
  return sanitizeRuntimeConfig({
    ...current,
    ...updates,
  });
}

module.exports = {
  RUNTIME_CONFIG_PATH: DEFAULT_RUNTIME_CONFIG_PATH,
  getRuntimeConfigPath,
  readRuntimeConfig,
  writeRuntimeConfig,
  mergeRuntimeConfigUpdates,
};
