angular.module('account-module', ['bootstrap-modal']).directive('dropDown', function() {
	return {
		restrict: 'A',
		template: '<a class="dropdown-item" href="javascript:;" logout-account><i class="fa fa-sign-out"></i> <span>Logout</span></a>'
	};
	
}).directive('accountProfile',function($http) {
	
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			
			$http({
			  method: 'POST',
			  url: 'handlers/account-profile.php'
			}).then(function mySucces(response) {
				
				scope.profile = response.data;
				
			},
			function myError(response) {

			});			
			
		}
	};
		
}).directive('logoutAccount', function($http,$window,bootstrapModal) {
	
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			
			var onOk = function() {
				
				$window.location.href = 'handlers/logout.php';
				
			};
			
			element.bind('click', function() {
					
				bootstrapModal.confirm(scope,'Confirmation','Are you sure you want to logout?',onOk,function() {});

			});
			
		}
		
	};

});