#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

var argv = require('minimist')(process.argv.slice(2));
var flo = require('fb-flo');
var _ = require('lodash');

var precompile = require('./precompile');

var options = {
  verbose: argv.v || argv.verbose || false,
  root: argv.r || argv.root || _.flatten([argv._])[0],
  glob: _.flatten([argv.g || argv.glob || ['**/*']]),
  host: argv.h || argv.host || 'localhost',
  port: argv.p || argv.port || 8888
};

function isIgnorePath(filepath) {
  return filepath === 'main.css' || path.dirname(filepath).match(/^(admin-compiled|app-compiled)(\/|$)/);
}

function rootPath(filepath) {
  return path.join(options.root, filepath);
}

function handleCompile(filepath, callback) {
  var ext = path.extname(filepath);
  var inUncompiled = path.dirname(filepath).match(/^(admin|app)(\/|$)/);
  var compiledFile;

  if (ext === '.css') {
    exec('./script/css', function (err) {
      if (err) {
        return callback(err);
      }
      callback(null, 'main.css', false);
    });
  } else if (ext === '.js' && inUncompiled) {
    compiledFile = filepath.replace(/^(admin|app)/g, '$1-compiled');
    precompile.precompile(filepath, compiledFile, options.root)
      .then(function() {
        callback(null, compiledFile, true);
      }).catch(function(err) {
        callback(err, compiledFile, true);
      });
  } else if (inUncompiled) {
    // copy any non-js accross
    compiledFile = filepath.replace(/^(admin|app)/g, '$1-compiled');
    fs.writeFileSync(rootPath(compiledFile), fs.readFileSync(rootPath(filepath)));
    callback(null, compiledFile, true);
  } else {
    callback(null, filepath, true);
  }
}

var server = flo(options.root, {
  port: options.port,
  host: options.host,
  verbose: options.verbose,
  glob: options.glob,
  useWatchman: true,
}, function resolver(filepath, callback) {
  // Minimal debugging
  if (!options.verbose) {
    console.log('File changed: %s', filepath);
  }

  if (isIgnorePath(filepath)) {
    return;
  }

  handleCompile(filepath, function(err, compiledFile, reload) {
    if (err) {
      console.error('Failed to load %s', filepath);
      console.error(err);
      return;
    }
    callback({
      resourceURL: compiledFile,
      contents: fs.readFileSync(rootPath(compiledFile)).toString(),
      reload: reload
    });
  });
});

server.once('ready', function() {
  console.log(options);
  console.log('Watching files!');
});
