module.exports = {
  cacheDirectory: "D:/jest-cache", // Change to a directory on drive D
  testEnvironment: "jsdom", // Ensures Jest uses jsdom for testing
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transform: {
      '^.+\\.[t|j]sx?$': 'babel-jest', // Transpile JSX and JS files with babel-jest
    },
    moduleNameMapper: {
      // Mock CSS imports
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      // Resolve your alias
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    transformIgnorePatterns: [
      "/node_modules/(?!axios)/", // Allow transformation of axios in node_modules
    ],
  };
  