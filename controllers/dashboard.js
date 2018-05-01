var app = angular.module('dashboard',['account-module']);

app.controller('dashboardCtrl',function($scope,$http) {
	
	$scope.views = {};
	
	$scope.dashboard = {};
	
	$http({
		method: 'POST',
		url: 'handlers/dashboard.php'
	}).then(function mySucces(response) {
		
		$scope.dashboard = angular.copy(response.data);
		
	},function myError(response) {
		
	});
	
});