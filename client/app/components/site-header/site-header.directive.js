import angular from 'angular';

import template from './site-header.template.html!text';

export var siteHeaderComponentModule = angular.module('siteHeaderComponentModule', [
]).directive('siteHeader', [
  function siteHeader() {
    return {
      restrict: 'E',
      template: template,
      controller: angular.noop,
      controllerAs: 'ctrl',
      bindToController: true,
      scope: {
        currentUser: '='
      }
    };
  }
]);
