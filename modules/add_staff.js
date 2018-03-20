angular.module('app-module', ['bootstrap-modal','form-validator','bootstrap-growl','ngRoute']).config(function($routeProvider) {
    $routeProvider
        .when('/:option/:id', {
            templateUrl: 'add_staff.html'
        });
}).directive('restrictTo', function() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var re = RegExp(attrs.restrictTo);
            var exclude = /Backspace|Enter|Tab|Delete|Del|ArrowUp|Up|ArrowDown|Down|ArrowLeft|Left|ArrowRight|Right/;

            element[0].addEventListener('keydown', function(event) {
                if (!exclude.test(event.key) && !re.test(event.key)) {
                    event.preventDefault();
                }
            });
        }
    }
}).factory('app', function($http,$window,$routeParams,$location,$timeout,validate,growl,bootstrapModal) {

	function app() {

		var self = this;

		self.data = function(scope) {
			
			scope.views = {};
			scope.form = {};
			
			scope.views.option = 'Add Staff';
			
			scope.controls = {
				btns: {
					add: true,
					edit: false,					
					ok: true,
					cancel: true
				}
			};
			
			scope.staff = {};
			scope.staff.id = 0;		

			$timeout(function() {

				switch ($routeParams.option) {					
					
					case 'view':

						if ($routeParams.id != undefined) {				
							self.load(scope,$routeParams.id);
							scope.controls.btns.add = true;
							scope.controls.btns.edit = true;
							scope.views.option = 'Modify Staff';
						};				

					break;					

				}

			}, 1000);

		};

		self.add = function(scope) {

			$routeParams.option = undefined;
			
			scope.staff = {};
			scope.staff.id = 0;			

			scope.controls.btns.ok = false;
			scope.controls.btns.cancel = false;	
			scope.controls.btns.edit = false;
			scope.views.option = 'Add Staff';			

		};

		self.cancel = function(scope) {

			scope.controls.btns.ok = true;
			scope.controls.btns.cancel = true;
			
			if ($routeParams.option==undefined) {
				scope.staff = {};
				scope.staff.id = 0;
				validate.cancel(scope,'staff');
			};

		};

		self.save = function(scope) {

			if (validate.form(scope,'staff')) return;

			$http({
			  method: 'POST',
			  url: 'handlers/staffs/save.php',
			  data: scope.staff
			}).then(function mySucces(response) {
				
				scope.controls.btns.ok = true;
				scope.controls.btns.cancel = true;

				if ($routeParams.option==undefined) growl.show('success',{from: 'top', amount: 55},'New staff successfully added.');
				else growl.show('success',{from: 'top', amount: 55},'Staff info successfully updated.');
				
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
			  url: 'handlers/staffs/view.php',
			  data: {id: id}
			}).then(function mySucces(response) {
				
				scope.staff = angular.copy(response.data);
				scope.staff.date_of_birth = new Date(scope.staff.date_of_birth);
				
			}, function myError(response) {
				
			});			
			
		};

	};
	
	return new app();
	
});