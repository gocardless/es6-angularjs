import angular from 'angular';

export var currentUserModule = angular.module('currentUserModule', [
]).factory('CurrentUser', [
  '$q',
  function CurrentUser($q) {
    function get() {
      var deferred = $q.defer();

      deferred.resolve({
        name: 'GoCardless'
      });

      return deferred.promise;
    }

    return {
      get: get
    };
  }
]);
