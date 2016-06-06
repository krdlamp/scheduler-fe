'use strict';

angular.module('scheduler')
    .service('Employee', function(Config, $http, $auth) {
        var baseUrl = Config.apiBase + '/employees';
        return {
            all: function() {
              return $http.get(baseUrl);
            },
            find: function (id) {
                return $http.get(baseUrl + '/' + id);
            },
            create: function (employee) {
                return $http({
                    method: 'POST',
                    url: baseUrl,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + $auth.getToken()
                    },
                    data: {
                      emp_num       : employee.emp_num,
                      first_name    : employee.first_name,
                      middle_name   : employee.middle_name,
                      last_name     : employee.last_name,
                      suffix        : employee.suffix,
                      email         : employee.email,
                      department_id : employee.department_id,
                      position_id   : employee.position_id,
                      level_id      : employee.level_id,
                    }
                });
            },
            patch: function (employee) {
               return $http({
                   method: 'PUT',
                   url: baseUrl + '/' + employee.id,
                   headers: {
                       'Content-Type': 'application/json',
                       Authorization: 'Bearer' + $auth.getToken()
                   },
                   data: {
                     id            : employee.id,
                     emp_num       : employee.emp_num,
                     first_name    : employee.first_name,
                     middle_name   : employee.middle_name,
                     last_name     : employee.last_name,
                     suffix        : employee.suffix,
                     email         : employee.email,
                     department_id : employee.department_id,
                     position_id   : employee.position_id,
                     level_id      : employee.level_id,
                   }
               });
            },
            delete: function(id) {
              return $http({
                method: 'DELETE',
                url: baseUrl + '/' + id,
                headers: {
                  'Content-Type': 'application/json'
                }
              });
            }
        };
    });
