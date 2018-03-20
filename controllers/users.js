var app = angular.module('users',['account-module','bootstrap-modal']);

app.controller('usersCtrl',function($scope,$http,$window,bootstrapModal) {

	$scope.views = {};
	
	$scope.users = [];
	
	list();
	
	function list() {
	
		$http({
		  method: 'GET',
		  url: 'handlers/users/users.php'
		}).then(function mySucces(response) {

			$scope.users = angular.copy(response.data);

		}, function myError(response) {

		});
		
	};
	
	$scope.view = function(row) {

		$window.location.href = "user.html#!/view/"+row.id;

	};
	
	$scope.delete = function(row) {
		
		var onOk = function() {
			
			$http({
				method: 'POST',
				url: 'handlers/users/delete.php',
				data: {id: row.id}
			}).then(function mySuccess(response) {
				
				list();
		
			}, function myError(response) {

		
			});

		};
		
		var onCancel = function() {
			
		};
		
		bootstrapModal.confirm($scope,'Confirmation','Are you sure you want to delete this user?',onOk,onCancel);			
		
	};	
	
});