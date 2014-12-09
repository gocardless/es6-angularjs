System.config({
  meta: {
    'components/angular/angular': { format: 'global', exports: 'angular' },
    'components/angular-mocks/angular-mocks': { deps: ['angular'] },
    'components/angular-touch/angular-touch': { deps: ['angular'] },
    'components/angular-animate/angular-animate': { deps: ['angular'] },
    'components/angular-aria/angular-aria/angular-aria': { deps: ['angular'] },
    'components/angular-messages/angular-messages': { deps: ['angular'] },
    'components/angular-i18n-en-gb/angular-i18n/angular-locale_en-gb': { deps: ['angular'] },
    'components/angular-ui-router/angular-ui-router/release/angular-ui-router': { deps: ['angular'] },
  },
  map: {
    'app': 'app-compiled',
    'text': 'components/plugin-text/text',
    'json': 'components/plugin-json/json',
    'lodash': 'components/lodash/dist/lodash',
    'angular': 'components/angular/angular',
    'angular-mock': 'components/angular-mocks/angular-mocks',
    'angular-touch': 'components/angular-touch/angular-touch',
    'angular-animate': 'components/angular-animate/angular-animate',
    'angular-aria': 'components/angular-aria/angular-aria',
    'angular-messages': 'components/angular-messages/angular-messages',
    'angular-i18n-en-gb': 'components/angular-i18n/angular-locale_en-gb',
    'angular-ui-router': 'components/angular-ui-router/release/angular-ui-router',
    'rtts-assert': 'components/assert/src/assert',
  }
});
