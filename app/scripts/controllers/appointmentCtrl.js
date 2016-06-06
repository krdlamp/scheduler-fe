'use strict';

angular.module('scheduler')
    .controller('AppointmentCtrl', function($rootScope, $filter, $location, $route, $scope, Flash, Employee, Department, Appointment) {
        if (!$rootScope.authenticated) {
            $location.path('/login');
        }

        // Configure calendar object
        $scope.uiConfig = {
            calendar:{
                // height: 800,
                editable: true,
                header:{
                    left: 'month basicWeek basicDay agendaWeek agendaDay',
                    center: 'title',
                    right: 'today prev,next'
                },
                dayClick: $scope.alertEventOnClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize,
                timeFormat: 'HH:mm A',
                ignoreTimezone: false,
            }
        };

        var user = JSON.parse(window.localStorage.getItem('user'));
        $scope.user = user;

        $scope.eventSources = [];

        Employee.all().then(function(resp) {
            var employees = [];
            var emps = resp.data;
            angular.forEach(emps, function(value) {
                if (value.id !== $scope.user.id) {
                  if ((value.level.id === '1') || (value.level.id === '2')) {
                    employees.push(value);
                  }
                }
            });
            $scope.employees = employees;
        });

        // Get all appointments
        Appointment.all().then(function (resp) {
            var appointments = resp.data;
            $scope.appointments = [];
            $scope.appointments = appointments;
            $scope.events = [];
            angular.forEach(appointments, function (value) {
                var meeting = {
                    title      : value.subject,
                    date       : value.set_date,
                    start      : value.set_date + ' ' + value.start_time,
                    start_time : value.start_time,
                    end_time   : value.end_time,
                    purpose    : value.purpose,
                    url        : '#/scheduler/appointment/' + value.id + '/details',
                    allDay     : false
                };
                $scope.events.push(meeting);
            });
            $scope.eventSources.push($scope.events);
        });

        // Initialize agendas to an empty array
        $scope.agendas = [];

        $scope.animationsEnabled = true;

        $scope.syncEmps = function() {
            var selectedEmps = JSON.stringify($scope.selectedEmps);
            localStorage.setItem('selectedEmps', selectedEmps);
            $scope.selectedEmps = JSON.parse(window.localStorage.getItem('selectedEmps'));
        };

        // var id = 1;

        $scope.addAgenda = function() {
            var description = $scope.agenda.description;
            $scope.agenda = {
                // 'id': id++,
                'description': description
            };
            var agendas = JSON.stringify($scope.agendas.concat($scope.agenda));
            localStorage.setItem('agendas', agendas);
            $scope.agendas = JSON.parse(window.localStorage.getItem('agendas'));
        };

        $scope.removeAgenda = function(index) {
            var agendas = JSON.parse(window.localStorage.getItem('agendas'));
            agendas.splice(index, 1);
            agendas = JSON.stringify(agendas);
            localStorage.setItem('agendas', agendas);
            $scope.agendas = JSON.parse(window.localStorage.getItem('agendas'));
        };

        // Set appointment
        $scope.schedule = function() {
            var data = [];

            data.subject           = $scope.subject;
            data.employees         = $scope.selectedEmps.concat($scope.user);
            data.set_date          = $filter('date')($scope.set_date, 'yyyy-MM-dd', 'UTC+08:00');
            data.start_time        = $filter('date')($scope.start_time, 'hh:mm a', 'UTC+08:00');
            data.end_time          = $filter('date')($scope.end_time, 'hh:mm a', 'UTC+08:00');
            data.set_by            = $scope.user.id;
            data.purpose           = $scope.purpose;
            data.agendas           = $scope.agendas;
            data.status            = 'Scheduled';
            data.invitation_status = 'Pending';
            data.venue             = $scope.venue;
            data.notes             = $scope.notes;

            if ($scope.appointments.length > 0) {
                var conflicts = [];
                angular.forEach($scope.appointments, function (value) {
                    if (value.set_date === data.set_date) {
                        var formatTime = function (time) {
                            var timeTokens = time.split(':');
                            return new Date(1970,0,1, timeTokens[0], timeTokens[1], timeTokens[2]);
                        };
                        var formattedStartTime = formatTime(value.start_time);
                        var formattedEndTime   = formatTime(value.end_time);
                        var valueStartTime     = $filter('date')(formattedStartTime, 'hh:mm a', 'UTC+08:00');
                        var valueEndTime       = $filter('date')(formattedEndTime, 'hh:mm a', 'UTC+08:00');
                        if (valueStartTime === data.start_time) {
                            conflicts.push(value);
                        }
                        if ((data.start_time < valueEndTime) && (data.start_time > valueStartTime)) {
                            conflicts.push(value);
                        }
                        if ((data.end_time > valueStartTime) && (data.end_time < valueEndTime)) {
                            conflicts.push(value);
                        }
                        if ((valueStartTime > data.start_time) && (valueEndTime < data.end_time)) {
                          conflicts.push(value);
                        }
                        if ((data.start_time < valueStartTime) && (data.end_time >= valueEndTime)) {
                          conflicts.push(value);
                        }
                    }
                });
                console.log(conflicts.length);
                if (conflicts.length > 0) {
                    var message = 'Warning: Time not available!';
                    Flash.create('danger', message);
                    console.log('Time not available');
                } else {
                    Appointment.create(data).then(function () {
                        $route.reload();
                    });
                }
            } else {
                Appointment.create(data).then(function () {
                    $location.path('/calendar');
                });
            }

        };

    });
