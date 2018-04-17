var app = angular.module('opd',['account-module','bootstrap-modal','app-module']);

app.controller('opdCtrl',function($scope,$http,$window,bootstrapModal,app) {

	$scope.views = {};
	
	$scope.record = app;
	
	$scope.record.data($scope);
	
	$scope.module = {
			id: 7,
			privileges: {
				show: 1,
				add: 2,
				edit: 3,
				delete: 4,
			}
	};
	
});