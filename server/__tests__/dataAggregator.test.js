const DataAggregator = require('../dataAggregator');

describe('DataAggregator', () => {
  let aggregator;

  beforeEach(() => {
    aggregator = new DataAggregator();
  });

  describe('constructor', () => {
    it('should initialize with empty external data', () => {
      expect(aggregator.external).toEqual({});
      expect(aggregator.externalConnected).toBe(false);
    });
  });

  describe('updateExternal', () => {
    it('should set externalConnected to true when _connected is not false', () => {
      aggregator.updateExternal({ playerProfile: { name: 'Test' } });
      expect(aggregator.externalConnected).toBe(true);
    });

    it('should set externalConnected to false when _connected is false', () => {
      aggregator.updateExternal({ _connected: false, playerProfile: { name: 'Test' } });
      expect(aggregator.externalConnected).toBe(false);
    });

    it('should not update data when disconnected', () => {
      aggregator.updateExternal({ _connected: false, playerProfile: { name: 'Test' } });
      expect(aggregator.external.playerProfile).toBeUndefined();
    });

    it('should merge partial updates without wiping existing data', () => {
      aggregator.updateExternal({
        playerProfile: { name: 'Player1', credits: 1000 },
        shipStatus: { name: 'Ship1', hull: 100 }
      });

      aggregator.updateExternal({
        shipStatus: { name: 'Ship1', hull: 90 }
      });

      expect(aggregator.external.playerProfile).toEqual({ name: 'Player1', credits: 1000 });
      expect(aggregator.external.shipStatus.name).toBe('Ship1');
    });

    it('should normalize agents array', () => {
      const agents = [
        {
          agent: { name: 'Agent1', rank: 'Novice' },
          currentMission: null
        }
      ];
      aggregator.updateExternal({ agents });
      expect(Array.isArray(aggregator.external.agents)).toBe(true);
      expect(aggregator.external.agents[0].agent.name).toBe('Agent1');
    });

    it('should merge ship status with combat normalization', () => {
      aggregator.updateExternal({
        shipStatus: {
          name: 'TestShip',
          hull: 80,
          alertLevel: 2,
          attackerCount: 3,
          incomingMissiles: 1
        }
      });

      expect(aggregator.external.shipStatus.name).toBe('TestShip');
      expect(aggregator.external.shipStatus.alertLevel).toBe(2);
      expect(aggregator.external.shipStatus.attackerCount).toBe(3);
    });
  });

  describe('getState', () => {
    it('should return basic state structure', () => {
      const state = aggregator.getState();
      expect(state).toHaveProperty('_meta');
      expect(state).toHaveProperty('player');
      expect(state).toHaveProperty('ship');
      expect(state).toHaveProperty('flight');
      expect(state).toHaveProperty('combat');
      expect(state).toHaveProperty('control');
    });

    it('should include timestamp in meta', () => {
      const state = aggregator.getState();
      expect(state._meta).toHaveProperty('timestamp');
      expect(new Date(state._meta.timestamp)).toBeInstanceOf(Date);
    });

    describe('player data', () => {
      it('should return default player when no profile data', () => {
        const state = aggregator.getState();
        expect(state.player).toEqual({
          name: 'UNKNOWN',
          faction: '',
          credits: 0,
          sector: '',
          sectorOwner: ''
        });
      });

      it('should return player data from profile', () => {
        aggregator.updateExternal({
          playerProfile: {
            name: 'TestPlayer',
            factionname: 'Argon',
            credits: 50000,
            sectorname: 'Argon Prime',
            sectorowner: 'Argon Federation'
          }
        });

        const state = aggregator.getState();
        expect(state.player).toEqual({
          name: 'TestPlayer',
          faction: 'Argon',
          credits: 50000,
          sector: 'Argon Prime',
          sectorOwner: 'Argon Federation'
        });
      });
    });

    describe('ship status', () => {
      it('should return empty ship when not controlled', () => {
        const state = aggregator.getState();
        expect(state.ship).toEqual({
          name: '',
          type: '',
          hull: 0,
          shields: 0,
          isDockedOrLanded: false
        });
      });

      it('should clamp hull and shields between 0-100', () => {
        aggregator.updateExternal({
          shipStatus: {
            controlled: true,
            hull: 150,
            shields: -20
          }
        });

        const state = aggregator.getState();
        expect(state.ship.hull).toBe(100);
        expect(state.ship.shields).toBe(0);
      });

      it('should return ship data when controlled', () => {
        aggregator.updateExternal({
          shipStatus: {
            controlled: true,
            name: 'Behemoth',
            shipSize: 'L',
            hull: 85,
            shields: 90,
            docked: false
          }
        });

        const state = aggregator.getState();
        expect(state.ship).toEqual({
          name: 'Behemoth',
          type: 'L',
          hull: 85,
          shields: 90,
          isDockedOrLanded: false
        });
      });
    });

    describe('flight data', () => {
      it('should return zeroed flight data when not controlled', () => {
        const state = aggregator.getState();
        expect(state.flight).toEqual({
          speed: 0,
          maxSpeed: 0,
          maxBoostSpeed: 0,
          maxTravelSpeed: 0,
          boostEnergy: 0,
          boosting: false,
          travelDrive: false,
          flightAssist: false,
          seta: false,
          autopilot: false,
          scanMode: false,
          longRangeScan: false
        });
      });

      it('should return flight data when controlled', () => {
        aggregator.updateExternal({
          shipStatus: {
            controlled: true,
            speed: 250,
            maxSpeed: 300,
            maxBoostSpeed: 500,
            maxTravelSpeed: 4000,
            boostEnergy: 75,
            boosting: true,
            travelMode: false,
            flightAssist: true,
            seta: false,
            autopilot: true,
            scanMode: false,
            longRangeScan: false
          }
        });

        const state = aggregator.getState();
        expect(state.flight.speed).toBe(250);
        expect(state.flight.maxSpeed).toBe(300);
        expect(state.flight.boosting).toBe(true);
        expect(state.flight.autopilot).toBe(true);
        expect(state.flight.flightAssist).toBe(true);
      });
    });

    describe('combat data', () => {
      it('should return default combat data when not controlled', () => {
        const state = aggregator.getState();
        expect(state.combat).toEqual({
          target: null,
          alertLevel: 0,
          attackerCount: 0,
          incomingMissiles: 0,
          missileIncoming: false,
          missileLockingOn: false
        });
      });

      it('should normalize combat data when controlled', () => {
        aggregator.updateExternal({
          shipStatus: {
            controlled: true,
            alertLevel: 2,
            attackerCount: 5,
            incomingMissiles: 2,
            missileIncoming: true,
            missileLockingOn: true
          }
        });

        const state = aggregator.getState();
        expect(state.combat.alertLevel).toBe(2);
        expect(state.combat.attackerCount).toBe(5);
        expect(state.combat.incomingMissiles).toBe(2);
        expect(state.combat.missileIncoming).toBe(true);
        expect(state.combat.missileLockingOn).toBe(true);
      });

      it('should include target info when available', () => {
        aggregator.updateExternal({
          shipStatus: {
            controlled: true
          },
          targetInfo: {
            hasTarget: true,
            name: 'Enemy Ship',
            shipName: 'Dragon',
            hull: 60,
            shields: 80,
            faction: 'Xenon',
            legalStatus: 'Hostile',
            isHostile: true,
            distance: 2500,
            combatRank: 'Master',
            bounty: 10000
          }
        });

        const state = aggregator.getState();
        expect(state.combat.target).toEqual({
          name: 'Enemy Ship',
          shipName: 'Dragon',
          hull: 60,
          shields: 80,
          faction: 'Xenon',
          legalStatus: 'Hostile',
          isHostile: true,
          distance: 2500,
          combatRank: 'Master',
          bounty: 10000
        });
      });
    });

    describe('logbook normalization', () => {
      it('should normalize array logbook to object with list', () => {
        aggregator.updateExternal({
          logbook: ['Entry 1', 'Entry 2', 'Entry 3']
        });

        const state = aggregator.getState();
        expect(state.logbook).toEqual({
          list: ['Entry 1', 'Entry 2', 'Entry 3']
        });
      });

      it('should pass through object logbook unchanged', () => {
        const logbook = { list: ['Entry 1'], other: 'data' };
        aggregator.updateExternal({ logbook });

        const state = aggregator.getState();
        expect(state.logbook).toEqual(logbook);
      });

      it('should return null for falsy logbook', () => {
        const state = aggregator.getState();
        expect(state.logbook).toBeNull();
      });
    });

    describe('active mission normalization', () => {
      it('should normalize array activeMission to first element', () => {
        aggregator.updateExternal({
          activeMission: [{ name: 'Mission 1' }, { name: 'Mission 2' }]
        });

        const state = aggregator.getState();
        expect(state.activeMission).toEqual({ name: 'Mission 1' });
      });

      it('should pass through object activeMission', () => {
        aggregator.updateExternal({
          activeMission: { name: 'Single Mission' }
        });

        const state = aggregator.getState();
        expect(state.activeMission).toEqual({ name: 'Single Mission' });
      });

      it('should return null for empty mission name', () => {
        aggregator.updateExternal({
          activeMission: { name: '' }
        });

        const state = aggregator.getState();
        expect(state.activeMission).toBeNull();
      });

      it('should return null for falsy activeMission', () => {
        const state = aggregator.getState();
        expect(state.activeMission).toBeNull();
      });
    });

    describe('mission offers normalization', () => {
      it('should wrap flat mission arrays in group structure', () => {
        aggregator.updateExternal({
          missionOffers: {
            plot: [{ id: 1, name: 'Plot Mission' }],
            guild: [{ id: 'guild1', name: 'Guild', missions: [{ id: 2, name: 'Guild Mission' }] }],
            coalition: [{ id: 3, name: 'Coalition Mission' }],
            other: [{ id: 4, name: 'Other Mission' }]
          }
        });

        const state = aggregator.getState();
        expect(state.missionOffers.plot).toEqual([
          { id: '0', name: null, missions: [{ id: 1, name: 'Plot Mission' }] }
        ]);
        expect(state.missionOffers.guild).toEqual([
          { id: 'guild1', name: 'Guild', missions: [{ id: 2, name: 'Guild Mission' }] }
        ]);
        expect(state.missionOffers.coalition).toEqual([
          { id: '0', name: null, missions: [{ id: 3, name: 'Coalition Mission' }] }
        ]);
        expect(state.missionOffers.other).toEqual([
          { id: '0', name: null, missions: [{ id: 4, name: 'Other Mission' }] }
        ]);
      });

      it('should return null for falsy missionOffers', () => {
        const state = aggregator.getState();
        expect(state.missionOffers).toBeNull();
      });
    });

    describe('factions normalization', () => {
      it('should normalize array of factions', () => {
        aggregator.updateExternal({
          factions: [
            { id: 'argon', name: 'Argon Federation', relationValue: 20 },
            { id: 'paranid', name: 'Paranid Empire', relationValue: -10 }
          ]
        });

        const state = aggregator.getState();
        expect(state.factions).toHaveLength(2);
        expect(state.factions[0]).toMatchObject({
          id: 'argon',
          name: 'Argon Federation',
          relationValue: 20,
          relationLabel: 'Ally'
        });
        expect(state.factions[1]).toMatchObject({
          id: 'paranid',
          name: 'Paranid Empire',
          relationValue: -10,
          relationLabel: 'Enemy'
        });
      });

      it('should normalize object of factions', () => {
        aggregator.updateExternal({
          factions: {
            argon: { name: 'Argon Federation', relationValue: 5 },
            paranid: { name: 'Paranid Empire', relationValue: -15 }
          }
        });

        const state = aggregator.getState();
        expect(state.factions).toHaveLength(2);
        expect(state.factions[0].name).toBe('Argon Federation');
        expect(state.factions[1].name).toBe('Paranid Empire');
      });

      it('should sort factions by name', () => {
        aggregator.updateExternal({
          factions: [
            { id: 'z', name: 'Z-Faction' },
            { id: 'a', name: 'A-Faction' },
            { id: 'm', name: 'M-Faction' }
          ]
        });

        const state = aggregator.getState();
        expect(state.factions[0].name).toBe('A-Faction');
        expect(state.factions[1].name).toBe('M-Faction');
        expect(state.factions[2].name).toBe('Z-Faction');
      });

      it('should derive relation labels from values', () => {
        const testCases = [
          { value: 25, expected: 'Ally' },
          { value: 15, expected: 'Friend' },
          { value: 5, expected: 'Neutral' },
          { value: -5, expected: 'Neutral' },
          { value: -15, expected: 'Enemy' },
          { value: -25, expected: 'Hostile' }
        ];

        for (const tc of testCases) {
          aggregator.updateExternal({
            factions: [{ id: 'test', name: 'Test', relationValue: tc.value }]
          });
          const state = aggregator.getState();
          expect(state.factions[0].relationLabel).toBe(tc.expected);
        }
      });

      it('should return null for empty factions', () => {
        aggregator.updateExternal({ factions: [] });
        const state = aggregator.getState();
        expect(state.factions).toBeNull();
      });
    });

    describe('inventory normalization', () => {
      it('should normalize array inventory', () => {
        aggregator.updateExternal({
          inventory: [
            { id: 'item1', name: 'Weapon', amount: 5, category: 'Weapons' },
            { id: 'item2', name: 'Shield', amount: 3, category: 'Shields' }
          ]
        });

        const state = aggregator.getState();
        expect(state.inventory.list).toHaveLength(2);
        // Items sorted by category (Shields before Weapons alphabetically)
        expect(state.inventory.list[0]).toMatchObject({
          id: 'item2',
          name: 'Shield',
          amount: 3,
          category: { id: 'shields', name: 'Shields' }
        });
        expect(state.inventory.list[1]).toMatchObject({
          id: 'item1',
          name: 'Weapon',
          amount: 5,
          category: { id: 'weapons', name: 'Weapons' }
        });
      });

      it('should sort inventory by category then name', () => {
        aggregator.updateExternal({
          inventory: [
            { name: 'Z-Item', category: 'A' },
            { name: 'A-Item', category: 'B' },
            { name: 'B-Item', category: 'A' }
          ]
        });

        const state = aggregator.getState();
        // Category A items first (B-Item, Z-Item), then category B (A-Item)
        expect(state.inventory.list[0].name).toBe('B-Item');
        expect(state.inventory.list[1].name).toBe('Z-Item');
        expect(state.inventory.list[2].name).toBe('A-Item');
      });

      it('should handle inventory object format', () => {
        aggregator.updateExternal({
          inventory: {
            list: [
              { id: 'item1', name: 'Item 1', amount: 1 }
            ]
          }
        });

        const state = aggregator.getState();
        expect(state.inventory.list).toHaveLength(1);
      });
    });

    describe('transaction log normalization', () => {
      it('should normalize transaction entries', () => {
        aggregator.updateExternal({
          transactionLog: [
            {
              id: 'tx1',
              eventType: 'purchase',
              partnerName: 'Station A',
              itemName: 'Weapon',
              amount: 1,
              value: 50000,
              time: 1000
            }
          ]
        });

        const state = aggregator.getState();
        expect(state.transactionLog.list).toHaveLength(1);
        expect(state.transactionLog.list[0]).toMatchObject({
          id: 'tx1',
          eventType: 'purchase',
          eventLabel: 'Purchase',
          partnerName: 'Station A',
          itemName: 'Weapon',
          amount: 1,
          value: 50000
        });
      });

      it('should sort transactions by time descending', () => {
        aggregator.updateExternal({
          transactionLog: [
            { id: 'tx1', time: 100 },
            { id: 'tx2', time: 300 },
            { id: 'tx3', time: 200 }
          ]
        });

        const state = aggregator.getState();
        expect(state.transactionLog.list[0].id).toBe('tx2');
        expect(state.transactionLog.list[1].id).toBe('tx3');
        expect(state.transactionLog.list[2].id).toBe('tx1');
      });

      it('should handle transaction log object format', () => {
        aggregator.updateExternal({
          transactionLog: {
            list: [{ id: 'tx1', eventType: 'sale' }]
          }
        });

        const state = aggregator.getState();
        expect(state.transactionLog.list).toHaveLength(1);
      });
    });

    describe('agents normalization', () => {
      it('should normalize agents with missions', () => {
        aggregator.updateExternal({
          agents: [
            {
              agent: {
                name: 'Agent 1',
                rank: 'Expert',
                originFactionName: 'Argon'
              },
              currentMission: {
                name: 'Trade Mission',
                type: 'trade'
              }
            },
            {
              agent: {
                name: 'Agent 2',
                rank: 'Novice',
                originFactionName: 'Paranid'
              },
              currentMission: null
            }
          ]
        });

        const state = aggregator.getState();
        expect(state.agents).toHaveLength(2);
        expect(state.agents[0].agent.name).toBe('Agent 1');
        expect(state.agents[0].currentMission.name).toBe('Trade Mission');
        expect(state.agents[1].currentMission).toBeNull();
      });

      it('should sort agents by mission activity then name', () => {
        aggregator.updateExternal({
          agents: [
            { agent: { name: 'Z-Agent' }, currentMission: null },
            { agent: { name: 'A-Agent' }, currentMission: { name: 'Active' } },
            { agent: { name: 'B-Agent' }, currentMission: null }
          ]
        });

        const state = aggregator.getState();
        expect(state.agents[0].agent.name).toBe('A-Agent');
        expect(state.agents[1].agent.name).toBe('B-Agent');
        expect(state.agents[2].agent.name).toBe('Z-Agent');
      });
    });

    describe('current research', () => {
      it('should include current research', () => {
        aggregator.updateExternal({
          currentResearch: {
            name: 'Advanced Weapons',
            progress: 50
          }
        });

        const state = aggregator.getState();
        expect(state.currentResearch).toEqual({
          name: 'Advanced Weapons',
          progress: 50
        });
      });

      it('should return null when no current research', () => {
        const state = aggregator.getState();
        expect(state.currentResearch).toBeNull();
      });
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle empty external data', () => {
      aggregator.updateExternal({});
      const state = aggregator.getState();
      expect(state.player.name).toBe('UNKNOWN');
      expect(state.combat.alertLevel).toBe(0);
    });

    it('should handle null values in ship status', () => {
      aggregator.updateExternal({
        shipStatus: {
          controlled: true,
          hull: null,
          shields: null,
          speed: null
        }
      });

      const state = aggregator.getState();
      expect(state.ship.hull).toBe(100);
      expect(state.ship.shields).toBe(100);
      expect(state.flight.speed).toBe(0);
    });

    it('should handle undefined values in ship status', () => {
      aggregator.updateExternal({
        shipStatus: {
          controlled: true
        }
      });

      const state = aggregator.getState();
      expect(state.ship.hull).toBe(100);
      expect(state.ship.shields).toBe(100);
    });

    it('should handle various boolean representations', () => {
      const boolCases = [
        { input: true, expected: true },
        { input: false, expected: false },
        { input: 1, expected: true },
        { input: 0, expected: false },
        { input: '1', expected: true },
        { input: '0', expected: false }
      ];

      for (const tc of boolCases) {
        aggregator = new DataAggregator();
        aggregator.updateExternal({
          shipStatus: {
            controlled: tc.input,
            occupied: tc.input,
            docked: tc.input,
            boosting: tc.input
          }
        });

        const state = aggregator.getState();
        expect(state.control).toMatchObject({
          occupied: tc.expected,
          controlled: tc.expected
        });
      }
    });
  });
});
