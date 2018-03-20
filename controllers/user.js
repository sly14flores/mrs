var app = angular.module('user',['account-module','app-module']);

app.controller('userCtrl',function($scope,app) {
	
	$scope.app = app;
	
	$scope.app.data($scope);
	
});