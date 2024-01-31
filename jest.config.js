module.exports = {
  // The root of your source code.
  roots: ['<rootDir>/src'],

  // A list of file extensions your modules use.
  moduleFileExtensions: ['js', 'json', 'ts'],

  // Map TypeScript files to their JavaScript equivalents for test running.
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  // Test environment.
  testEnvironment: 'node',

  // Test match patterns.
  testRegex: '.*\\.spec\\.ts$',

  // Module name mapper for path aliases.
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Coverage configuration.
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts', // Exclude main.ts (entry point) from coverage.
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],

  // Add any other specific configurations you need.
  // ...

  // If you are using a monorepo setup, you might need to configure projects.
  // projects: [
  //   '<rootDir>/packages/*',
  // ],
};
