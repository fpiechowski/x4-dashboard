const { normalizeData } = require('../utils/normalizeData');

describe('normalizeData', () => {
  describe('string normalization', () => {
    it('should return plain strings unchanged', () => {
      expect(normalizeData('Hello World')).toBe('Hello World');
    });

    it('should strip X4 color codes from strings', () => {
      const withColorCodes = '\uE000\uE001Hello\uE002 World\uE003';
      expect(normalizeData(withColorCodes)).toBe('Hello World');
    });

    it('should strip faction color tag prefixes from strings', () => {
      const withFactionColor = '#ff0000#Colored Text';
      expect(normalizeData(withFactionColor)).toBe('Colored Text');
    });

    it('should normalize line breaks to spaces', () => {
      expect(normalizeData('Line1\nLine2')).toBe('Line1 Line2');
      expect(normalizeData('Line1\r\nLine2')).toBe('Line1 Line2');
    });

    it('should trim whitespace from strings', () => {
      expect(normalizeData('  trimmed  ')).toBe('trimmed');
    });

    it('should handle strings with multiple formatting issues', () => {
      const complex = '  \uE000#ff1234#Hello\r\nWorld\uE001  ';
      expect(normalizeData(complex)).toBe('Hello World');
    });
  });

  describe('array normalization', () => {
    it('should normalize strings in arrays', () => {
      const input = ['\uE000Hello', '#ff0000#World'];
      expect(normalizeData(input)).toEqual(['Hello', 'World']);
    });

    it('should handle nested arrays', () => {
      const input = [['\uE000Nested'], ['#ff0000#Array']];
      expect(normalizeData(input)).toEqual([['Nested'], ['Array']]);
    });

    it('should handle empty arrays', () => {
      expect(normalizeData([])).toEqual([]);
    });

    it('should handle arrays with mixed types', () => {
      const input = ['string', 123, true, null];
      expect(normalizeData(input)).toEqual(['string', 123, true, null]);
    });
  });

  describe('object normalization', () => {
    it('should normalize strings in objects', () => {
      const input = { name: '\uE000Player', faction: '#ff0000#Terran' };
      expect(normalizeData(input)).toEqual({ name: 'Player', faction: 'Terran' });
    });

    it('should handle nested objects', () => {
      const input = {
        player: {
          name: '\uE000Test',
          ship: {
            name: '#ff0000#Ship'
          }
        }
      };
      expect(normalizeData(input)).toEqual({
        player: {
          name: 'Test',
          ship: {
            name: 'Ship'
          }
        }
      });
    });

    it('should handle empty objects', () => {
      expect(normalizeData({})).toEqual({});
    });

    it('should handle objects with mixed value types', () => {
      const input = {
        name: '\uE000Test',
        count: 42,
        active: true,
        data: null
      };
      expect(normalizeData(input)).toEqual({
        name: 'Test',
        count: 42,
        active: true,
        data: null
      });
    });
  });

  describe('primitive value handling', () => {
    it('should pass through numbers unchanged', () => {
      expect(normalizeData(42)).toBe(42);
      expect(normalizeData(3.14)).toBe(3.14);
      expect(normalizeData(0)).toBe(0);
      expect(normalizeData(-10)).toBe(-10);
    });

    it('should pass through booleans unchanged', () => {
      expect(normalizeData(true)).toBe(true);
      expect(normalizeData(false)).toBe(false);
    });

    it('should pass through null unchanged', () => {
      expect(normalizeData(null)).toBe(null);
    });

    it('should pass through undefined unchanged', () => {
      expect(normalizeData(undefined)).toBe(undefined);
    });
  });

  describe('complex nested structures', () => {
    it('should normalize deeply nested game data structures', () => {
      const input = {
        playerProfile: {
          name: '\uE000#ff0000#Player Name',
          factionname: '\uE001Terran',
          credits: 1000000,
          sectorname: 'Argon Prime'
        },
        shipStatus: {
          name: '\uE000#ffffff#Behemoth',
          hull: 85,
          shields: 100,
          weapons: [
            { name: '\uE000Plasma Cannon', damage: 500 },
            { name: '\uE001#ff0000#Beam Emitter', damage: 1000 }
          ]
        }
      };

      expect(normalizeData(input)).toEqual({
        playerProfile: {
          name: 'Player Name',
          factionname: 'Terran',
          credits: 1000000,
          sectorname: 'Argon Prime'
        },
        shipStatus: {
          name: 'Behemoth',
          hull: 85,
          shields: 100,
          weapons: [
            { name: 'Plasma Cannon', damage: 500 },
            { name: 'Beam Emitter', damage: 1000 }
          ]
        }
      });
    });
  });
});
