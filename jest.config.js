module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/stacks/test"],
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
