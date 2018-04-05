angular.module('app-module', ['bootstrap-modal','form-validator','bootstrap-growl','ngRoute','record-module','module-access','ui.bootstrap']).config(function($routeProvider) {
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
		
		function getAge(dateString) { //Autocompute birthday to age
			var today = new Date();
			var birthDate = new Date(dateString);
			var age = today.getFullYear() - birthDate.getFullYear();
			var m = today.getMonth() - birthDate.getMonth();
			if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
				age--;
			}
			return age;
		};
		

		var self = this;

		self.data = function(scope) {
			
			scope.views = {};
			scope.form = {};
			
			scope.views.option = '';
			
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
				},
				label: {
					ok: 'Save',
					cancel: 'Cancel'
				}
			};
			
			scope.patient = {};
			scope.patient.id = 0;
		
			scope.medical_records = [];

			scope.record = record;

			$timeout(function() {
				
				$http({
					method: 'POST',
					url: 'api/suggestions/provinces.php'
				}).then(function mySucces(response) {
					
					scope.provinces = response.data;
					scope.municipalities = [];
					scope.barangays = [];
					
				},function myError(response) {
					
				});
			
			}, 1500);
			
			$timeout(function() {
				
				switch ($routeParams.option) {		
					
					case 'add':
					
						scope.controls.btns.add = true;
						scope.controls.btns.edit = true;
						scope.controls.btns.ok = false;
						scope.controls.btns.cancel = false;
						scope.controls.btns.addRecord = true;
						scope.controls.show.add = false;
						scope.controls.show.edit = false;
						scope.views.option = 'Add Patient';					
					
					break;
					
					case 'view':

						if ($routeParams.id != undefined) {
							self.load(scope,$routeParams.id);
							scope.controls.btns.add = true;
							scope.controls.btns.edit = false;
							scope.controls.btns.ok = true;
							scope.controls.btns.cancel = false;
							scope.controls.btns.addRecord = true;
							scope.controls.show.add = false;
							scope.controls.show.edit = true;
							scope.controls.label.ok = 'Update';
							scope.controls.label.cancel = 'Close';
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
			
			$window.location.href = 'all_patients.html';

		};

		self.save = function(scope) {

			if (validate.form(scope,'patient')) { 
			growl.show('alert alert-danger alert-solid',{from: 'top', amount: 55},'Please complete required fields.');
			return;
			}
			
			$http({
			  method: 'POST',
			  url: 'handlers/patients/save.php',
			  data: scope.patient
			}).then(function mySucces(response) {
				
				scope.controls.btns.ok = true;
				scope.controls.btns.cancel = false;
				scope.controls.label.cancel = 'Close';
				
				if ($routeParams.option==undefined) {
					growl.show('alert alert-success alert-solid',{from: 'top', amount: 55},'New patient successfully added.');
					scope.patient.id = response.data;
					scope.controls.btns.addRecord = true;
					scope.controls.btns.edit = true;					
				} else {
					growl.show('alert alert-success alert-solid',{from: 'top', amount: 55},'Patient info successfully updated.');
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

		self.birthday = function(scope) {
			
			if (scope.patient.date_of_birth == null) return;
			scope.patient.age = getAge(scope.patient.date_of_birth); //for birthday autocompute

		};
		
		self.provinceSelect = function($item, scope) {
			
			scope.patient.province = $item;
			scope.municipalities = $item.municipalities;
		};
		
		self.municipalitySelect = function($item, scope) {
			
			scope.patient.city = $item;
			scope.barangays = $item.barangays;
		};
		
		self.barangaySelect = function($item, scope) {
			
			scope.patient.barangay = $item;
		};		

	};

	return new app();

});