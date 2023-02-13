const nextJest = require("next/jest");
const createJestConfig = nextJest({
  dir: "./src",
});

const customJestConfig = {
  moduleDirectories: ["node_modules", "src"],
  testEnvironment: "jest-environment-jsdom",
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};

module.exports = createJestConfig(customJestConfig);