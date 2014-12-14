#!/usr/bin/env node

'use strict';

var http = require('http');
var url = require('url');

var connect = require('connect');
var serveStatic = require('serve-static');
var morgan  = require('morgan');
var argv = require('minimist')(process.argv.slice(2));
var send = require('send');
var _ = require('lodash');

var options = {
  port: argv.p || argv.port,
  root: argv.r || argv.root || _.flatten([argv._])[0],
  open: argv.open || false,
  verbose: argv.v || argv.verbose || false,
  index: argv.index || 'index.html',
};

var server = connect()
  .use(function serveOverrideIndex(req, res, next) {
    if (options.index !== 'index.html' &&
        url.parse(req.url).pathname.match(/^(\/|\/index.html)$/)) {
      send(req, '/' + options.index, { root: options.root })
        .pipe(res);
    } else {
      next();
    }
  })
  .use(serveStatic(options.root))
  .use(function serveIndex(req, res, next) {
    if (req.method !== 'GET' || !req.headers.accept.match('text/html')) {
      return next();
    }
    send(req, '/' + options.index, { root: options.root })
      .pipe(res);
  });

if (options.verbose) {
  server.use(morgan('tiny'));
}

http.createServer(server)
  .listen(options.port)
  .once('error', function (err) {
    if (err.code === 'EADDRINUSE') {
      console.log('Port in use: %s', options.port);
    } else {
      console.error(err);
    }
  })
  .on('listening', function () {
    console.log('Started web server on http://localhost:' + options.port);
    if (options.open) {
      require('opn')('http://localhost:' + options.port);
    }
  });
