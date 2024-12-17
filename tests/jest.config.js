/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "puppeteer-core/internal/puppeteer-core.js": "<rootDir>/../tests/node_modules/puppeteer-core/lib/cjs/puppeteer/puppeteer-core.js",
    "puppeteer-core/internal/node/PuppeteerNode.js": "<rootDir>/../tests/node_modules/puppeteer-core/lib/cjs/puppeteer/node/PuppeteerNode.js"
  },
};
