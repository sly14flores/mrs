angular.module('app-module', ['bootstrap-modal','form-validator','bootstrap-growl','ngRoute','module-access']).config(function($routeProvider) {
    $routeProvider
        .when('/:option/:id', {
            templateUrl: 'user.html'
        });
}).factory('app', function($http,$window,$routeParams,$location,$timeout,validate,growl,bootstrapModal,access) {

	function app() {

		var self = this;

		self.data = function(scope) {
			
			scope.views = {};
			scope.form = {};
			
			scope.views.option = 'Add User';
			
			scope.controls = {
				btns: {
					add: true,
					edit: false,					
					ok: true,
					cancel: true
				}
			};
			
			scope.user = {};
			scope.user.id = 0;		
			
			scope.$on('$routeChangeSuccess', function() {

				switch ($routeParams.option) {					
					
					case 'view':

						if ($routeParams.id != undefined) {				
							self.load(scope,$routeParams.id);
							scope.controls.btns.add = true;
							scope.controls.btns.edit = true;
							scope.views.option = 'Modify User';
						};				

					break;					

				}

			});
			
			
			$http({
				method: 'POST',
				url: 'api/suggestions/groups.php'
			}).then(function mySucces(response) {
				
				scope.groups = response.data;
				
			},function myError(response) {
				
			});

		};

		self.add = function(scope) {
			
		if (!access.has(scope,scope.profile.groups,scope.module.id,scope.module.privileges.add)) return;
		
			$routeParams.option = undefined;
			
			scope.user = {};
			scope.user.id = 0;			

			scope.controls.btns.ok = false;
			scope.controls.btns.cancel = false;	
			scope.controls.btns.edit = false;
			scope.views.option = 'Add User';			

		};

		self.cancel = function(scope) {
			
			scope.controls.btns.ok = true;
			scope.controls.btns.cancel = true;
			
			if ($routeParams.option==undefined) {
				scope.user = {};
				scope.user.id = 0;
				validate.cancel(scope,'user');
			};

		};

		self.save = function(scope) {

			if (validate.form(scope,'user')) return;
			
			$http({
			  method: 'POST',
			  url: 'handlers/users/save.php',
			  data: {user: scope.user}
			}).then(function mySucces(response) {
				
				scope.controls.btns.ok = true;
				scope.controls.btns.cancel = true;

				if ($routeParams.option==undefined) growl.show('success',{from: 'top', amount: 55},'New user successfully added.');
				else growl.show('success',{from: 'top', amount: 55},'User info successfully updated.');
				
			}, function myError(response) {
				
			});	
			
		};
		
		self.edit = function(scope) {
			
			scope.controls.btns.ok = false;
			scope.controls.btns.cancel = false;
			
		};
		
		self.load = function(scope,id) {
			
			$http({
			  method: 'POST',
			  url: 'handlers/users/view.php',
			  data: {id: id}
			}).then(function mySucces(response) {
				
				scope.user = angular.copy(response.data);
				
			}, function myError(response) {
				
			});			
			
		};
		

	};
	
	return new app();
	
});