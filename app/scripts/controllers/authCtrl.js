'use strict';

angular.module('scheduler')
    .controller('AuthCtrl', function($auth, $route, $scope, $location, Config, Flash, $http, $rootScope) {
        var baseUrl = Config.apiBase  + '/authenticate/user';
        $scope.loginData = {
            emp_num: '',
            password: ''
        };

        $scope.loginError = false;
        // $scope.loginErrorText;

        $rootScope.login = function() {
            var credentials = {
                emp_num: $scope.loginData.emp_num,
                password: $scope.loginData.password
            };

            $auth.login(credentials).then(function() {

                // Return an $http request for the now authenticated user
                return $http({
                    method: 'GET',
                    url: baseUrl,
                    headers: {
                        Authorization: 'Bearer ' + $auth.getToken()
                    }
                }).then(function (response) {

                    // Stringify the returned data to prepare it
                    // to go into local storage
                    var user = JSON.stringify(response.data.user);

                    // Set the stringified user data into local storage
                    localStorage.setItem('user', user);

                    // The user's authenticated state gets flipped to
                    // true so we can now show parts of the UI that rely
                    // on the user being logged in
                    $rootScope.authenticated = true;

                    // Putting the user's data on $rootScope allows
                    // us to access it anywhere across the app
                    $rootScope.currentUser = response.data.user;

                    $location.path('/');
                });

            // Handle errors
            }, function(error) {
                var loginErrorText = error.data.error;
                var errorMessage;
                if (loginErrorText === 'invalid_credentials') {
                  errorMessage = 'Invalid Credentials';
                }
                Flash.create('danger', errorMessage);
            });
        };
    })
    .run(function ($rootScope, $auth, $location) {
        var user = JSON.parse(window.localStorage.getItem('user'));
        if (user) {
            $rootScope.currentUser = user;
        }
        $rootScope.logout = function() {
            console.log('logout clicked');
            $auth.logout().then(function() {
                localStorage.removeItem('user');

                $rootScope.authenticated = false;

                $rootScope.currentUser = null;
                $location.path('/login');
            });
        };
    });
