var app = angular.module('staff',['account-module','app-module']);

app.controller('staffCtrl',function($scope,app) {
	
	$scope.app = app;
	
	$scope.app.data($scope);
	
});