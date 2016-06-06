'use strict';

angular.module('scheduler')
  .controller('RegisterCtrl', function($route, $auth, $scope, $rootScope, Config, Flash, $http, $location) {
    // var baseUrl = Config.apiBase + '/register';

    $scope.register = function() {
      if($scope.user.password === $scope.user.password_confirmation) {
        $auth.signup({
          emp_num: $scope.user.emp_num,
          password: $scope.user.password
        }).then(function (response) {

          var token = JSON.stringify(response.data.token);
          var user  = JSON.stringify(response.data.user);

          localStorage.setItem('satellizer_token', token);
          localStorage.setItem('user', user);

          $rootScope.authenticated = true;

          $rootScope.currentUser = localStorage.getItem('user');

          $location.path('/');

        }, function (response) {
          var errorMessage;
          if (response.status === 500) {
            errorMessage = "Account already exists!";
          } else {
            errorMessage = "Invalid employee number!";
          }
          Flash.create('danger', errorMessage);
        });
      } else {
        var errorMessage = "Password do not match!";
        Flash.create('danger', errorMessage);
      }

  };

});
