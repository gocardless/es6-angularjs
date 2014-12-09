'use strict';

var options = {
  port: process.env.HTTP_PORT || '8000'
};

function disableNgAnimate() {
  angular.module('disableNgAnimate', []).run([
    '$animate',
    function($animate) {
      $animate.enabled(false);
    }
  ]);
}

exports.config = {
  onPrepare: function onPrepare() {
    browser.addMockModule('disableNgAnimate', disableNgAnimate);
  },
  directConnect: true,
  chromeOnly: true,
  chromeDriver: 'node_modules/protractor/selenium/chromedriver',
  allScriptsTimeout: 11000,
  exclude: [],
  suites: {
    full: 'client/app/**/*.e2e.js'
  },
  capabilities: {
    browserName: 'chrome',
    count: 1,
    shardTestFiles: false,
    maxInstances: 1,
    version: 'ANY',
    chromeOptions: {
    }
  },
  baseUrl: 'http://localhost:' + options.port,
  rootElement: '[data-main-app]',
  framework: 'jasmine',
  jasmineNodeOpts: {
    onComplete: null,
    realtimeFailure: true,
    showTiming: true,
    isVerbose: true,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 30000
  }
};
