import angular from 'angular';
import 'angular-ui-router';
import _ from 'lodash';

export var authRequiredControllerModule = angular.module('authRequiredControllerModule', [
  'ui.router'
]).controller('AuthRequiredController', [
  '$state',
  function AuthRequiredController($state) {
    var ctrl = this;

    function isParentStateActive(parentState) {
      return $state.includes(parentState);
    }

    _.extend(ctrl, {
      isParentStateActive: isParentStateActive
    });
  }
]);
