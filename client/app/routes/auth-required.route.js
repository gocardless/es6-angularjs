import angular from 'angular';
import 'angular-ui-router';

import {currentUserModule} from 'app/services/current-user/current-user';
import {siteHeaderComponentModule} from 'app/components/site-header/site-header.directive';
import {authRequiredComponentModule} from 'app/components/auth-required/auth-required.directive';

export var authRequiredRouteModule = angular.module('authRequiredRouteModule', [
  'ui.router',
  currentUserModule.name,
  siteHeaderComponentModule.name,
  authRequiredComponentModule.name,
]).config([
  '$stateProvider',
  function authRequiredRoute($stateProvider) {

    $stateProvider.state('authRequired', {
      abstract: true,
      views: {
        '': {
          template: '<auth-required></auth-required>'
        },
        'site-header': {
          template: '<site-header current-user="ctrl.currentUser"></site-header>',
          controllerAs: 'ctrl',
          controller: [
            'currentUser',
            function authRequiredSiteHeaderController(currentUser) {
              var ctrl = this;
              ctrl.currentUser = currentUser;
            }
          ]
        }
      },
      resolve: {
        currentUser: [
          'CurrentUser',
          function currentUserResolver(CurrentUser) {
            return CurrentUser.get();
          }
        ]
      }
    });

  }
]);
