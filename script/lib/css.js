#!/usr/bin/env node

var path = require('path');

var rework = require('rework');
var reworkImport = require('rework-import');
var reworkVars = require('rework-vars');
var argv = require('minimist')(process.argv.slice(2));
var read = require('read-file-stdin');
var write = require('write-file-stdout');
var autoprefixer = require('autoprefixer-core')();

var options = {
  input: path.resolve(argv._[0]),
  output: path.resolve(argv._[1])
};

read(options.input, function(err, buffer) {
  if (err) {
    console.error(err);
    console.error(err.stack);
  }
  var css = buffer.toString();

  css = rework(css, { source: options.input })
    .use(reworkImport())
    .use(reworkVars())
    .toString();

  css = autoprefixer.process(css);

  write(options.output, css);
});
