import angular from 'angular';
import 'angular-ui-router';

import {errorsRouteModule} from 'app/routes/errors/errors.route';

export var mainConfigModule = angular.module('mainConfigModule', [
  'ui.router',
  errorsRouteModule.name,
]).config([
  '$locationProvider', '$urlRouterProvider', '$httpProvider', '$compileProvider',
  '$controllerProvider', '$rootScopeProvider',
  function ($locationProvider, $urlRouterProvider, $httpProvider, $compileProvider,
    $controllerProvider, $rootScopeProvider) {
    $locationProvider.html5Mode(true);

    $httpProvider.useApplyAsync(true);

    $compileProvider.debugInfoEnabled(false);

    $rootScopeProvider.digestTtl(8);

    $urlRouterProvider.rule(function($injector, $location) {
      var path = $location.path();

      // Remove trailing slashes from path
      if (path !== '/' && path.slice(-1) === '/') {
        $location.replace().path(path.slice(0, -1));
      }
    });

    $urlRouterProvider.otherwise('/404');
  }
]).run([
  '$rootScope',
  function($rootScope) {
    $rootScope.$on('$stateChangeError', function $stateChangeError(event, toState,
      toParams, fromState, fromParams, error) {
      console.group();
      console.error('$stateChangeError', error);
      console.error(error.stack);
      console.info('event', event);
      console.info('toState', toState);
      console.info('toParams', toParams);
      console.info('fromState', fromState);
      console.info('fromParams', fromParams);
      console.groupEnd();
    });
  }
]);
