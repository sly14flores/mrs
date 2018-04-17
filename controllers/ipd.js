var app = angular.module('ipd',['account-module','bootstrap-modal','app-module']);

app.controller('ipdCtrl',function($scope,$http,$window,bootstrapModal,app) {

	$scope.views = {};
	
	$scope.record = app;
	
	$scope.record.data($scope);
	
	$scope.module = {
			id: 8,
			privileges: {
				show: 1,
				add: 2,
				edit: 3,
				delete: 4,
			}
	};
});