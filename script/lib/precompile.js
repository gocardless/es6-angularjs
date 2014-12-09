'use strict';

// # Precompile
// Builds ES6 into System.register
//
// Use:
// precompile(inFile, outFile);

var traceur = require('traceur');
var path = require('path');
var fs = require('graceful-fs');

var traceurConfig;
function loadConfig() {
  traceurConfig = require('../../config/traceur.config.js');
  traceurConfig.modules = 'instantiate';
  traceurConfig.script = false;
  traceurConfig.sourceMaps = 'memory';
}

function precompile(inFile, outFile, basePath, callback) {
  if (!traceurConfig) {
    loadConfig();
  }

  traceurConfig.moduleName = null;

  var compiler = new traceur.Compiler(traceurConfig);

  var sourceMapFile = outFile.replace(/\.js$/, '.map');

  fs.readFile(path.resolve(basePath, inFile), function(err, inSource) {
    if (err)
      return callback(err);

    var source, sourceMap;

    try {
      source = compiler.compile(inSource.toString(), '/' + inFile, path.basename(outFile));
      sourceMap = compiler.getSourceMap();  
    }
    catch(e) {
      return callback(e);
    }

    fs.writeFile(path.resolve(basePath, outFile), source, function(err) {
      if (err)
        return callback(err);

      fs.writeFile(path.resolve(basePath, sourceMapFile), sourceMap, callback);
    });
  });
}

exports.precompile = precompile;
