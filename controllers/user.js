var app = angular.module('user',['account-module','app-module']);

app.controller('userCtrl', function($scope,app) {
	
	$scope.app = app;
	
	$scope.app.data($scope);
	
	$scope.module = {
			id: 2,
			privileges: {
				show: 1,
				add: 2,
				edit: 3,
				delete: 4,
			}
		};
});