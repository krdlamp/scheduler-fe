'use strict';

angular.module('scheduler')
    .controller('AppointmentListCtrl', function ($scope, $filter, $location, $rootScope, Appointment) {
        if (!$rootScope.authenticated) {
            $location.path('/login');
        }

        $scope.currentDate = new Date();
        $scope.appointments = [];
        $scope.presentAppointments = [];

        $scope.formatTime = function (time) {
            var timeTokens = time.split(':');
            return new Date(1970,0,1, timeTokens[0], timeTokens[1], timeTokens[2]);
        };

        Appointment.all().then(function (resp) {
            var appointments = resp.data;
            angular.forEach(appointments, function(value) {
              var trues = [];
              var appointment = value;
              var emps = appointment.employees;
              angular.forEach(appointment.employees, function(value) {
                // if(value.pivot.status === "Attendance Confirmed") {
                if((value.pivot.status === "Attendance Confirmed") || ((value.pivot.status === "") && (value.employeeId === value.pivot.employee_id))) {
                  trues.push(value);
                }
              });
              if(emps.length === trues.length + 1 && appointment.status != 'Cancelled') {
                if(appointment.set_date === $filter('date')($scope.currentDate, 'yyyy-MM-dd', 'UTC+08:00')) {
                  $scope.presentAppointments.push(appointment);
                } else {
                  $scope.appointments.push(appointment);
                }
              }
            });
        });
    });
