/**
 * Key Press Simulation
 * Uses Windows PowerShell SendKeys for key press simulation on Windows.
 * For Linux, uses xdotool. For macOS, uses osascript.
 *
 * SendKeys format:
 *   {F1}-{F12}  - Function keys
 *   ^key        - Ctrl+key
 *   +key        - Shift+key
 *   %key        - Alt+key
 *   {ENTER}, {ESC}, {TAB}, {SPACE}, {DELETE}, {BACKSPACE}
 *   {UP}, {DOWN}, {LEFT}, {RIGHT}, {HOME}, {END}, {PGUP}, {PGDN}
 */

const { exec } = require('child_process');
const os = require('os');

/**
 * Press a key on the host machine.
 * @param {string} key - Key in SendKeys format
 * @param {string[]} modifiers - Additional modifiers ['ctrl', 'shift', 'alt']
 */
function press(key, modifiers = []) {
  if (!key || key.trim() === '') {
    console.warn('[KeyPresser] No key specified');
    return;
  }

  let keyString = key;

  // Apply modifiers prefix (order matters: ctrl, alt, shift)
  if (modifiers.includes('alt')) keyString = '%' + keyString;
  if (modifiers.includes('shift')) keyString = '+' + keyString;
  if (modifiers.includes('ctrl') || modifiers.includes('control')) keyString = '^' + keyString;

  const platform = os.platform();

  if (platform === 'win32') {
    pressWindows(keyString);
  } else if (platform === 'linux') {
    pressLinux(keyString);
  } else if (platform === 'darwin') {
    pressMac(keyString);
  } else {
    console.warn(`[KeyPresser] Platform '${platform}' not supported`);
  }
}

function pressWindows(keyString) {
  // Escape single quotes for PowerShell string
  const escaped = keyString.replace(/'/g, "''");

  // Use System.Windows.Forms.SendKeys which sends to the active window
  const script = `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('${escaped}')`;

  exec(`powershell -NoProfile -NonInteractive -Command "${script}"`, (err, stdout, stderr) => {
    if (err) {
      console.error(`[KeyPresser] Windows key press error: ${err.message}`);
    } else {
      console.log(`[KeyPresser] Pressed: ${keyString}`);
    }
  });
}

function pressLinux(keyString) {
  const xdotoolKey = sendKeysToXdotool(keyString);
  exec(`xdotool key --clearmodifiers ${xdotoolKey}`, (err) => {
    if (err) {
      console.error(`[KeyPresser] Linux xdotool error: ${err.message}`);
      console.log('[KeyPresser] Make sure xdotool is installed: sudo apt install xdotool');
    } else {
      console.log(`[KeyPresser] Pressed (xdotool): ${xdotoolKey}`);
    }
  });
}

function pressMac(keyString) {
  // Convert SendKeys to AppleScript key name
  const appleKey = sendKeysToAppleScript(keyString);
  exec(`osascript -e 'tell application "System Events" to key code ${appleKey}'`, (err) => {
    if (err) {
      console.error(`[KeyPresser] macOS osascript error: ${err.message}`);
    } else {
      console.log(`[KeyPresser] Pressed (osascript): ${appleKey}`);
    }
  });
}

/**
 * Convert SendKeys format to xdotool key names
 */
function sendKeysToXdotool(key) {
  const fkeyMap = {
    '{F1}': 'F1', '{F2}': 'F2', '{F3}': 'F3', '{F4}': 'F4',
    '{F5}': 'F5', '{F6}': 'F6', '{F7}': 'F7', '{F8}': 'F8',
    '{F9}': 'F9', '{F10}': 'F10', '{F11}': 'F11', '{F12}': 'F12',
    '{ENTER}': 'Return', '{ESC}': 'Escape', '{ESCAPE}': 'Escape',
    '{TAB}': 'Tab', '{SPACE}': 'space', '{BACKSPACE}': 'BackSpace',
    '{DELETE}': 'Delete', '{DEL}': 'Delete',
    '{HOME}': 'Home', '{END}': 'End',
    '{UP}': 'Up', '{DOWN}': 'Down', '{LEFT}': 'Left', '{RIGHT}': 'Right',
    '{PGUP}': 'Prior', '{PGDN}': 'Next',
    '{INSERT}': 'Insert',
  };

  let result = key;
  let modifiers = '';

  // Extract modifiers
  while (result.startsWith('^') || result.startsWith('+') || result.startsWith('%')) {
    if (result.startsWith('^')) { modifiers += 'ctrl+'; result = result.slice(1); }
    else if (result.startsWith('+')) { modifiers += 'shift+'; result = result.slice(1); }
    else if (result.startsWith('%')) { modifiers += 'alt+'; result = result.slice(1); }
  }

  // Map special keys
  for (const [sendKey, xdoKey] of Object.entries(fkeyMap)) {
    if (result.toUpperCase() === sendKey) {
      return modifiers + xdoKey;
    }
  }

  return modifiers + result;
}

/**
 * Convert SendKeys format to AppleScript key code (simplified)
 */
function sendKeysToAppleScript(key) {
  const fkeyMap = {
    '{F1}': '122', '{F2}': '120', '{F3}': '99', '{F4}': '118',
    '{F5}': '96', '{F6}': '97', '{F7}': '98', '{F8}': '100',
    '{F9}': '101', '{F10}': '109', '{F11}': '103', '{F12}': '111',
  };
  return fkeyMap[key.toUpperCase()] || '0';
}

module.exports = { press };
