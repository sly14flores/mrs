var app = angular.module('patient',['account-module','app-module']);

app.controller('patientCtrl',function($scope,app,record) {
	
	$scope.app = app;	
	$scope.app.data($scope);	
	
});