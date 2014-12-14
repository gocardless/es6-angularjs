'use strict';

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
    files: [
      'components/es6-module-loader/dist/es6-module-loader.src.js',
      'components/system.js/dist/system.src.js',
      'loader.config.js',

      // Serve but don't create script tags for any files being `import`ed
      { pattern: '**/*.js', included: false },
      { pattern: '**/*.html', included: false },
      { pattern: '**/*.json', included: false },

      '../config/traceur-runtime-patch.js',
      '../config/file-name-to-module-name.js',

      // Load and initialize all spec files using SystemJS
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
