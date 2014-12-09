import angular from 'angular';
import 'angular-ui-router';

import {homeIndexRouteModule} from './index/home-index.route';
import {authRequiredRouteModule} from 'app/routes/auth-required.route';

export var homeRouteModule = angular.module('homeRouteModule', [
  'ui.router',
  authRequiredRouteModule.name,
  homeIndexRouteModule.name
]).config([
  '$stateProvider',
  function homeRoute($stateProvider) {
    $stateProvider.state('authRequired.home', {
      abstract: true,
      template: '<ui-view></ui-view>'
    });
  }
]);
