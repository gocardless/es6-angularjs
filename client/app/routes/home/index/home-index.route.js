import angular from 'angular';
import 'angular-ui-router';

import {authRequiredRouteModule} from 'app/routes/auth-required.route';
import template from './home-index.template.html!text';

export var homeIndexRouteModule = angular.module('homeIndexRouteModule', [
  'ui.router',
  authRequiredRouteModule.name
]).config([
  '$stateProvider',
  function homeRoute($stateProvider) {
    $stateProvider.state('authRequired.home.index', {
      url: '/',
      template: template
    });
  }
]);
