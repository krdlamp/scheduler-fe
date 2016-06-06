'use strict';

angular.module('scheduler')
    .service('Department', function(Config, $http) {
        var baseUrl = Config.apiBase + '/departments';
        return {
            all: function() {
                return $http.get(baseUrl);
            }
        };
    });
