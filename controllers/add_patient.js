var app = angular.module('patient',['account-module','app-module']);

app.controller('patientCtrl',function($scope,app,record) {
	
	$scope.app = app;	
	$scope.app.data($scope);	
	
	$scope.module = {
			id: 5,
			privileges: {
				show: 1,
				add: 2,
				edit: 3,
				delete: 4,
			}
		};
		
});