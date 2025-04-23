/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Look for source files and tests within the src directory
  roots: ['<rootDir>/src'], 
  // Find files anywhere in roots that end in .test.(ts|tsx|js) or .spec.(ts|tsx|js)
  testMatch: [
    '**/?(*.)+(spec|test).+(ts|tsx|js)' 
  ],
  transform: {
    '^.+\.(ts|tsx)$': ['ts-jest', { 
      // ts-jest configuration options
      // Use isolatedModules for faster compilation in simple projects
      isolatedModules: true 
    }],
  },
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Optional: Collect coverage information
  // collectCoverage: true,
  // coverageDirectory: "coverage",
  // coverageProvider: "v8", // or 'babel'
};