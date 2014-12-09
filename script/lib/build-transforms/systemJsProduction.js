var AssetGraph = require('assetgraph-builder');
var uglifyJs = AssetGraph.JavaScript.uglifyJs;
var uglifyAst = AssetGraph.JavaScript.uglifyAst;
var crypto = require('crypto');
var path = require('path');
var builder = require('systemjs-builder');
var fs = require('graceful-fs');

// 10 chars of md5 hex
function hash(str) {
  var md5 = crypto.createHash('md5');
  md5.update(str);
  return md5.digest('hex').toString().substr(0, 10);
}

// deep plain object extension
function dextend(a, b) {
  for (var p in b) {
    if (typeof b[p] === 'object') {
      dextend(a[p] = a[p] || {}, b[p]);
    } else {
      a[p] = b[p];
    }
  }
  return a;
}

// generate a hash of a file and move it to a name appended with the hash
// return the hash
function moveToHashed(file, callback) {
  fs.readFile(file, function (err, source) {
    if (err)
      return callback(err);

    var fileHash = hash(source);
    
    fs.rename(file, file.replace(/.js$/, '@' + fileHash + '.js'), function (err) {
      callback(err, fileHash);
    });
  });
}

function findSystemJsImportNodes(ast) {
  var imports = [];
  var walker = new uglifyJs.TreeWalker(function (node) {
    if (node instanceof uglifyJs.AST_Call && 
        node.expression instanceof uglifyJs.AST_Dot && 
        node.expression.property === 'import' && 
        node.expression.expression.name === 'System' && 
        node.args.length === 1) {
      imports.push(node.args[0].value);
    }
  });
  ast.walk(walker);
  return imports;
}
function findSystemJsConfigNode(ast) {
  var configNode;
  var walker = new uglifyJs.TreeWalker(function (node) {
    if (node instanceof uglifyJs.AST_Call && 
        node.expression instanceof uglifyJs.AST_Dot && 
        node.expression.property === 'config' && 
        node.expression.expression.name === 'System' && 
        node.args.length === 1 && 
        node.args[0] instanceof uglifyJs.AST_Object) {
      configNode = node.args[0];
    }
  });
  ast.walk(walker);
  return configNode;
}

function extractSystemJsCalls(assetGraph, initialAsset, callback) {
  var main, mainRelation, config, configRelation;

  assetGraph.populate({ followRelations: { type: 'HtmlScript' } }).run(function (err, assetGraph) {

    if (err)
      return callback(err);

    // work out the main entry point assuming it is an inline script
    // of the form
    // <script> ... System.import('x') ... </script>
    assetGraph.findRelations({ type: 'HtmlScript', from: initialAsset }).forEach(function (relation) {
      var imports = findSystemJsImportNodes(relation.to.parseTree);
      if (!main && imports.length) {
        main = imports[0];
        mainRelation = relation;
      }
    });

    // look out for the configuration file in assets
    // System.config(...) in external script
    assetGraph.findRelations({ type: 'HtmlScript', from: initialAsset }).forEach(function (relation) {
      // one of these relations contains our config
      var configNode;
      if (!config && (configNode = findSystemJsConfigNode(relation.to.parseTree))) {
        config = uglifyAst.astToObj(configNode);
        configRelation = relation;
      }
    });

    if (!main || !config)
      return callback();

    callback(null, {
      config: config,
      configRelation: configRelation,
      main: main,
      mainRelation: mainRelation
    });

  });
}

// only do one build at a time
var buildQueue;
// assets shared between apps, so log which have been moved
var movedHashes = {};
function doSystemJsDepCache(main, config, outRoot, callback) {
  if (buildQueue)
    return buildQueue.then(function () {
      buildQueue = null;
      doSystemJsDepCache(main, config, outRoot, callback);
    });

  config.baseURL = path.resolve(outRoot);

  config.depCache = config.depCache || {};
  config.versions = config.versions || {};

  buildQueue = builder.trace(main, config, true)
  .then(function (output) {
    var tree = output.tree;
    var l;
    
    var treeLength = 0;
    var returned = 0;
    function checkCompletion() {
      if (++returned === treeLength)
        callback();
    }

    for (l in tree)
      if (tree.hasOwnProperty(l))
        treeLength++;

    function processModule(l) {
      var deps = tree[l].deps.map(function (dep) {
        return tree[l].depMap[dep];
      });

      if (deps.length)
        config.depCache[l] = deps;

      // move each module in the tree to a hashed name
      // (if not already)
      var file = tree[l].address.substr(5);
      if (movedHashes[file]) {
        config.versions[l] = movedHashes[file];
        checkCompletion();
      } else {
        moveToHashed(file, function (err, hash) {
          config.versions[l] = hash;
          movedHashes[file] = hash;
          checkCompletion();
        });
      }
    } 
    
    for (l in tree)
      if (tree.hasOwnProperty(l))
        processModule(l);

  }, callback);
}

function doSystemJsBundle(main, config, outRoot, callback) {
  if (buildQueue) {
    return buildQueue.then(function () {
      buildQueue = null;
      doSystemJsBundle(main, config, outRoot, callback);
    });
  }

  var outFile = 'static/bundle.js';
  var outPath = path.join(outRoot, outFile);

  // do the build
  config.baseURL = path.resolve(outRoot);
  buildQueue = builder.build(main, outPath, {
    sourceMaps: true,
    minify: true,
    config: config
  })
  .then(function () {
    moveToHashed(outPath, function (err, hash) {
      if (err)
        return callback(err);
      
      // ensure the main loads the bundle
      config.bundles = config.bundles || {};
      config.bundles[path.relative(outRoot, outPath).replace(/.js$/, '') + '@' + hash] = [main];
      callback();
    });
  }, callback);
}

function parseConfig(config, override) {
  // do config overrides
  dextend(config, override || {});

  // remove identity mappings
  // used to remove eg the app: app-compiled maps
  for (var p in config.map) {
    if (config.map[p] === p)
      delete config.map[p];
  }

  return config;
}

function systemJsBuildHtml(assetGraph, initialAsset, options, callback) {
  extractSystemJsCalls(assetGraph, initialAsset, function(err, systemJs) {
    if (err)
      return callback(err);

    // skip if not using SystemJS
    if (!systemJs)
      return callback();

    var config = parseConfig(systemJs.config, options.configOverride);


    (options.bundle ? doSystemJsBundle : doSystemJsDepCache)(systemJs.main, config, options.outRoot, function (err) {
      if (err)
        return callback(err);

      // save back the config file
      delete config.baseURL;
      var configString = 'System.config(' + JSON.stringify(config) + ');';

      var configRelation = systemJs.configRelation;

      // clone the config asset as each app has its own modified config
      configRelation.to.clone(configRelation);
      
      // when a script attribute is set, the bundle step doesn't add this into the main bundle
      // better ways of doing this welcome!
      configRelation.node.setAttribute('config', 'system');

      configRelation.to.parseTree = uglifyJs.parse(configString);

      callback();
    });

  });
}



module.exports = function (options) {
  options = options || {};

  return function systemJsProduction(assetGraph, callback) {

    var returned = 0;
    function checkCompletion(err) {
      if (err)
        throw err;
      if (++returned === assets.length)
        callback();
    }

    var assets = assetGraph.findAssets({ isInitial: true, type: 'Html' });
    assets.forEach(function(initialAsset) {
      systemJsBuildHtml(assetGraph, initialAsset, options, checkCompletion);
    });

  };
};