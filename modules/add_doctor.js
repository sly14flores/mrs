angular.module('app-module', ['bootstrap-modal','form-validator','bootstrap-growl','ngRoute','module-access','ui.bootstrap']).config(function($routeProvider) {
    $routeProvider
        .when('/:option/:id', {
            templateUrl: 'add_doctor.html'
        });
}).factory('app', function($http,$window,$routeParams,$location,$timeout,validate,growl,bootstrapModal,access) {

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
			
			scope.doctor = {};
			scope.doctor.id = 0;		

			$timeout(function() {

				switch ($routeParams.option) {					
					
					case 'add':
			
						scope.controls.btns.add = true;
						scope.controls.btns.edit = false;
						scope.controls.btns.ok = false;
						scope.controls.btns.cancel = false;
						scope.controls.show.add = false;
						scope.controls.show.edit = false;
						scope.views.option = 'Add Doctor';			

					break;	
					
					case 'view':

						if ($routeParams.id != undefined) {				
							self.load(scope,$routeParams.id);
							scope.controls.btns.add = true;
							scope.controls.btns.edit = true;
							scope.controls.btns.cancel = false;
							scope.controls.show.add = false;
							scope.controls.show.edit = true;
							scope.controls.label.ok = 'Update';
							scope.controls.label.cancel = 'Close';
							scope.views.option = 'Modify Doctor';
						};				

					break;					

				}

			}, 1000);
			
		

		};

		self.add = function(scope) {
		if (!access.has(scope,scope.profile.groups,scope.module.id,scope.module.privileges.add)) return;
			$routeParams.option = undefined;
			
			scope.doctor = {};
			scope.doctor.id = 0;			

			scope.controls.btns.ok = false;
			scope.controls.btns.cancel = false;	
			scope.controls.btns.edit = false;
			scope.views.option = 'Add Doctor';			

		};

		self.cancel = function(scope) {

			$window.location.href = 'all_doctors.html';

		};

		self.save = function(scope) {

			if (validate.form(scope,'doctor')) { 
			growl.show('alert alert-danger alert-solid',{from: 'top', amount: 55},'Please complete required fields.');
			return;
			}
			
			$http({
			  method: 'POST',
			  url: 'handlers/doctors/save.php',
			  data: scope.doctor
			}).then(function mySucces(response) {
				
				scope.controls.btns.ok = true;
				scope.controls.btns.cancel = false;
				scope.controls.label.cancel = 'Close';
				
				
				if ($routeParams.option==undefined) growl.show('alert alert-success alert-solid',{from: 'top', amount: 55},'New doctor successfully added.');
				else growl.show('alert alert-success alert-solid',{from: 'top', amount: 55},'Doctor info successfully updated.');
				
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
			  url: 'handlers/doctors/view.php',
			  data: {id: id}
			}).then(function mySucces(response) {
				
				scope.doctor = angular.copy(response.data);
				scope.doctor.date_of_birth = new Date(scope.doctor.date_of_birth);
				
			}, function myError(response) {
				
			});			
			
		};
		
		self.birthday = function(scope) {
			
			if (scope.doctor.date_of_birth == null) return;
			scope.doctor.age = getAge(scope.doctor.date_of_birth); //for birthday autocompute

		};
		
		self.provinceSelect = function($item, scope) {
			
			scope.doctor.province = $item;
			scope.municipalities = $item.municipalities;
		};
		
		self.municipalitySelect = function($item, scope) {
			
			scope.doctor.city = $item;
			scope.barangays = $item.barangays;
		};
		
		self.barangaySelect = function($item, scope) {
			
			scope.doctor.barangay = $item;
			
		};

	};
	
	return new app();
	
});