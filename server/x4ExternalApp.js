/**
 * X4 External App Data Source
 * Polls the X4-External-App REST API (default: http://localhost:8080/api/data)
 * every second and emits 'data' events with the normalized game state.
 *
 * X4-External-App: https://github.com/mycumycu/X4-External-App
 * Provides: playerProfile, logbook, missionOffers, activeMission,
 *           playerGoals, currentResearch, transactionLog, factions,
 *           agents, inventory
 */

const EventEmitter = require('events');

class X4ExternalApp extends EventEmitter {
  constructor(options = {}) {
    super();
    this.baseUrl = options.baseUrl || 'http://localhost:8080';
    this.intervalMs = options.intervalMs || 1000;
    this.interval = null;
    this.lastError = null;
    this.connected = false;
  }

  start() {
    console.log(`[X4ExternalApp] Starting poll at ${this.baseUrl}/api/data every ${this.intervalMs}ms`);
    this.poll();
    this.interval = setInterval(() => this.poll(), this.intervalMs);
  }

  async poll() {
    try {
      const res = await fetch(`${this.baseUrl}/api/data`, {
        signal: AbortSignal.timeout(2500),
        headers: { 'Accept': 'application/json' },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }

      const json = await res.json();

      // The API wraps data in { gameData: {...}, updatePending: bool, time: number }
      const gameData = json.gameData || json;

      if (!this.connected) {
        console.log('[X4ExternalApp] Connected');
        this.connected = true;
        this.lastError = null;
      }

      this.emit('data', { ...gameData, _connected: true });
    } catch (err) {
      const msg = err.message;
      if (msg !== this.lastError) {
        if (this.connected) console.log('[X4ExternalApp] Disconnected');
        else console.log(`[X4ExternalApp] Not available: ${msg}`);
        this.lastError = msg;
        this.connected = false;
      }
      this.emit('data', { _connected: false });
    }
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    console.log('[X4ExternalApp] Stopped');
  }
}

module.exports = X4ExternalApp;
