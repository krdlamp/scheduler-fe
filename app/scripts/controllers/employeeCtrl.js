'use strict';

angular.module('scheduler')
  .controller('EmployeeCtrl', function(Employee, Position, Level, Department, Flash, $scope, $route) {

    Employee.all().then(function(resp) {
      $scope.employees = resp.data;
    });

    Department.all().then(function(resp) {
      $scope.departments = resp.data;
    });

    Level.all().then(function(resp) {
      $scope.levels = resp.data;
    });

    Position.all().then(function(resp) {
      $scope.positions = resp.data;
    });

    $scope.save = function() {
      var data = [];

      data.emp_num = $scope.emp_num;
      data.first_name = $scope.first_name;
      data.middle_name = $scope.middle_name;
      data.last_name = $scope.last_name;
      data.suffix = $scope.suffix;
      data.email = $scope.email;
      data.department_id = $scope.department.id;
      data.position_id = $scope.position.id;
      data.level_id = $scope.level.id;

      Employee.create(data).then(function(resp) {
        var message = 'Employee record has been successfully added!';
        Flash.create('success', message);
      });
    };

    $scope.delete = function(id) {
      Employee.delete(id).then(function(resp) {
        $route.reload();
      });
    };

  })
