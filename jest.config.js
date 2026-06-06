module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    verbose: true,
    roots: ["<rootDir>/src", "<rootDir>/_tests_"],
    collectCoverage: false,
    coverageDirectory: "coverage",
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts'
    ],
    moduleFileExtensions: ["ts", "js", "json"],
    testMatch: ["**/*.test.ts", "**/*.spec.ts"],
    transform: {
        "^.+\\.ts$": "ts-jest"
    },
    
}