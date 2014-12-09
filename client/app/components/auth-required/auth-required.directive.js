import angular from 'angular';
import 'angular-ui-router';

import {authRequiredControllerModule} from './auth-required.controller';
import template from './auth-required.template.html!text';

export var authRequiredComponentModule = angular.module('authRequiredComponentModule', [
  'ui.router',
  authRequiredControllerModule.name,
]).directive('authRequired', [
  function authRequiredDirective() {
    return {
      restrict: 'E',
      template: template,
      controller: 'AuthRequiredController',
      controllerAs: 'ctrl',
      bindToController: true,
      scope: {}
    };
  }
]);
