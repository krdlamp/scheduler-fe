'use strict';

angular.module('scheduler')
  .service('PersonnelAppointment', function(Config, $http, $auth) {
    var baseUrl = Config.apiBase + '/personnel-appointments';
    return {
      getEmpAppointment: function(id) {
        return $http({
          method: 'GET',
          url: baseUrl + '/' + id,
          headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer' + $auth.getToken()
          }
        });
      }
    };
  });
