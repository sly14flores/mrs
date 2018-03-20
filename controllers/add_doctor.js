var app = angular.module('doctor',['account-module','app-module']);

app.controller('doctorCtrl',function($scope,app) {
	
	$scope.app = app;
	
	$scope.app.data($scope);
	
});