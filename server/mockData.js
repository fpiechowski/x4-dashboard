/**
 * Mock Data Source
 * Generates realistic evolving game state for dashboard preview.
 * Fires the same events as X4ExternalApp ('data') and SimpitReader ('event'),
 * so it can be dropped in as a replacement in index.js.
 *
 * Usage: node index.js --mock
 */

const EventEmitter = require('events');

// ── Static mock content ───────────────────────────────────────────────────────

const MOCK_MISSIONS_GUILD = [
  {
    id: 'g1', name: null,
    missions: {
      m1: { name: 'Eliminate Pirate Squadron', rewardtext: '320,000 Cr', difficulty: 4, reward: 320000,
            description: 'A group of Xenon fighters has been spotted in Hewa\'s Twin. Destroy all hostiles.', objectives: ['Destroy 4 pirate fighters'], duration: 3600 },
      m2: { name: 'Courier: Teladi Station Supplies', rewardtext: '85,000 Cr', difficulty: 2, reward: 85000,
            description: 'Transport a shipment of medical equipment from Argon Prime to Ianamus Zura.', objectives: ['Pick up cargo', 'Deliver to Ianamus Zura'], duration: 1800 },
    }
  }
];

const MOCK_MISSIONS_OTHER = [
  {
    id: 'o1', name: null,
    missions: {
      m1: { name: 'Emergency: Station Under Attack', rewardtext: '550,000 Cr', difficulty: 5, reward: 550000,
            description: 'Antigone Memorial is under attack by a Xenon fleet. Defend the station at all costs.', objectives: ['Destroy 12 Xenon ships', 'Protect station hull above 50%'], duration: 0 },
      m2: { name: 'Fetch Rare Components', rewardtext: '42,000 Cr', difficulty: 1, reward: 42000,
            description: 'Retrieve a crate of rare electronic components drifting in Getsu Fune.', objectives: ['Locate debris field', 'Retrieve container'], duration: 900 },
      m3: { name: 'Scan Unknown Anomaly', rewardtext: '110,000 Cr', difficulty: 3, reward: 110000,
            description: 'An unknown energy signature has been detected near the Xenon border. Investigate.', objectives: ['Reach coordinates', 'Perform full scan'], duration: 2700 },
    }
  }
];

const MOCK_MISSIONS_PLOT = [
  {
    id: 'p1', name: 'Fires of Defeat',
    missions: {
      m1: { name: 'The Price of Freedom', rewardtext: 'Story progression', difficulty: 3, reward: 0,
            description: 'The SCA contact has gone silent. Travel to Eighteen Billion to investigate.', objectives: ['Travel to Eighteen Billion', 'Contact SCA operative'], duration: 0 },
    }
  }
];

const MOCK_LOGBOOK = [
  { title: 'Station construction complete', text: 'Your Teladi Trading Station in Ianamus Zura has finished construction and is now operational.', factionname: 'Teladi Company' },
  { title: 'Trade route established', text: 'Automated trade route Alpha-7 has been set up between Argon Prime and Getsu Fune.', factionname: '' },
  { title: 'Combat report: Pirate base destroyed', text: 'Your forces have successfully eliminated the pirate base in Hewa\'s Twin. 12 ships destroyed.', factionname: 'Antigone Republic' },
  { title: 'Research unlocked: Plasma Weapons Mk3', text: 'Research into Plasma Weapons Mk3 has been completed. New blueprints are now available.', factionname: '' },
  { title: 'Reputation increased: Argon Federation', text: 'Your standing with the Argon Federation has improved to Ally. New military licenses available.', factionname: 'Argon Federation' },
];

const MOCK_COMMS = [
  { sender: 'STATION: ARGON PRIME', content: 'Commander, docking clearance granted. Bay 7 is available.', channel: 'General' },
  { sender: 'TRADE AGENT CHEN', content: 'The silicon shipment has arrived at our warehouse. Ready to proceed with sale.', channel: 'Trade' },
  { sender: 'FLEET COMMAND', content: 'Xenon activity detected in Hewa\'s Twin. All available ships to intercept.', channel: 'Military' },
  { sender: 'PILOT: UNIT-7', content: 'All clear in sector. Returning to patrol route.', channel: 'Wing' },
  { sender: 'STATION: TELADI HQ', content: 'Your trade license has been renewed for sector Ianamus Zura.', channel: 'Upkeep' },
  { sender: 'UNKNOWN PILOT', content: 'Watch your back out there, Commander. The Kha\'ak have been spotted near the gate.', channel: 'General' },
];

const MOCK_RESEARCH = {
  name: 'Advanced Shield Generator',
  description: 'Improves shield regeneration rate by 35% and maximum capacity by 20% for all ships in your fleet.',
  researchtime: 14400,
  percentageCompleted: 61.4,
  precursors: [{ name: 'Shield Technology II' }],
  resources: [
    { name: 'Silicon Wafers', currentAmount: 420, totalAmount: 600 },
    { name: 'Quantum Tubes',  currentAmount: 18,  totalAmount: 25  },
    { name: 'Energy Cells',   currentAmount: 1800, totalAmount: 2000 },
  ],
};

const MOCK_FACTIONS = {
  argon:    { name: 'Argon Federation',  relation: 'ally',    licences: ['military', 'police'] },
  teladi:   { name: 'Teladi Company',    relation: 'friend',  licences: ['trade'] },
  paranid:  { name: 'Holy Order',        relation: 'neutral', licences: [] },
  xenon:    { name: 'Xenon',             relation: 'enemy',   licences: [] },
  khaak:    { name: "Kha'ak",            relation: 'enemy',   licences: [] },
  antielid: { name: 'Antigone Republic', relation: 'friend',  licences: [] },
};

// ── State evolution ───────────────────────────────────────────────────────────

class MockDataSource extends EventEmitter {
  constructor() {
    super();

    // Ship state
    this.hull    = 98;
    this.shields = 100;
    this.speed   = 0;
    this.heading = 42;
    this.boostEnergy = 100;
    this.credits = 3_254_000;

    // Combat state
    this.inCombat         = false;
    this.combatTimer      = null;
    this.combatCooldown   = false;

    // System flags
    this.flightAssist  = true;
    this.seta          = false;
    this.travelDrive   = false;
    this.lightsOn      = true;
    this.silentRunning = false;

    // Evolving values
    this.tick      = 0;
    this.sector    = 'Segaris Pioneer';
    this.commsIdx  = 0;
    this.intervals = [];

    // Mission timer state
    this.activeMissionTimeLeft = 5400;
  }

  // ── Event emitters ──────────────────────────────────────────────────────────

  emitExternal() {
    this.emit('data', {
      _connected: true,
      playerProfile: {
        name:        'CAP. RAMIREZ',
        faction:     'Argon Federation',
        credits:     Math.round(this.credits),
        sectorname:  this.sector,
        sectorowner: 'Teladi Company',
      },
      missionOffers: {
        plot:  MOCK_MISSIONS_PLOT,
        guild: MOCK_MISSIONS_GUILD,
        other: MOCK_MISSIONS_OTHER,
      },
      activeMission: {
        name:        'Eliminate Pirate Squadron',
        description: 'A group of Xenon fighters has been spotted in Hewa\'s Twin. Destroy all hostiles before they reach the civilian convoy.',
        completed:   false,
        reward:      320_000,
        timeleft:    Math.round(this.activeMissionTimeLeft),
      },
      logbook:        { list: MOCK_LOGBOOK },
      currentResearch: {
        ...MOCK_RESEARCH,
        percentageCompleted: Math.min(99.9, MOCK_RESEARCH.percentageCompleted + this.tick * 0.001),
      },
      factions: MOCK_FACTIONS,
    });
  }

  emitStatus() {
    const flags = this.buildFlags();
    this.emit('event', {
      event:     'Status',
      timestamp: new Date().toISOString(),
      hull:      Math.round(this.hull),
      shields:   Math.round(this.shields),
      Hull:      Math.round(this.hull),
      Shields:   Math.round(this.shields),
      Speed:     Math.round(this.speed),
      Heading:   Math.round(this.heading) % 360,
      Flags:     flags,
      BodyName:  this.sector,
      LegalState: 'Clean',
      seta:       this.seta,
      autopilot:  false,
      boost:      false,
      boostEnergy: Math.round(this.boostEnergy),
      Fuel: { FuelMain: 42.3, FuelReservoir: 8.1 },
      Cargo: 85,
    });
  }

  emitLoadout() {
    this.emit('event', {
      event:        'Loadout',
      timestamp:    new Date().toISOString(),
      Ship:         'NEMESIS II',
      ShipName:     'NEMESIS II',
      ShipClass:    'Frigate',
      MaxSpeed:     612,
      BoostSpeed:   890,
      Hull:         100,
      Shields:      100,
      Cargo:        500,
      Fuel:         100,
    });
  }

  emitCommander() {
    this.emit('event', {
      event:     'Commander',
      timestamp: new Date().toISOString(),
      Name:      'RAMIREZ',
    });
  }

  emitUnderAttack(type = 'Unknown') {
    this.emit('event', {
      event:      'UnderAttack',
      timestamp:  new Date().toISOString(),
      AttackType: type,
      Target:     'You',
    });
  }

  emitTarget() {
    const hull    = Math.max(0, 65 - (this.tick % 30) * 2);
    const shields = Math.max(0, 80 - (this.tick % 30) * 3);
    this.emit('event', {
      event:        'ShipTargeted',
      timestamp:    new Date().toISOString(),
      Name:         'XENON K',
      Ship:         'Xenon K',
      ShipName:     'Xenon K',
      HullHealth:   hull,
      ShieldHealth: shields,
      Hull:         hull,
      Shields:      shields,
      Faction:      'Xenon',
      LegalStatus:  'Hostile',
      Hostile:      true,
      Distance:     Math.round(800 + Math.sin(this.tick * 0.1) * 400),
      PilotRank:    'Dangerous',
    });
  }

  emitComm(msg) {
    this.emit('event', {
      event:     'ReceiveText',
      timestamp: new Date().toISOString(),
      Messages: [{
        From:      msg.sender,
        Message:   msg.content,
        Channel:   msg.channel,
        Timestamp: new Date().toISOString(),
      }],
    });
  }

  // ── Flag bitmask builder ────────────────────────────────────────────────────

  buildFlags() {
    let f = 0;
    if (!this.inCombat)                    f |= (1 << 3);  // shields up
    if (!this.flightAssist)                f |= (1 << 5);  // flight assist OFF flag
    if (this.lightsOn)                     f |= (1 << 8);  // lights on
    if (this.travelDrive && !this.inCombat) f |= (1 << 4); // supercruise = travel drive
    if (this.silentRunning)                f |= (1 << 10); // silent running
    return f;
  }

  // ── Tick logic ──────────────────────────────────────────────────────────────

  tickStatus() {
    this.tick++;
    const t = this.tick * 0.05; // time in radians

    if (this.inCombat) {
      // Combat: hull/shields take damage
      this.hull    = Math.max(18, this.hull    - 0.4 - Math.random() * 0.8);
      this.shields = Math.max(0,  this.shields - 1.2 - Math.random() * 1.5);
      this.speed   = 300 + Math.sin(t * 3) * 200;
    } else {
      // Normal flight: shields regenerate, speed varies
      this.shields = Math.min(100, this.shields + 0.25);
      this.hull    = Math.min(100, this.hull    + 0.02);
      // Sinusoidal speed curve simulating acceleration/deceleration
      this.speed = Math.max(0, 250 + Math.sin(t * 0.7) * 250 + Math.cos(t * 0.3) * 80);
    }

    // Heading rotates slowly
    this.heading = (this.heading + 0.3 + (this.inCombat ? Math.sin(t * 2) * 2 : 0)) % 360;

    // Boost energy regenerates
    this.boostEnergy = Math.min(100, this.boostEnergy + 0.5);

    // Credits trickle up (mining income)
    if (this.tick % 10 === 0) this.credits += Math.random() * 1200;

    // Active mission timer
    if (this.tick % 5 === 0) this.activeMissionTimeLeft = Math.max(0, this.activeMissionTimeLeft - 1);

    this.emitStatus();

    // Emit target when in combat
    if (this.inCombat) {
      this.emitTarget();
    }
  }

  tickExternal() {
    this.emitExternal();
  }

  // ── Combat scenario ─────────────────────────────────────────────────────────

  startCombat() {
    if (this.inCombat || this.combatCooldown) return;
    this.inCombat = true;
    console.log('[Mock] ⚠ COMBAT STARTED');

    // Rapid fire under-attack events
    this.emitUnderAttack('Missile');
    const rapidFire = setInterval(() => this.emitUnderAttack('Missile'), 3000);

    this.combatTimer = setTimeout(() => {
      clearInterval(rapidFire);
      this.inCombat = false;
      this.combatCooldown = true;
      console.log('[Mock] Combat ended, hull:', Math.round(this.hull), 'shields:', Math.round(this.shields));
      // 30 second cooldown before next combat
      setTimeout(() => { this.combatCooldown = false; }, 30000);
    }, 15000);
  }

  // ── Start / Stop ────────────────────────────────────────────────────────────

  start() {
    console.log('\n[Mock] ══════════════════════════════════');
    console.log('[Mock]  MOCK DATA MODE ACTIVE');
    console.log('[Mock]  Dashboard preview at http://localhost:3001');
    console.log('[Mock] ══════════════════════════════════\n');

    // Fire initial data burst
    this.emitCommander();
    this.emitLoadout();
    this.emitExternal();

    // Periodic comm messages (one every 15s)
    this.intervals.push(setInterval(() => {
      const msg = MOCK_COMMS[this.commsIdx % MOCK_COMMS.length];
      this.commsIdx++;
      this.emitComm(msg);
    }, 15000));

    // Status update every 250ms
    this.intervals.push(setInterval(() => this.tickStatus(), 250));

    // External data (missions, logbook, etc.) every 3s
    this.intervals.push(setInterval(() => this.tickExternal(), 3000));

    // Combat scenario every 45s
    this.intervals.push(setInterval(() => this.startCombat(), 45000));

    // Emit first comm after 3s
    setTimeout(() => this.emitComm(MOCK_COMMS[0]), 3000);
  }

  stop() {
    for (const i of this.intervals) clearInterval(i);
    if (this.combatTimer) clearTimeout(this.combatTimer);
    this.intervals = [];
  }
}

module.exports = MockDataSource;
