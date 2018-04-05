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
			
			scope.views.option = '';
			
			scope.controls = {
				btns: {
					add: true,
					edit: false,					
					ok: true,
					cancel: true
				},
				show: {
					add: true,
					edit: false
				},
				label: {
					ok: 'Save',
					cancel: 'Cancel'
				}
			};
			
			scope.user = {};
			scope.user.id = 0;		
			
			scope.$on('$routeChangeSuccess', function() {

				switch ($routeParams.option) {					
					
					case 'add':
	
						scope.controls.btns.add = true;
						scope.controls.btns.edit = true;
						scope.controls.btns.ok = false;
						scope.controls.btns.cancel = false;
						scope.controls.show.add = false;
						scope.controls.show.edit = false;
						scope.views.option = 'Add User';				

					break;
					
					case 'view':

						if ($routeParams.id != undefined) {				
							self.load(scope,$routeParams.id);
							scope.controls.btns.add = true;
							scope.controls.btns.edit = false;
							scope.controls.btns.cancel = false;
							scope.controls.label.ok = 'Update';
							scope.controls.label.cancel = 'Close';
							scope.controls.show.add = false;
							scope.controls.show.edit = true;
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
<<<<<<< HEAD
	
=======
			
>>>>>>> origin/master
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
			
			$window.location.href = 'users.html';

		};

		self.save = function(scope) {

			if (validate.form(scope,'user')) { 
			growl.show('alert alert-danger alert-solid',{from: 'top', amount: 55},'Please complete required fields.');
			return;
			}
			$http({
			  method: 'POST',
			  url: 'handlers/users/save.php',
			  data: {user: scope.user}
			}).then(function mySucces(response) {
				
				scope.controls.btns.ok = true;
				scope.controls.btns.cancel = false;
				scope.controls.label.cancel = 'Close';

				if ($routeParams.option==undefined) growl.show('alert alert-success alert-solid',{from: 'top', amount: 55},'New user successfully added.');
				else growl.show('alert alert-success alert-solid',{from: 'top', amount: 55},'User info successfully updated.');
				
			}, function myError(response) {
				
			});	
			
		};
		
			 // show password
		  self.inputType = 'password';
		  
		  self.hideShowPassword = function(){
			if (self.inputType == 'password')
				self.inputType = 'text';
			else
			  self.inputType = 'password';
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
	
}).directive('passwordConfirm', ['$parse', function ($parse) {
 return {
    restrict: 'A',
    scope: {
      matchTarget: '=',
    },
    require: 'ngModel',
    link: function link(scope, elem, attrs, ctrl) {
      var validator = function (value) {
        ctrl.$setValidity('match', value === scope.matchTarget);
        return value;
      }
 
      ctrl.$parsers.unshift(validator);
      ctrl.$formatters.push(validator);
      
      // This is to force validator when the original password gets changed
      scope.$watch('matchTarget', function(newval, oldval) {
        validator(ctrl.$viewValue);
      });

    }
  };
}]);

