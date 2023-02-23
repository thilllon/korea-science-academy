import { Config } from 'jest';

const config: Config = {
  // preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  collectCoverage: true,
  // testRegex: '.*\\.(test|spec))\\.(j|t)sx?$',
  // testMatch: ['./src/**/*.test.ts'],
  // testPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
};

export default config;
