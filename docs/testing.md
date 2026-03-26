# Testing Strategy

This document outlines the testing approach for x4-dashboard.

## Overview

The project uses Jest for automated testing, with a focus on server-side logic where the highest-value validation can be achieved with minimal complexity.

## Test Framework: Jest

- **Server**: Jest with Node.js test environment (CommonJS compatible)
- **Client**: Jest can be added later for React component testing
- **Configuration**: `server/jest.config.js`

## Running Tests

### Run all tests once

```bash
npm test
```

### Run tests in watch mode (during development)

```bash
npm run test:watch
```

### Run tests with coverage report

```bash
npm run test:coverage
```

### Run server tests only

```bash
npm --prefix server test
```

## Test Structure

Tests are organized alongside the code they validate:

```
server/
  __tests__/
    normalizeData.test.js    # Tests for X4 text normalization
    dataAggregator.test.js   # Tests for game state aggregation
```

## Coverage Areas

### Server Tests (Implemented)

#### `normalizeData.js`

Tests for the X4 data normalization utility:

- String normalization (color codes, faction tags, line breaks)
- Array normalization (recursive processing)
- Object normalization (deep processing)
- Primitive value handling (numbers, booleans, null)
- Complex nested structures

#### `dataAggregator.js`

Tests for the core data aggregation logic:

- DataAggregator class initialization
- External data updates and merging
- State generation with defaults
- Player data extraction
- Ship status normalization (with clamping)
- Flight data handling
- Combat data normalization (alert levels, missiles)
- Logbook normalization (array to object conversion)
- Mission offers normalization (group wrapping)
- Active mission normalization
- Factions normalization and sorting
- Inventory normalization and sorting
- Transaction log normalization and sorting
- Agents normalization and sorting
- Boolean value parsing (various formats)
- Edge cases and error handling

### Client Tests (Future)

Potential areas for future client-side testing:

- React component rendering
- Custom hooks (e.g., `useGameData`)
- Dashboard layout logic
- Widget registry functionality
- Utility functions

## Writing New Tests

### Server Test Guidelines

1. Place tests in `server/__tests__/` directory
2. Name test files with `.test.js` suffix
3. Use descriptive `describe` and `it` blocks
4. Group related tests logically
5. Test both happy paths and edge cases
6. Use `beforeEach` for test isolation

### Example Test Pattern

```javascript
const ModuleUnderTest = require('./moduleUnderTest');

describe('ModuleUnderTest', () => {
  let instance;

  beforeEach(() => {
    instance = new ModuleUnderTest();
  });

  describe('methodName', () => {
    it('should handle normal case', () => {
      const result = instance.methodName('input');
      expect(result).toBe('expected');
    });

    it('should handle edge case', () => {
      const result = instance.methodName(null);
      expect(result).toBeNull();
    });
  });
});
```

## CI Integration

Tests are automatically run in GitHub Actions on:

- Every push to master
- Every pull request

The CI workflow runs `npm test` after type checking and before building.

## Coverage Goals

- **Server logic**: High coverage (>80%) for data transformation functions
- **Edge cases**: All normalization functions should have edge case coverage
- **Integration points**: WebSocket and HTTP endpoint testing (future)

## When to Add Tests

### Always add tests for:

- New data normalization functions
- New aggregation logic
- Bug fixes (regression tests)
- Complex business logic

### Consider adding tests for:

- Pure utility functions
- State transformation logic
- Configuration parsing

### Can skip tests for:

- Simple pass-through functions
- Third-party library wrappers
- UI-only changes (unless complex interaction logic)

## Mocking

For server tests, prefer:

1. **Direct testing** of pure functions with known inputs
2. **Test doubles** for external dependencies when necessary
3. **Integration tests** for HTTP/WebSocket endpoints (future)

## Future Enhancements

Potential improvements to the test suite:

1. Client-side React component testing with React Testing Library
2. Integration tests for HTTP endpoints
3. WebSocket event testing
4. End-to-end testing with Playwright or Cypress
5. Performance benchmarks for data aggregation
6. Property-based testing for normalization functions
