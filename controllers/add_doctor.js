var app = angular.module('doctor',['account-module','app-module']);

app.controller('doctorCtrl',function($scope,app) {
	
	$scope.app = app;
	
	$scope.app.data($scope);
	
	$scope.module = {
			id: 3,
			privileges: {
				show: 1,
				add: 2,
				edit: 3,
				delete: 4,
			}
		};
	
});