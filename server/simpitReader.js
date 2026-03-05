/**
 * X4 Simpit Named Pipe Reader
 * Connects to the X4 Simpit named pipe and reads JSON events.
 *
 * X4-SimPit: https://github.com/bekopharm/x4-simpit
 * Uses Elite Dangerous-compatible JSON event format.
 *
 * Pipe name on Windows: \\.\pipe\x4simpit_out
 * Events: Status, Loadout, Commander, Player, ShipTargeted,
 *         Docked, Undocked, ReceiveText, UnderAttack, HeatWarning
 */

const net = require('net');
const EventEmitter = require('events');

class SimpitReader extends EventEmitter {
  constructor(options = {}) {
    super();
    // On Windows, named pipes are accessed via \\.\pipe\<name>
    this.pipePath = options.pipePath || '\\\\.\\pipe\\x4simpit_out';
    this.retryDelay = options.retryDelay || 3000;
    this.buffer = '';
    this.connected = false;
    this.client = null;
    this.retryTimer = null;
    this.stopping = false;
    this.loggedFirstFail = false;
  }

  start() {
    console.log(`[SimpitReader] Connecting to pipe: ${this.pipePath}`);
    this.connect();
  }

  connect() {
    if (this.stopping) return;

    // Clean up old client
    if (this.client) {
      this.client.removeAllListeners();
      this.client.destroy();
      this.client = null;
    }

    this.buffer = '';
    const client = net.createConnection(this.pipePath);
    this.client = client;

    client.setEncoding('utf8');

    client.on('connect', () => {
      this.connected = true;
      this.loggedFirstFail = false;
      console.log('[SimpitReader] Connected to X4 Simpit pipe');
      this.emit('connected');
    });

    client.on('data', (chunk) => {
      this.buffer += chunk;
      this.processBuffer();
    });

    client.on('error', (err) => {
      if (!this.loggedFirstFail) {
        if (this.connected) {
          console.log(`[SimpitReader] Pipe error: ${err.message}`);
        } else {
          console.log(`[SimpitReader] Pipe not available (${err.code}), retrying every ${this.retryDelay}ms...`);
          this.loggedFirstFail = true;
        }
      }
      this.connected = false;
      this.emit('disconnected');
    });

    client.on('close', () => {
      if (this.connected) {
        console.log('[SimpitReader] Pipe closed, reconnecting...');
      }
      this.connected = false;
      this.emit('disconnected');
      this.scheduleReconnect();
    });
  }

  processBuffer() {
    // Events are newline-delimited JSON objects
    // Some events may have ISO timestamp appended after the JSON
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop() || ''; // Keep last incomplete line

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Try parsing the full line
      try {
        const event = JSON.parse(trimmed);
        this.handleEvent(event);
        continue;
      } catch {
        // Maybe there's a timestamp appended after the JSON object
      }

      // Try to extract just the JSON part (everything up to and including the last })
      const match = trimmed.match(/^(\{[\s\S]*\})/);
      if (match) {
        try {
          const event = JSON.parse(match[1]);
          this.handleEvent(event);
        } catch {
          // Truly malformed, skip
        }
      }
    }
  }

  handleEvent(event) {
    const type = event.event || event.Event;
    if (!type) return;
    this.emit('event', event);
  }

  scheduleReconnect() {
    if (this.stopping || this.retryTimer) return;
    this.retryTimer = setTimeout(() => {
      this.retryTimer = null;
      if (!this.stopping) this.connect();
    }, this.retryDelay);
  }

  stop() {
    this.stopping = true;
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    if (this.client) {
      this.client.removeAllListeners();
      this.client.destroy();
      this.client = null;
    }
    console.log('[SimpitReader] Stopped');
  }
}

module.exports = SimpitReader;
