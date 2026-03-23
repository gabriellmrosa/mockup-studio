import nextJest from "next/jest.js";
import type { Config } from "jest";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  moduleNameMapper: {
    "^.+\\.(css|sass|scss)$": "<rootDir>/test/styleMock.js",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
};

export default createJestConfig(config);
