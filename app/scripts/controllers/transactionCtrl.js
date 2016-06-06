'use strict';

angular.module('scheduler')
  .controller('TransactionCtrl', function(Appointment, $rootScope, $scope, $location) {
    if(!$rootScope.authenticated) {
      $location.path('/login');
    }

    $scope.formatTime = function (time) {
        var timeTokens = time.split(':');
        return new Date(1970,0,1, timeTokens[0], timeTokens[1], timeTokens[2]);
    };

    Appointment.all().then(function(resp) {
      $scope.appointments = resp.data;
    });

  });
