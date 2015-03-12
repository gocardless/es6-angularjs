'use strict';

// # Precompile
// Builds ES6 into System.register
//
// Use:
// precompile(inFile, outFile);

var traceur = require('traceur');
var path = require('path');
var fs = require('graceful-fs');
var RSVP = require('rsvp');
var denodeify = RSVP.denodeify;
var mkdirp = require('mkdirp');

var traceurConfig;
function loadConfig() {
  traceurConfig = require('../../config/traceur.config.js');
  traceurConfig.modules = 'instantiate';
  traceurConfig.script = false;
  traceurConfig.sourceMaps = 'memory';
}

function precompile(inFile, outFile, basePath) {
  if (!traceurConfig) {
    loadConfig();
  }

  traceurConfig.moduleName = null;

  var compiler = new traceur.Compiler(traceurConfig);

  var sourceMapPath = path.resolve(basePath, outFile.replace(/\.js$/, '.map'));
  var inPath = path.resolve(basePath, inFile);
  var outPath = path.resolve(basePath, outFile);

  return denodeify(fs.readFile)(inPath)
    .then(function(inSource) {
      return compiler.compile(inSource.toString(), '/' + inFile, path.basename(outFile));
    })
    .then(function(source) {
      return denodeify(mkdirp)(path.dirname(outPath))
        .then(function() {
          return RSVP.Promise.all([
            denodeify(fs.writeFile)(outPath, source),
            denodeify(fs.writeFile)(sourceMapPath, compiler.getSourceMap())
          ]);
        });
    });
}

exports.precompile = precompile;
