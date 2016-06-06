'use strict';

angular.module('scheduler')
    .service('Position', function(Config, $http) {
        var baseUrl = Config.apiBase + '/positions';
        return {
            all: function() {
              return $http.get(baseUrl);
            }
        };
    });
