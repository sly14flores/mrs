var app = angular.module('ipd',['account-module','bootstrap-modal','app-module']);

app.controller('ipdCtrl',function($scope,$http,$window,bootstrapModal,app) {

	$scope.views = {};
	
	$scope.record = app;
	
	$scope.record.data($scope);
	
});