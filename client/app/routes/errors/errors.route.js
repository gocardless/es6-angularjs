import angular from 'angular';
import 'angular-ui-router';
import {errors404RouteModule} from './404/errors-404.route';

export var errorsRouteModule = angular.module('errorsRouteModule', [
  'ui.router',
  errors404RouteModule.name
]).config([
  '$stateProvider',
  function errorsRoute($stateProvider) {
    $stateProvider.state('errors', {
      abstract: true,
      template: '<ui-view></ui-view>'
    });
  }
]);
