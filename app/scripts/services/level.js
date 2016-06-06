'use strict';

angular.module('scheduler')
    .service('Level', function(Config, $http) {
        var baseUrl = Config.apiBase + '/levels';
        return {
            all: function() {
              return $http.get(baseUrl);
            }
        };
    });
