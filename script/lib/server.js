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
  verbose: argv.v || argv.verbose || false
};

var server = connect()
  .use(serveStatic(options.root))
  .use(function serveIndex(req, res, next) {
    if (req.method !== 'GET' || !req.headers.accept.match('text/html')) {
      return next();
    }
    if (url.parse(req.url).pathname.match(/^\/admin/)) {
      send(req, '/admin/index.html', { root: options.root })
        .pipe(res);
    } else {
      send(req, '/index.html', { root: options.root })
        .pipe(res);
    }
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
