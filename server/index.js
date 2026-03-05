/**
 * X4 Dashboard Server
 * Aggregates data from X4 External App and X4 Simpit,
 * broadcasts unified state via WebSocket, and handles key press commands.
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const X4ExternalApp = require('./x4ExternalApp');
const SimpitReader = require('./simpitReader');
const DataAggregator = require('./dataAggregator');
const MockDataSource = require('./mockData');
const keyPresser = require('./keyPresser');

const PORT = process.env.PORT || 3001;
const EXTERNAL_APP_URL = process.env.X4_EXTERNAL_URL || 'http://localhost:8080';
const SIMPIT_PIPE = process.env.SIMPIT_PIPE || '\\\\.\\pipe\\x4simpit_out';
const KEYBINDINGS_PATH = path.join(__dirname, 'config', 'keybindings.json');

const MOCK_MODE = process.argv.includes('--mock') || process.env.MOCK === 'true';

// === Express + HTTP server ===
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve built client from server/public
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

const server = http.createServer(app);

// === WebSocket server ===
const wss = new WebSocket.Server({ server });

function broadcast(data) {
  const msg = JSON.stringify(data);
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      try { client.send(msg); } catch { /* ignore */ }
    }
  }
}

wss.on('connection', (ws, req) => {
  console.log(`[WS] Client connected from ${req.socket.remoteAddress}`);
  // Send current state immediately on connect
  ws.send(JSON.stringify(aggregator.getState()));
  ws.on('error', (err) => console.log(`[WS] Client error: ${err.message}`));
  ws.on('close', () => console.log('[WS] Client disconnected'));
});

// === Data aggregation ===
const aggregator = new DataAggregator();

function onExternalData(data) {
  aggregator.updateExternal(data);
  broadcast(aggregator.getState());
}

function onSimpitEvent(event) {
  aggregator.updateSimpit(event);
  broadcast(aggregator.getState());
}

let x4App = null;
let simpit = null;
let mock = null;

if (MOCK_MODE) {
  // ── Mock mode: generated fake evolving data ──────────────────────────────
  mock = new MockDataSource();
  mock.on('data',  onExternalData);
  mock.on('event', onSimpitEvent);
  mock.start();
} else {
  // ── Live mode: real data sources ─────────────────────────────────────────
  x4App = new X4ExternalApp({ baseUrl: EXTERNAL_APP_URL });
  x4App.on('data', onExternalData);
  x4App.start();

  simpit = new SimpitReader({ pipePath: SIMPIT_PIPE });
  simpit.on('event', onSimpitEvent);
  simpit.on('connected',    () => broadcast(aggregator.getState()));
  simpit.on('disconnected', () => broadcast(aggregator.getState()));
  simpit.start();
}

// === REST API ===

// Trigger a key press for a named action
app.post('/api/keypress', (req, res) => {
  const { action } = req.body || {};
  if (!action) return res.status(400).json({ error: 'action is required' });

  let bindings;
  try {
    bindings = JSON.parse(fs.readFileSync(KEYBINDINGS_PATH, 'utf8'));
  } catch (err) {
    return res.status(500).json({ error: `Cannot read keybindings: ${err.message}` });
  }

  const binding = bindings.bindings?.[action];
  if (!binding) {
    return res.status(404).json({ error: `Unknown action: ${action}`, available: Object.keys(bindings.bindings || {}) });
  }

  keyPresser.press(binding.key, binding.modifiers || []);
  res.json({ ok: true, action, key: binding.key });
});

// Get all key bindings
app.get('/api/keybindings', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(KEYBINDINGS_PATH, 'utf8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update key bindings (merge with existing)
app.put('/api/keybindings', (req, res) => {
  try {
    const current = JSON.parse(fs.readFileSync(KEYBINDINGS_PATH, 'utf8'));
    const updates = req.body?.bindings || {};
    const updated = {
      ...current,
      bindings: { ...current.bindings, ...updates },
    };
    fs.writeFileSync(KEYBINDINGS_PATH, JSON.stringify(updated, null, 2));
    console.log('[Keybindings] Updated:', Object.keys(updates).join(', '));
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current aggregated state (for debugging)
app.get('/api/state', (req, res) => {
  res.json(aggregator.getState());
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    externalConnected: aggregator.externalConnected,
    simpitConnected: aggregator.simpitConnected,
  });
});

// === Start server ===
server.listen(PORT, '0.0.0.0', () => {
  const ifaces = require('os').networkInterfaces();
  const lan = Object.values(ifaces).flat().find(i => i.family === 'IPv4' && !i.internal);

  console.log('\n========================================');
  console.log('  X4 Foundations Dashboard Server');
  if (MOCK_MODE) console.log('  *** MOCK MODE — preview only ***');
  console.log('========================================');
  console.log(`  Open:   http://localhost:${PORT}`);
  if (lan) console.log(`  LAN:    http://${lan.address}:${PORT}`);
  if (!MOCK_MODE) {
    console.log(`  Data:   ${EXTERNAL_APP_URL}/api/data`);
    console.log(`  Pipe:   ${SIMPIT_PIPE}`);
  }
  console.log('========================================\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  x4App?.stop();
  simpit?.stop();
  mock?.stop();
  server.close(() => process.exit(0));
});
