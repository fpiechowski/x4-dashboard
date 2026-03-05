import { useState, useEffect, useCallback } from 'react';
import { GameState } from '../types/gameData';

const DEFAULT_STATE: GameState = {
  _meta: { timestamp: '', externalConnected: false, simpitConnected: false },
  player: { name: '–', faction: '', credits: 0, sectorname: '', sectorowner: '' },
  ship: {
    name: '', class: '', hull: 100, shields: 100, shieldsUp: true,
    speed: 0, boostEnergy: 100, isDockedOrLanded: false, landingGearDown: false,
    overHeating: false, inDanger: false, maxSpeed: 0, maxBoostSpeed: 0,
    fuel: null, fuelReserve: null, cargo: 0, maxCargo: 0, oxygen: null,
  },
  navigation: {
    sector: '', cluster: '', speed: 0, heading: 0,
    coordinates: { x: 0, y: 0, z: 0 }, inTravelMode: false, legalStatus: '',
  },
  systems: {
    flightAssist: true, seta: false, autopilot: false, boost: false,
    lightsOn: false, hardpointsDeployed: false, landingGearDown: false,
    shieldsUp: true, massLocked: false, travelDrive: false, silentRunning: false,
  },
  combat: { underAttack: false, attackType: null, target: null },
  docked: null,
  missionOffers: null,
  activeMission: null,
  logbook: null,
  currentResearch: null,
  factions: null,
  agents: null,
  inventory: null,
  transactionLog: null,
  comms: [],
  loadout: null,
};

export function useGameData(wsUrl: string) {
  const [state, setState] = useState<GameState>(DEFAULT_STATE);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let active = true;

    function connect() {
      if (!active) return;
      try {
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          if (!active) return ws?.close();
          setWsConnected(true);
          console.log('[WS] Connected to X4 Dashboard server');
        };

        ws.onmessage = (e) => {
          if (!active) return;
          try {
            setState(JSON.parse(e.data));
          } catch {
            // ignore parse errors
          }
        };

        ws.onclose = () => {
          if (!active) return;
          setWsConnected(false);
          retryTimer = setTimeout(connect, 3000);
        };

        ws.onerror = () => {
          ws?.close();
        };
      } catch {
        retryTimer = setTimeout(connect, 3000);
      }
    }

    connect();

    return () => {
      active = false;
      if (retryTimer) clearTimeout(retryTimer);
      ws?.close();
    };
  }, [wsUrl]);

  const pressKey = useCallback(async (action: string) => {
    try {
      const res = await fetch('/api/keypress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        console.error(`[KeyPress] Failed for action "${action}": ${err.error}`);
      }
    } catch (e) {
      console.error('[KeyPress] Network error:', e);
    }
  }, []);

  return { state, wsConnected, pressKey };
}
