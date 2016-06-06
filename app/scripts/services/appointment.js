'use strict';

angular.module('scheduler')
    .service('Appointment', function (Config, $http, $auth) {
        var baseUrl = Config.apiBase + '/appointments';
        return {
            all: function () {
                return $http.get(baseUrl);
            },
            find: function (id) {
                return $http.get(baseUrl + '/' + id);
            },
            create: function (appointment) {
                return $http({
                    method: 'POST',
                    url: baseUrl,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + $auth.getToken()
                    },
                    data: {
                        subject           : appointment.subject,
                        set_date          : appointment.set_date,
                        start_time        : appointment.start_time,
                        end_time          : appointment.end_time,
                        set_by            : appointment.set_by,
                        purpose           : appointment.purpose,
                        employees         : appointment.employees,
                        agendas           : appointment.agendas,
                        status            : appointment.status,
                        invitation_status : appointment.invitation_status,
                        venue             : appointment.venue,
                        notes             : appointment.notes,
                    }
                });
            },
            patch: function (appointment) {
               return $http({
                   method: 'PUT',
                   url: baseUrl + '/' + appointment.id,
                   headers: {
                       'Content-Type': 'application/json',
                       Authorization: 'Bearer' + $auth.getToken()
                   },
                   data: {
                     id                : appointment.id,
                     subject           : appointment.subject,
                     set_date          : appointment.set_date,
                     start_time        : appointment.start_time,
                     end_time          : appointment.end_time,
                     set_by            : appointment.set_by,
                     purpose           : appointment.purpose,
                     employees         : appointment.employees,
                     agendas           : appointment.agendas,
                     status            : appointment.status,
                     venue             : appointment.venue,
                     notes             : appointment.notes,
                     reason            : appointment.reason,
                   }
               });
            },
        };
    });
