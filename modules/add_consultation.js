angular.module('app-module', ['bootstrap-modal','form-validator','bootstrap-growl','ngRoute']).config(function($routeProvider) {
    $routeProvider
        .when('/:option/:id', {
            templateUrl: 'add_consultation.html'
        });
}).factory('app', function($http,$window,$routeParams,$location,$timeout,validate,growl,bootstrapModal) {

	function app() {

		var self = this;

		self.data = function(scope) {
			
			scope.views = {};
			scope.form = {};
			
			scope.views.option = 'Add Consultation';
			
			scope.controls = {
				btns: {
					add: true,
					edit: false,					
					ok: true,
					cancel: true
				}
			};
			
			scope.consultation = {};
			scope.consultation.id = 0;		

			$timeout(function() {

				switch ($routeParams.option) {					
					
					case 'view':

						if ($routeParams.id != undefined) {				
							self.load(scope,$routeParams.id);
							scope.controls.btns.add = true;
							scope.controls.btns.edit = true;
							scope.views.option = 'Modify Consultation';
						};				

					break;					

				}

			}, 1000);

		};

		self.add = function(scope) {

			$routeParams.option = undefined;
			
			scope.consultation = {};
			scope.consultation.id = 0;			

			scope.controls.btns.ok = false;
			scope.controls.btns.cancel = false;	
			scope.controls.btns.edit = false;
			scope.views.option = 'Add Consultation';			

		};

		self.cancel = function(scope) {

			scope.controls.btns.ok = true;
			scope.controls.btns.cancel = true;
			
			if ($routeParams.option==undefined) {
				scope.consultation = {};
				scope.consultation.id = 0;
				validate.cancel(scope,'consultation');
			};

		};

		self.save = function(scope) {

			if (validate.form(scope,'consultation')) return;

			$http({
			  method: 'POST',
			  url: 'handlers/consultations/save.php',
			  data: scope.consultation
			}).then(function mySucces(response) {
				
				scope.controls.btns.ok = true;
				scope.controls.btns.cancel = true;

				if ($routeParams.option==undefined) growl.show('success',{from: 'top', amount: 55},'New consultation successfully added.');
				else growl.show('success',{from: 'top', amount: 55},'Consultation info successfully updated.');
				
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
			  url: 'handlers/consultations/view.php',
			  data: {id: id}
			}).then(function mySucces(response) {
				
				scope.consultation = angular.copy(response.data);
				scope.consultation.date_of_birth = new Date(scope.consultation.date_of_birth);
				
			}, function myError(response) {
				
			});			
			
		};

	};
	
	return new app();
	
});