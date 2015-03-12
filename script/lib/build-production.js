#!/usr/bin/env node

var AssetGraph = require('assetgraph-builder');
var systemJsAssetGraph = require('systemjs-assetgraph');

var argv = require('minimist')(process.argv.slice(2));
var config = {
  root: argv.root,
  outRoot: argv.outroot,
  loadAssets: (argv._[0] ? argv._ : ['*.html', 'favicon.ico']),
  optimizeImages: false,
  inlineSize: 4096,
  sharedBundles: false,
  version: undefined,
  noCompress: false,
};

if (!config.root || !config.outRoot) {
  throw new Error('--root and --outroot need to set');
}

new AssetGraph({ root: config.root })
  .logEvents({
    repl: undefined,
    stopOnWarning: false,
    suppressJavaScriptCommonJsRequireWarnings: true
  })
  .registerRequireJsConfig({
    preventPopulationOfJavaScriptAssetsUntilConfigHasBeenFound: true
  })
  .loadAssets(config.loadAssets)
  .queue(systemJsAssetGraph({
    outRoot: config.outRoot,
    bundle: true,
    builderConfig: {
      sourceMaps: false,
      // lowResSourceMaps: true,
      minify: true,
      mangle: true,
      config: {
        map: {
          app: 'app',
        },
      },
    },
  }))
  .buildProduction({
    optimizeImages: config.optimizeImages,
    inlineSize: config.inlineSize,
    sharedBundles: config.sharedBundles,
    version: config.version,
    noCompress: config.noCompress,
  })
  .writeAssetsToDisc({ url: /^file:/, isLoaded: true }, config.outRoot)
  .writeStatsToStderr()
  .run();
