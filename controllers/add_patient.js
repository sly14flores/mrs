var app = angular.module('patient',['account-module','app-module']);

app.controller('patientCtrl',function($scope,app,record) {

	$scope.app = app;	
	$scope.app.data($scope);
	$scope.phoneNumbr = /^\d{3}[- ]?\d{3}[- ]?\d{5}$/;
	$scope.module = {
			id: 6,
			privileges: {
				show: 1,
				add: 2,
				edit: 3,
				delete: 4,
			}
	};

});