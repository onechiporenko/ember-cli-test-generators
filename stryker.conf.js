module.exports = function (config) {
  config.set({
    testRunner: 'mocha',
    reporter: ['clear-text', 'html', 'dashboard'],
    packageManager: 'npm',
    testFramework: 'mocha',
    coverageAnalysis: 'all',
    mutate: ['blueprints/**/index.js'],
    mutator: 'javascript',
    logLevel: 'trace',
    thresholds: {
      high: 90,
      low: 70,
      break: null
    },
    mochaOptions: {
      files: ['node-tests/{blueprints,acceptance,unit}/**/*-test.js'],
      timeout: 5000,
      reporter: 'spec'
    }
  });
};
