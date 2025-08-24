module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src/'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  clearMocks: true,
  setupFiles: ['<rootDir>/testUtils/testSetup.ts'],
};
