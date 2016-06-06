'use strict';

angular.module('scheduler')
  .service('AppointmentStatus', function(Config, $http, $auth) {
    var baseUrl = Config.apiBase + '/appointment-status';
    return {
      all: function() {
        return $http.get(baseUrl);
      },
      update: function (data) {
          return $http({
              method: 'PUT',
              url: baseUrl + '/' + data.appointment_id,
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer' + $auth.getToken()
              },
              data: {
                  appointment_id: data.appointment_id,
                  employee_id   : data.employee_id,
                  status        : data.status,
                  notes         : data.notes,
              }
          });
      }
    };
  });
