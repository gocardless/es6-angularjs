import angular from 'angular';
import 'angular-touch';
import 'angular-animate';
import 'angular-aria';
import 'angular-messages';
import 'angular-i18n-en-gb';

import {mainConfigModule} from 'app/config/main.config';

import {homeRouteModule} from 'app/routes/home/home.route';

export var mainModule = angular.module('mainModule', [
  // ngTouch has to be BEFORE ngAria, else ng-clicks happen twice
  'ngTouch',
  'ngAnimate',
  'ngAria',
  'ngMessages',
  mainConfigModule.name,

  homeRouteModule.name
]).run();
