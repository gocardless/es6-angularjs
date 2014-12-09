ES6 + AngularJS
===============

## Dependencies

```
npm install
```

## Running

```
npm start
```

## Tests

```
npm test
```

## Prerequisites:

- node.js: `brew install node`

# Live Reloading

Install the [fb-flo](https://chrome.google.com/webstore/detail/fb-flo/ahkfhobdidabddlalamkkiafpipdfchp?hl=en) chrome extension.

To enable live-reloading have the developer tools open and activate fb-flo.

# Unit tests

```
karma start
```

# Debugging Protractor tests

## Running individual files

Serve `client/` on port `3010`

```
npm start
```

Run protractor with `--specs` option

```
HTTP_PORT=3010 ./node_modules/.bin/protractor --specs client/app/routes/mandates/show/mandates-show.e2e.js
```

## Pausing the browser

Add `browser.pause();` to your spec.

```js
it('renders index', function() {
  browser.get('app/index.html');

  // Use browser.pause() in your test to enter the protractor debugger from
  // that point in the control flow. Does not require changes to the command line
  // (no need to add 'debug').
  browser.pause();
});
```

## Pausing to debug

Add `browser.debugger();` to your spec.
```js
it('fails to find a non-existent element', function() {
  browser.get('app/index.html');

  // Run this statement before the line which fails. If protractor is run
  // with the debugger (protractor debug <...>), the test
  // will pause after loading the webpage but before trying to find the
  // element.
  browser.debugger();

  // This element doesn't exist, so this fails.
  var nonExistant = element(by.binding('nopenopenope'));
});
```

Serve `client/` on port `3010`
```
npm start
```

Run protractor in debug mode
```
HTTP_PORT=3010 ./node_modules/.bin/protractor debug config/protractor.config.js
```

## Interactive debugging

Start the server on port `3010` serving `client/`
```
npm start
```

Start standalone Selenium server
```
./node_modules/.bin/webdriver-manager start
```

Start Protractor's `elemenentexplorer.js`
```
./node_modules/protractor/bin/elementexplorer.js http://127.0.0.1:3010
> browser.rootEl = '[data-main-app]'
> browser.waitForAngular();
> $$('body');
```

You can now access the Protractor APIs in a REPL and interactively control the WebDriver instance.

# Credits

- Build system/ES6 tooling: [Guy Bedford](https://github.com/guybedford)
