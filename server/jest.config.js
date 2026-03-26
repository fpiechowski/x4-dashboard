module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    '*.js',
    'utils/**/*.js',
    '!jest.config.js',
    '!index.js',
    '!mockData.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html']
};
