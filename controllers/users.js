var app = angular.module('users',['account-module','bootstrap-modal','module-access']);

app.controller('usersCtrl',function($scope,$http,$window,bootstrapModal,access) {

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
		
	if (!access.has($scope,$scope.profile.groups,$scope.module.id,$scope.module.privileges.edit)) return;
	
		$window.location.href = "user.html#!/view/"+row.id;

	};
	
	$scope.delete = function(row) {
		
		if (!access.has($scope,$scope.profile.groups,$scope.module.id,$scope.module.privileges.delete)) return;
		
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

	$scope.module = {
			id: 2,
			privileges: {
				show: 1,
				add: 2,
				edit: 3,
				delete: 4,
			}
		};	
	
});