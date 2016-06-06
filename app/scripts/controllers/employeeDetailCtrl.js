'use strict';

angular.module('scheduler')
  .controller('EmployeeDetailCtrl', function($routeParams, Employee, Position, Level, Department, Flash, $scope) {

    Employee.find($routeParams.empId).then(function(resp) {
      $scope.emp = resp.data;
      console.log($scope.emp);

      Employee.all().then(function(resp) {
        $scope.employees = resp.data;
      });

      Department.all().then(function(resp) {
        $scope.departments = resp.data;
        angular.forEach($scope.departments, function(value) {
          if(value.id === $scope.emp.department.id) {
            $scope.emp.department = value;
          }
        });
      });

      Level.all().then(function(resp) {
        $scope.levels = resp.data;
        angular.forEach($scope.levels, function(value) {
          if(value.id === $scope.emp.level.id) {
            $scope.emp.level = value;
          }
        });
      });

      Position.all().then(function(resp) {
        $scope.positions = resp.data;
        angular.forEach($scope.positions, function(value) {
          if(value.id === $scope.emp.position.id) {
            $scope.emp.position = value;
          }
        });
      });
    });

    $scope.update = function() {
      var data = [];

      data.id            = $scope.emp.id;
      data.emp_num       = $scope.emp.emp_num;
      data.first_name    = $scope.emp.first_name;
      data.middle_name   = $scope.emp.middle_name;
      data.last_name     = $scope.emp.last_name;
      data.suffix        = $scope.emp.suffix;
      data.email         = $scope.emp.email;
      data.department_id = $scope.emp.department.id;
      data.position_id   = $scope.emp.position.id;
      data.level_id      = $scope.emp.level.id;

      Employee.patch(data).then(function(resp) {
        var message = 'Employee record has been successfully updated!';
        Flash.create('success', message);
      });
    };

  })
