var app = angular.module('consultation',['account-module','app-module']);

app.controller('consultationCtrl',function($scope,app) {
	
	$scope.app = app;
	
	$scope.app.data($scope);
	
});