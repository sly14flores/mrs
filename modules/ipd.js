angular.module('app-module', ['bootstrap-modal','form-validator','bootstrap-growl','module-access','ui.bootstrap']).factory('app', function($compile,$http,$window,$timeout,validate,growl,bootstrapModal,access) {

	function app() {

		var self = this;

		self.data = function(scope) {			
			
			scope.patient_id = 0;
			
			scope.patient = {};
			scope.patient.records = [];
			
			patientAsyncSuggest(scope);
			
			scope.controls = {
				btns: {
					add: false,
					edit: true,					
					ok: true,
					cancel: true,
					addRecord: false
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
			
		};
				
		self.selectPatient = function(scope,item) {
			
			patientRecord(scope,item);
			
			scope.patient_id = item.id;

		};
		
		function patientAsyncSuggest(scope) { //filter

			scope.patientAsyncSuggest = function(f) {
				
				return $http({
				  method: 'POST',
				  url: 'handlers/patient-async-suggest.php',
				  data: {filter: f}
				}).then(function mySucces(response) {
					
					return response.data;
					
				},
				function myError(response) {

				});					
				
			};

			scope.patientAsyncSuggest('');

		};
		
		function patientRecord(scope,patient) {
			
			scope.search = '';
			
			$('#content').html('Loading patient info please wait...');
			
			$http({
			  method: 'POST',
			  url: 'handlers/ipd/ipd.php',
			  data: {id: patient.id, department: 'In-Patient'}
			}).then(function mySucces(response) {
				
				$('#content').load('forms/ipd.html');
				scope.patient = angular.copy(response.data);
				
				$timeout(function() {
					$compile($('#content')[0])(scope);
				}, 200);
				
			},
			function myError(response) {

			});						
			
		};
		
		function doctors(scope) {
			
			$http({
			  method: 'GET',
			  url: 'handlers/records/doctors.php'
			}).then(function mySucces(response) {

				scope.doctors = response.data;

			}, function myError(response) {
				
			});			
			
		};
		
		self.medicalRecord = function(scope,row) {
			
			if (row == null) { // add
				
				scope.controls.show.editRecord = false;
				
				scope.ipd = {};				
				scope.ipd.record = {};
				scope.ipd.record.id = 0;
				scope.ipd.record.patient_id = scope.patient_id;				
				scope.ipd.record.other_history = {};
				scope.ipd.record.other_history.id = 0;
				scope.ipd.record.diagnosis = {};
				scope.ipd.record.diagnosis.id = 0;
				scope.ipd.record.prescription = [];
				scope.ipd.record.prescriptionDels = [];
				scope.ipd.record.follow_up = {};			
				scope.ipd.record.follow_up.id = 0;

			} else { // edit
				
				$http({
				  method: 'POST',
				  url: 'handlers/ipd/view.php',
				  data: {record_id: row.id},
				}).then(function mySucces(response) {
					
					scope.ipd = {};
					scope.ipd.record = angular.copy(response.data);
					scope.ipd.record.date = new Date(response.data.date);
					scope.ipd.record.follow_up.date = new Date(response.data.follow_up.date);
					
					scope.controls.show.editRecord = true;

				}, function myError(response) {
					
				});					
				
			};

			doctors(scope);			

			bootstrapModal.box2(scope,'Medical Record','dialogs/ipd.html');

		};
		
		self.save = function(scope) {
			
			$http({
			  method: 'POST',
			  url: 'handlers/ipd/save.php',
			  data: scope.ipd
			}).then(function mySucces(response) {
				
				self.list(scope);
				if (scope.ipd.record.id == 0) growl.show('success',{from: 'top', amount: 55},'Patient record successfully added.');		
				scope.controls.show.editRecord = true;
				
			}, function myError(response) {
				
			});
			
		};

		self.list = function(scope) {
			
			if (scope.$id > 2) scope = scope.$parent;
			
			$http({
			  method: 'POST',
			  url: 'handlers/ipd/records.php',
			  data: {patient_id: scope.patient_id}
			}).then(function mySucces(response) {

				scope.patient.records = angular.copy(response.data);

			}, function myError(response) {
				
			});			

		};
		
		self.delete = function(scope,row) {			
			
			scope.patient_id = row.patient_id;
			
			var onOk = function() {
				
				$http({
					method: 'POST',
					url: 'handlers/records/delete.php',
					data: {id: row.id}
				}).then(function mySuccess(response) {
					
					self.list(scope);
			
				}, function myError(response) {

			
				});

			};
			
			var onCancel = function() {
				
			};
			
			bootstrapModal.confirm(scope,'Confirmation','Are you sure you want to delete this record?',onOk,onCancel);						
			
		};
		
		self.prescription = {
			
			add: function(scope) {

				scope.ipd.record.prescription.push({
					id: 0,
					record_id: 0,
					medicine: '',
					quantity: 0,
					dosage: '',
					disabled: false
				});

			},			
			
			editRecord: function(scope) {
				
				scope.controls.show.editRecord	= !scope.controls.show.editRecord;			
				
			},
			
			edit: function(scope,row) {
				
				row.disabled = !row.disabled;				
				
			},			
			
			delete: function(scope,row) {
				
				if (row.id > 0) {
					scope.ipd.record.prescriptionDels.push(row.id);
				};
				
				var prescriptions = scope.ipd.record.prescription;
				var index = scope.ipd.record.prescription.indexOf(row);
				scope.ipd.record.prescription = [];			
				
				angular.forEach(prescriptions, function(d,i) {
					
					if (index != i) {
						
						delete d['$$hashKey'];
						scope.ipd.record.prescription.push(d);
						
					};
					
				});

			}			
			
		};		

	};
	
	return new app();
	
});