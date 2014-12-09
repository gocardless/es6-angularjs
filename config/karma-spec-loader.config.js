'use strict';

// make it async
window.__karma__.loaded = function noop() {};

// Karma serves files here
System.baseURL = '/base/';
System.map.app = 'app';

// use "app" not "app-compiled"
delete System.map.app;

var TEST_REGEXP = /[\._]spec\.js$/;
var IGNORE_PATH_REGEXP = /^components\/|app-compiled\//;

Promise.all(
  Object.keys(window.__karma__.files) // All files served by Karma.
  .filter(function onlySpecFiles(path) {
    return TEST_REGEXP.test(path);
  })
  .map(window.fileNameToModuleName) // Normalize paths to module names.
  .filter(function excludeComponentSpecFiles(path) {
    return !IGNORE_PATH_REGEXP.test(path);
  })
  .map(function(path) {
    return System.import(path);
  })
).then(function() {
  window.__karma__.start();
}, function(error) {
  console.error(error.stack || error);
  window.__karma__.start();
});
