var app = angular.module('staff',['account-module','app-module']);

app.controller('staffCtrl',function($scope,app) {
	
	$scope.app = app;
	
	$scope.app.data($scope);
	
	$scope.module = {
			id: 4,
			privileges: {
				show: 1,
				add: 2,
				edit: 3,
				delete: 4,
			}
		};
});