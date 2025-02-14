// jest.config.js
export default {
    testEnvironment: "node", // Use 'node' for backend tests or 'jsdom' for DOM tests
    transform: {
        "^.+\\.tsx?$": "ts-jest" // Transforms TypeScript files with ts-jest
    },
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1" // Optional: Alias for import paths, if used
    },
    roots: ["<rootDir>/test"], // Specifies the test folder
    testMatch: [
        "**/__tests__/**/*.test.[jt]s?(x)",
        "**/?(*.)+(spec|test).[tj]s?(x)"
    ],
    moduleFileExtensions: ["js", "ts", "json", "node"],
    verbose: true // Provides detailed test outputs
};
