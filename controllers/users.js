var app = angular.module('users',['ui.bootstrap','account-module','bootstrap-modal','module-access','bootstrap-growl']);

app.controller('usersCtrl',function($scope,$http,$window,bootstrapModal,access,growl) {

	$scope.views = {};
	
	$scope.users = [];
	
	$scope.views.currentPage = 1;
	
	list();
	
	function list() {
	
		$scope.currentPage = $scope.views.currentPage;
		$scope.pageSize = 3;
		$scope.maxSize = 3;
	
		$http({
		  method: 'GET',
		  url: 'handlers/users/users.php'
		}).then(function mySucces(response) {

			$scope.users = angular.copy(response.data);
			
			$scope.filterData = $scope.users; // for pagination
			$scope.currentPage = $scope.views.currentPage; // for pagination 					
			$(function () {
			  $('[data-toggle="tooltip"]').tooltip();
			});	
			
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
				
				growl.show('alert alert-danger alert-solid',{from: 'top', amount: 55},'User info successfully deleted.');
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

	$scope.addUser = function() {
		
			if (!access.has($scope,$scope.profile.groups,$scope.module.id,$scope.module.privileges.add)) return;
		
		$window.location.href = "user.html#!/add/user";

	};
	
});

app.filter('pagination', function() {
	  return function(input, currentPage, pageSize) {
	    if(angular.isArray(input)) {
	      var start = (currentPage-1)*pageSize;
	      var end = currentPage*pageSize;
	      return input.slice(start, end);
	    }
	  };
});