/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true, // Report each individual test during test run
  forceExit: true,
  setupFiles: ["./__tests__/setup.test.js"],
};
