angular.module('app-module', ['bootstrap-modal','form-validator','bootstrap-growl','ngRoute','record-module','module-access']).config(function($routeProvider) {
    $routeProvider
        .when('/:option/:id', {
            templateUrl: 'add_patient.html'
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
}).factory('app', function($http,$window,$routeParams,$location,$timeout,validate,growl,bootstrapModal,record,access) {

	function app() {

		var self = this;

		self.data = function(scope) {
			
			scope.views = {};
			scope.form = {};
			
			scope.views.option = 'Add Patient';
			
			scope.controls = {
				btns: {
					add: false,
					edit: true,					
					ok: true,
					cancel: true,
					addRecord: true
				},
				show: {
					add: true,
					edit: false,
					editRecord: true
				}
			};
			
			scope.patient = {};
			scope.patient.id = 0;
		
			scope.medical_records = [];

			scope.record = record;		
			
			$timeout(function() {

				switch ($routeParams.option) {			
					
					case 'view':

						if ($routeParams.id != undefined) {
							self.load(scope,$routeParams.id);
							scope.controls.btns.add = true;
							scope.controls.btns.edit = false;
							scope.controls.btns.ok = true;
							scope.controls.btns.cancel = true;
							scope.controls.btns.addRecord = true;
							scope.controls.show.add = false;
							scope.controls.show.edit = true;
							scope.views.option = 'Modify Patient';																	
						};				

					break;					

				}

			},1000);						

		};

		self.add = function(scope) {
		
		if (!access.has(scope,scope.profile.groups,scope.module.id,scope.module.privileges.add)) return;
		
			$routeParams.option = undefined;
			
			scope.patient = {};
			scope.patient.id = 0;

			scope.medical_records = [];

			scope.controls.btns.add = true;
			scope.controls.btns.edit = true;
			scope.controls.btns.ok = false;
			scope.controls.btns.cancel = false;
			scope.controls.btns.addRecord = true;
			scope.controls.show.add = true;
			scope.controls.show.edit = false;
			scope.views.option = 'Add Patient';
			
			scope.record.data(scope);

		};

		self.cancel = function(scope) {	
			
			if ($routeParams.option==undefined) {
				
				scope.views.option = 'Add Patient';				
				
				scope.controls.btns.add = false;
				scope.controls.btns.edit = true;
				scope.controls.btns.ok = true;
				scope.controls.btns.cancel = true;
				scope.controls.btns.addRecord = true;
				scope.controls.show.add = true;
				scope.controls.show.edit = false;		
				
				scope.patient = {};
				scope.patient.id = 0;

				scope.medical_records = [];
				validate.cancel(scope,'patient');

			} else {
				
				scope.views.option = 'Modify Patient';				
				
				scope.controls.btns.add = true;
				scope.controls.btns.edit = false;
				scope.controls.btns.ok = true;
				scope.controls.btns.cancel = true;
				scope.controls.btns.addRecord = true;
				scope.controls.show.add = false;
				scope.controls.show.edit = true;				
				
			};

		};

		self.save = function(scope) {

			if (validate.form(scope,'patient')) return;

			$http({
			  method: 'POST',
			  url: 'handlers/patients/save.php',
			  data: scope.patient
			}).then(function mySucces(response) {
				
				scope.controls.btns.ok = true;
				scope.controls.btns.cancel = true;

				if ($routeParams.option==undefined) {
					growl.show('success',{from: 'top', amount: 55},'New patient successfully added.');
					scope.patient.id = response.data;
					scope.controls.btns.addRecord = false;
					scope.controls.btns.edit = true;					
				} else {
					growl.show('success',{from: 'top', amount: 55},'Patient info successfully updated.');
				};
				
			}, function myError(response) {
				
			});	

		};
		
		self.edit = function(scope) {
			
			scope.controls.btns.add = true;
			scope.controls.btns.edit = false;
			scope.controls.btns.ok = false;
			scope.controls.btns.cancel = false;
			scope.controls.btns.addRecord = false;
			scope.controls.show.add = false;
			scope.controls.show.edit = true;
			
		};
		
		self.load = function(scope,id) {
			
			$http({
			  method: 'POST',
			  url: 'handlers/patients/view.php',
			  data: {id: id}
			}).then(function mySucces(response) {

				scope.patient = angular.copy(response.data);
				scope.patient.date_of_birth = new Date(scope.patient.date_of_birth);
				scope.record.list(scope);

			}, function myError(response) {
				
			});			

		};		

	};

	return new app();

});