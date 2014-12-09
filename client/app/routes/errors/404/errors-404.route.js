import angular from 'angular';
import 'angular-ui-router';
import template from './errors-404.template.html!text';

export var errors404RouteModule = angular.module('errors404RouteModule', [
  'ui.router'
]).config([
  '$stateProvider',
  function usersLoginRoute($stateProvider) {
    $stateProvider.state('errors.404', {
      url: '/404',
      template: template
    });
  }
]);
