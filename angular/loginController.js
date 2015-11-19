var app = angular.module('Login', []);

app.controller('LoginCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.credentials = {
    username: "",
    password: ""
  };
  $scope.info = "login first"
  $scope.method = 'POST'
  $scope.url = 'http://localhost:3000/'
  $scope.login = function () {
	if($scope.credentials.username && $scope.credentials.password) {
	  $scope.response = null;
	  $http({method: $scope.method, url: $scope.url, data: $scope.credentials}).then(function(response) {
          $scope.info = "logged in as " + response.data;
        }, function(response) {
          $scope.info = "error, unable to login";
      });
	}
  };
}]);
