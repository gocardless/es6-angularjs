'use strict';

var packageJson = require('../package.json');

var traceurOptions = require('./traceur.config');

traceurOptions.sourceMaps = true;
traceurOptions.modules = 'instantiate';
traceurOptions.moduleName = null;

module.exports = function(config) {
  config.set({
    basePath: './client',
    frameworks: ['jasmine', 'traceur'],
    browsers: ['Chrome'],
    reporters: ['progress'],
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 2,
    browserNoActivityTimeout: 30000,
    sauceLabs: {
      username: 'gocardless',
      accessKey: process.env.GC_SAUCE_LABS_KEY,
      startConnect: true,
      testName: packageJson.name,
      options: {
        'selenium-version': '2.43.0'
      }
    },
    files: [
      'components/es6-module-loader/dist/es6-module-loader.src.js',
      'components/system.js/dist/system.src.js',
      'loader.config.js',

      { pattern: '**/*.js', included: false },
      { pattern: '**/*.html', included: false },
      { pattern: '**/*.json', included: false },

      '../config/traceur-runtime-patch.js',
      '../config/file-name-to-module-name.js',
      '../config/karma-spec-loader.config.js',
    ],
    exclude: [
      '*-compiled/**',
      'assets/**',
    ],
    preprocessors: {
      'app/**/*.js': ['traceur'],
    },
    traceurPreprocessor: {
      options: traceurOptions
    },
  });
};
