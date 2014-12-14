ES6 + AngularJS
===============

This is a sample Angular 1.3 application that is structured using ES6 modules and adheres to the [GoCardless Angular style guide](https://github.com/gocardless/angularjs-style-guide).

## Prerequisites:

- node.js: `brew install node`

## Application Dependencies

All the dependencies required for the build system, testing and so on are managed with npm and defined in `package.json`. They can be installed with:

```
npm install
```

## Running the Application

You can run `npm start` to fire up the application on `http://localhost:3010`.

## Tests

You can use `npm test` to run JSHint, Karma Unit tests and our E2E tests.

Typically in development we run only unit tests. You can run these with Karma:

```
./node_modules/.bin/karma start
```

Karma will automatically watch the files and rerun tests when files change.

## Live Reloading

Install the [fb-flo](https://chrome.google.com/webstore/detail/fb-flo/ahkfhobdidabddlalamkkiafpipdfchp?hl=en) chrome extension.

To enable live-reloading have the developer tools open and activate fb-flo.

## Build & Deployment

Create a production optimized build using [AssetGraph Builder](https://github.com/assetgraph/assetgraph-builder):

```
DIST=./dist ./script/build
```

## Debugging Protractor (E2E) tests

### Running individual files

Serve `client/` on port `3010`

```
npm start
```

Run protractor with `--specs` option

```
HTTP_PORT=3010 ./node_modules/.bin/protractor --specs client/app/routes/mandates/show/mandates-show.e2e.js
```

### Pausing the browser

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

## Credits

- Build system/ES6 tooling: [Guy Bedford](https://github.com/guybedford)
