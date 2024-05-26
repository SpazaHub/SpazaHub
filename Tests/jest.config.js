/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {

  testEnvironment: 'node',


  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,


  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",


  testMatch: ["**/*.test.js"],


    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    // other configurations...
  
    moduleNameMapper: {
      '^https://www.gstatic.com/firebasejs/(.*)$': '<rootDir>/firebaseMock.js',
    },
};

module.exports = config;
