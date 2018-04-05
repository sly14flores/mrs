var app = angular.module('opd',['account-module','bootstrap-modal','app-module']);

app.controller('opdCtrl',function($scope,$http,$window,bootstrapModal,app) {

	$scope.views = {};
	
	$scope.record = app;
	
	$scope.record.data($scope);
	
});