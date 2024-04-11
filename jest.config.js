/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true, // Report each individual test during test run
  forceExit: true,
  setupFilesAfterEnv: ["./tests/setups/jest.setup.ts"],
};
