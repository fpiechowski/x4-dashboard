/**
 * Data Aggregator
 * Merges data from X4 External App and X4 Simpit into a unified dashboard state.
 *
 * Data precedence:
 * - X4 External App: playerProfile, missionOffers, logbook, research, factions, agents, inventory
 * - X4 Simpit: ship status (hull/shields), navigation, combat alerts, comms
 * - Overlapping data (player name, credits, sector): External App takes precedence when available
 */

const UNDER_ATTACK_TTL = 8000; // ms - how long to show under attack status

class DataAggregator {
  constructor() {
    // Raw data from each source
    this.external = {};
    this.simpit = {
      status: null,
      loadout: null,
      commander: null,
      player: null,
      target: null,
      docked: null,
    };

    // Derived state
    this.commsHistory = [];    // ReceiveText messages
    this.underAttack = false;
    this.underAttackType = null;
    this.lastUnderAttackTime = 0;
    this.heatWarning = false;
    this.heatWarningTimer = null;

    // Connection state
    this.externalConnected = false;
    this.simpitConnected = false;
  }

  updateExternal(data) {
    this.externalConnected = data._connected !== false;
    if (!this.externalConnected) return;

    const { _connected, ...rest } = data;
    this.external = rest;
  }

  updateSimpit(event) {
    this.simpitConnected = true;
    const type = (event.event || event.Event || '').trim();

    switch (type) {
      case 'Status':
        this.simpit.status = event;
        break;

      case 'Loadout':
        this.simpit.loadout = event;
        break;

      case 'Commander':
        this.simpit.commander = event;
        break;

      case 'Player':
        this.simpit.player = event;
        break;

      case 'ShipTargeted':
        this.simpit.target = event;
        break;

      case 'Docked':
        this.simpit.docked = event;
        break;

      case 'Undocked':
        this.simpit.docked = null;
        break;

      case 'ReceiveText': {
        // Add new messages at the front, keep latest 30
        const messages = event.Messages || event.messages || [];
        if (Array.isArray(messages) && messages.length > 0) {
          const normalized = messages.map(msg => ({
            sender: msg.From || msg.from || msg.Sender || msg.sender || 'System',
            content: msg.Message || msg.message || msg.Text || msg.text || msg.Content || '',
            channel: msg.Channel || msg.channel || 'General',
            timestamp: msg.Timestamp || msg.timestamp || event.timestamp || new Date().toISOString(),
            source: 'simpit',
          }));
          this.commsHistory.unshift(...normalized);
          this.commsHistory = this.commsHistory.slice(0, 30);
        }
        break;
      }

      case 'UnderAttack':
        this.underAttack = true;
        this.underAttackType = event.AttackType || event.Type || event.attackType || 'Unknown';
        this.lastUnderAttackTime = Date.now();
        break;

      case 'HeatWarning':
        this.heatWarning = true;
        if (this.heatWarningTimer) clearTimeout(this.heatWarningTimer);
        this.heatWarningTimer = setTimeout(() => {
          this.heatWarning = false;
        }, 15000);
        break;
    }
  }

  /**
   * Parse Elite Dangerous / X4 Simpit status flags bitmask.
   * Bit positions follow the ED standard, mapped to X4 equivalents.
   */
  parseFlags(flags) {
    if (flags === null || flags === undefined) return {};
    return {
      docked:              !!(flags & (1 << 0)),
      landed:              !!(flags & (1 << 1)),
      landingGearDown:     !!(flags & (1 << 2)),
      shieldsUp:           !!(flags & (1 << 3)),
      inTravelMode:        !!(flags & (1 << 4)),  // supercruise → travel drive
      flightAssistOff:     !!(flags & (1 << 5)),
      hardpointsDeployed:  !!(flags & (1 << 6)),
      lightsOn:            !!(flags & (1 << 8)),
      fsdMassLocked:       !!(flags & (1 << 16)), // mass locked → cannot travel
      overHeating:         !!(flags & (1 << 20)),
      inDanger:            !!(flags & (1 << 22)),
    };
  }

  getState() {
    const s = this.simpit.status;
    const loadout = this.simpit.loadout;
    const target = this.simpit.target;
    const ext = this.external;

    // Parse flags bitmask
    const flags = this.parseFlags(s?.Flags ?? s?.flags);

    // Resolve under attack (with TTL)
    const nowUnderAttack = this.underAttack &&
      (Date.now() - this.lastUnderAttackTime < UNDER_ATTACK_TTL);
    if (!nowUnderAttack && this.underAttack) {
      // TTL expired
      this.underAttack = false;
      this.underAttackType = null;
    }

    // === Player Info (External App preferred, Simpit as fallback) ===
    const player = {
      name:        ext.playerProfile?.name
                || this.simpit.commander?.Name
                || this.simpit.player?.Name
                || 'UNKNOWN',
      faction:     ext.playerProfile?.faction
                || this.simpit.player?.Faction
                || '',
      credits:     ext.playerProfile?.credits
                ?? s?.Balance
                ?? s?.balance
                ?? this.simpit.player?.Credits
                ?? 0,
      sectorname:  ext.playerProfile?.sectorname
                || this.simpit.player?.CurrentSector
                || s?.BodyName
                || s?.bodyName
                || '',
      sectorowner: ext.playerProfile?.sectorowner || '',
    };

    // === Ship Status (primarily from Simpit) ===
    // Hull/shields: check multiple possible field names (ED format uses different casing)
    const hull    = s?.hull    ?? s?.Hull    ?? loadout?.Hull    ?? loadout?.hull    ?? 100;
    const shields = s?.shields ?? s?.Shields ?? loadout?.Shields ?? loadout?.shields ?? 100;
    const speed   = s?.Speed   ?? s?.speed   ?? 0;

    const ship = {
      name:             loadout?.Ship || loadout?.ShipName || loadout?.ship_name || '',
      class:            loadout?.ShipClass || loadout?.ship_class || '',
      hull:             Math.max(0, Math.min(100, hull)),
      shields:          Math.max(0, Math.min(100, shields)),
      shieldsUp:        flags.shieldsUp !== undefined ? flags.shieldsUp : true,
      speed:            speed,
      boostEnergy:      s?.BoostEnergy ?? s?.boostEnergy ?? 100,
      isDockedOrLanded: flags.docked || flags.landed || !!this.simpit.docked,
      landingGearDown:  flags.landingGearDown,
      overHeating:      flags.overHeating || this.heatWarning,
      inDanger:         flags.inDanger || nowUnderAttack,
      maxSpeed:         loadout?.MaxSpeed || loadout?.max_speed || 0,
      maxBoostSpeed:    loadout?.BoostSpeed || loadout?.boost_speed || 0,
      fuel:             s?.Fuel?.FuelMain ?? s?.fuel ?? null,
      fuelReserve:      s?.Fuel?.FuelReservoir ?? s?.fuel_reserve ?? null,
      cargo:            s?.Cargo ?? s?.cargo ?? 0,
      maxCargo:         loadout?.Cargo ?? loadout?.cargo ?? 0,
      oxygen:           s?.oxygen ?? null,
    };

    // === System Flags ===
    const systems = {
      flightAssist:      !(flags.flightAssistOff ?? false),
      seta:              s?.seta ?? s?.Seta ?? flags.inTravelMode ?? false,
      autopilot:         s?.autopilot ?? s?.Autopilot ?? false,
      boost:             s?.boost ?? s?.Boost ?? false,
      lightsOn:          flags.lightsOn ?? false,
      hardpointsDeployed: flags.hardpointsDeployed ?? false,
      landingGearDown:   flags.landingGearDown ?? false,
      shieldsUp:         flags.shieldsUp !== undefined ? flags.shieldsUp : true,
      massLocked:        flags.fsdMassLocked ?? false,
      travelDrive:       flags.inTravelMode ?? false,
      silentRunning:     s?.silentRunning ?? s?.SilentRunning ?? false,
    };

    // === Navigation ===
    const navigation = {
      sector:         player.sectorname,
      cluster:        s?.SystemName || s?.systemName || '',
      speed:          speed,
      heading:        s?.Heading ?? s?.heading ?? 0,
      coordinates: {
        x: s?.Latitude  ?? s?.x ?? 0,
        y: s?.Longitude ?? s?.y ?? 0,
        z: s?.Altitude  ?? s?.z ?? 0,
      },
      inTravelMode:   flags.inTravelMode ?? false,
      legalStatus:    s?.LegalState || s?.legalState || '',
    };

    // === Combat / Target ===
    const combatTarget = target ? {
      name:        target.Name || target.PilotName || target.name || 'Unknown',
      shipName:    target.Ship || target.ShipName || target.ship || '',
      hull:        Math.max(0, Math.min(100, target.HullHealth ?? target.Hull ?? target.hull ?? 0)),
      shields:     Math.max(0, Math.min(100, target.ShieldHealth ?? target.Shields ?? target.shields ?? 0)),
      faction:     target.Faction || target.faction || '',
      legalStatus: target.LegalStatus || target.legalStatus || '',
      isHostile:   !!(target.Hostile || target.hostile),
      distance:    target.Distance ?? target.distance ?? 0,
      combatRank:  target.PilotRank || target.PilotCombatRank || '',
      bounty:      target.Bounty || target.bounty || 0,
    } : null;

    // === Docked station info ===
    const docked = this.simpit.docked ? {
      stationName:   this.simpit.docked.StationName || this.simpit.docked.Name || '',
      stationType:   this.simpit.docked.StationType || '',
      faction:       this.simpit.docked.StationFaction?.Name || '',
      sector:        this.simpit.docked.StarSystem || '',
      services:      this.simpit.docked.StationServices || [],
    } : null;

    return {
      _meta: {
        timestamp:        new Date().toISOString(),
        externalConnected: this.externalConnected,
        simpitConnected:   this.simpitConnected,
      },
      player,
      ship,
      navigation,
      systems,
      combat: {
        underAttack:  nowUnderAttack,
        attackType:   nowUnderAttack ? this.underAttackType : null,
        target:       combatTarget,
      },
      docked,

      // From X4 External App
      missionOffers:    ext.missionOffers    || null,
      activeMission:    ext.activeMission    || null,
      logbook:          ext.logbook          || null,
      currentResearch:  ext.currentResearch  || null,
      factions:         ext.factions         || null,
      agents:           ext.agents           || null,
      inventory:        ext.inventory        || null,
      transactionLog:   ext.transactionLog   || null,

      // Comms: Simpit ReceiveText messages
      comms: this.commsHistory,

      // Raw loadout for extended ship info
      loadout: loadout || null,
    };
  }
}

module.exports = DataAggregator;
