'use strict';

angular.module('scheduler')
    .controller('AppointmentInvitationsCtrl', function($scope, $rootScope, Appointment, AppointmentStatus, PersonnelAppointment, Employee, $location) {
      if (!$rootScope.authenticated) {
          $location.path('/login');
      }

        var currentUser = JSON.parse(window.localStorage.getItem('user'));

        $scope.pendingInvitations    = [];
        $scope.approvedAppointments  = [];
        $scope.cancelledAppointments = [];
        $scope.cancelledApproval     = [];
        $scope.scheduledAppointments = [];
        $scope.requests              = [];

        $scope.formatTime = function (time) {
            var timeTokens = time.split(':');
            return new Date(1970,0,1, timeTokens[0], timeTokens[1], timeTokens[2]);
        };

        Appointment.all().then(function (resp) {
            var appointments = resp.data;
            angular.forEach(appointments, function (value) {
                if (value.employee_id === currentUser.id) {
                    $scope.requests.push(value);
                }
            });
            $scope.requestsCount  = $scope.requests.length;
        });

        PersonnelAppointment.getEmpAppointment(currentUser.id).then(function(resp) {
          var appointments = resp.data;
          angular.forEach(appointments, function(value) {
            console.log(value);
            if (value.employee_id !== currentUser.id) {
              if (value.pivot.status === "") {
                $scope.pendingInvitations.push(value);
              } else if (value.pivot.status === "Attendance Confirmed") {
                $scope.approvedAppointments.push(value);
              } else if (value.pivot.status === "Attendance Cancelled") {
                $scope.cancelledApproval.push(value);
              }
            }
          });
          $scope.pendingCount           = $scope.pendingInvitations.length;
          $scope.approvedCount          = $scope.approvedAppointments.length;
          $scope.cancelledApprovalCount = $scope.cancelledApproval.length;
        });

        Appointment.all().then(function (resp) {
            var allSched = [];
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
              if(emps.length === trues.length + 1) {
                allSched.push(appointment);
              }
              if (appointment.status === "Cancelled") {
                $scope.cancelledAppointments.push(appointment);
              }
            });
            angular.forEach(allSched, function(value) {
              var appt = value;
              angular.forEach(appt.employees, function(value) {
                if(value.id === currentUser.id && appt.status != 'Cancelled') {
                  $scope.scheduledAppointments.push(appt);
                }
              });
            });
            $scope.scheduledCount = $scope.scheduledAppointments.length;
            $scope.cancelledCount = $scope.cancelledAppointments.length;
        });


        $scope.getEmp = function(empId) {
          Employee.all().then(function (resp) {
            var emps = resp.data;
            angular.forEach(emps, function(value) {
              if (value.id === empId) {
                $scope.employee = value;
              }
            });
          });
        };

        $scope.getEmps = function(apptId) {
          Appointment.all().then(function (resp) {
            var appts = resp.data;
            angular.forEach(appts, function(value) {
              if(value.id === apptId) {
                $scope.emps = value.employees;
              }
            });
          });
        };

        $scope.confirmAttendance = function(appointment) {
            var data = [];

            data.appointment_id = appointment.id;
            data.employee_id    = currentUser.id;
            data.status         = 'Attendance Confirmed';

            AppointmentStatus.update(data).then(function () {
                $location.path('/scheduler/appointments/my-appointments/approved');
            });
        };

        $scope.cancelAttendance = function(appointment) {
            var data = [];

            data.appointment_id = appointment.id;
            data.employee_id    = currentUser.id;
            data.status         = 'Attendance Cancelled';

            AppointmentStatus.update(data).then(function () {
                $location.path('/scheduler/appointments/my-appointments/approved');
            });
        };

        $scope.notAvailable = function(appointment) {
          var reason = window.prompt("Please state your reasons:");
          var data = [];

          data.appointment_id = appointment.id;
          data.employee_id    = currentUser.id;
          data.status         = 'Not Available';
          data.notes          = reason;

          AppointmentStatus.update(data).then(function() {
            $location.path('/scheduler/appointments/my-appointments/pending');
          });
        };

        $scope.cancelAppointment = function(appointment) {
          var reason = window.prompt("Please state your reasons:");
          var data = [];

          data.id                 = appointment.id;
          data.subject            = appointment.subject;
          data.set_date           = appointment.set_date;
          data.start_time         = appointment.start_time;
          data.end_time           = appointment.end_time;
          data.set_by             = appointment.employee_id;
          data.purpose            = appointment.purpose;
          data.employees          = appointment.employees;
          data.agendas            = appointment.agendas;
          data.status             = 'Cancelled';
          data.invitation_status  = appointment.invitation_status;
          data.venue              = appointment.venue;
          data.notes              = appointment.notes;
          data.reason             = reason;

          Appointment.patch(data).then(function() {
            $location.path('/scheduler/appointments/my-appointments/cancelled');
          });
        };

        $scope.reSched = function(appointment) {
          var data = [];

          data.id                 = appointment.id;
          data.subject            = appointment.subject;
          data.set_date           = appointment.set_date;
          data.start_time         = appointment.start_time;
          data.end_time           = appointment.end_time;
          data.set_by             = appointment.employee_id;
          data.purpose            = appointment.purpose;
          data.employees          = appointment.employees;
          data.agendas            = appointment.agendas;
          data.status             = 'Re-scheduled';
          data.invitation_status  = appointment.invitation_status;
          data.venue              = appointment.venue;
          data.notes              = appointment.notes;

          Appointment.patch(data).then(function() {
            $location.path('/scheduler/appointments/my-appointments/requested');
          });
        };
    });
