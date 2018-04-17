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
					ok: false,
					cancel: false,					
					add: true,
					edit: true
				},
				label: {
					ok: 'Save',
					cancel: 'Cancel'
				}
			};
			
			// form
			$('#content').load('forms/opd.html');
			$timeout(function() {
				$compile($('#content')[0])(scope);
				self.list(scope);
			}, 200);			
			
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
			
			$http({
			  method: 'POST',
			  url: 'handlers/opd/opd.php',
			  data: {id: patient.id, department: 'Out-Patient'}
			}).then(function mySucces(response) {
				
				scope.patient = angular.copy(response.data);
				self.list(scope);	
				
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
		
		function rooms(scope) {
			
			$http({
			  method: 'GET',
			  url: 'api/suggestions/rooms.php'
			}).then(function mySucces(response) {

				scope.rooms = response.data;

			}, function myError(response) {
				
			});			
			
		};
		
		self.medicalRecord = function(scope,row) {
		if (!access.has(scope,scope.profile.groups,scope.module.id,scope.module.privileges.add)) return	
			if (row == null) { // add				
			;
				scope.opd = {};				
				scope.opd.record = {};
				scope.opd.record.id = 0;
				scope.opd.record.date = new Date();
				scope.opd.record.patient_id = scope.patient_id;				
				scope.opd.record.other_history = {};
				scope.opd.record.other_history.id = 0;
				scope.opd.record.prescription = [];
				scope.opd.record.prescriptionDels = [];
				scope.opd.record.laboratory = [];
				scope.opd.record.laboratoryDels = [];
				scope.opd.record.diagnose = [];
				scope.opd.record.diagnoseDels = [];
				scope.opd.record.follow_up = {};			
				scope.opd.record.follow_up.id = 0;
				
				scope.controls = {
					btns: {
						ok: false,
						cancel: false,					
						add: true,
						edit: true
					},
					label: {
						ok: 'Save',
						cancel: 'Cancel'
					}
				};				

			} else { // edit
			
			 if (!access.has(scope,scope.profile.groups,scope.module.id,scope.module.privileges.edit)) return
			 
				$http({
				  method: 'POST',
				  url: 'handlers/opd/view.php',
				  data: {record_id: row.id},
				}).then(function mySucces(response) {
					
					scope.opd = {};
					scope.opd.record = angular.copy(response.data);
					scope.opd.record.date = new Date(response.data.date);
					scope.opd.record.follow_up.date = new Date(response.data.follow_up.date);					
					
				}, function myError(response) {
					
				});

				scope.controls = {
					btns: {
						ok: true,
						cancel: false,					
						add: true,
						edit: false
					},
					label: {
						ok: 'Update',
						cancel: 'Close'
					}
				};				
				
			};

			doctors(scope);
			rooms(scope);
			
			$('#opd-records').html('Please wait...');
			
			$('#opd-records').load('html/opd.html',function() {
				$timeout(function() { $compile($('#opd-records')[0])(scope); }, 500);
			});

		};
		
		self.edit = function(scope) {

			scope.controls.btns.ok = false;
		};

		self.save = function(scope) {
			
			$http({
			  method: 'POST',
			  url: 'handlers/opd/save.php',
			  data: scope.opd
			}).then(function mySucces(response) {
				
				self.list(scope);
				if (scope.opd.record.id == 0){ 
					growl.show('alert alert-success alert-solid',{from: 'top', amount: 55},'Patient record successfully added.');
				} else{
					growl.show('alert alert-success alert-solid',{from: 'top', amount: 55},'Patient record successfully updated.');
				}
				
			}, function myError(response) {
				
			});
			
		};

		self.list = function(scope) {
			
			$('#opd-records').html('Please wait...');			
			
			if (scope.$id > 2) scope = scope.$parent;
			
			scope.controls = {
				btns: {
					ok: false,
					cancel: false,					
					add: true,
					edit: true
				},
				label: {
					ok: 'Save',
					cancel: 'Cancel'
				}
			};			
			
			$http({
			  method: 'POST',
			  url: 'handlers/opd/records.php',
			  data: {patient_id: scope.patient_id}
			}).then(function mySucces(response) {

				scope.patient.records = angular.copy(response.data);
				
				$('#opd-records').load('lists/opd-records.html');
				$timeout(function() { $compile($('#opd-records')[0])(scope); }, 500);				
	
			}, function myError(response) {
				
			});

			

		};
		
		self.delete = function(scope,row) {			
		if (!access.has(scope,scope.profile.groups,scope.module.id,scope.module.privileges.delete)) return;
			scope.patient_id = row.patient_id;
			
			var onOk = function() {
				
				$http({
					method: 'POST',
					url: 'handlers/records/delete.php',
					data: {id: row.id}
				}).then(function mySuccess(response) {
					
					self.list(scope);
					growl.show('alert alert-danger alert-solid',{from: 'top', amount: 55},'Patient record successfully deleted.');
				}, function myError(response) {

			
				});

			};
			
			var onCancel = function() {
				
			};
			
			bootstrapModal.confirm(scope,'Confirmation','Are you sure you want to delete this record?',onOk,onCancel);						
			
		};
		
		self.prescription = {
			
			add: function(scope) {

				scope.opd.record.prescription.push({
					id: 0,
					record_id: 0,
					medicine: '',
					quantity: 0,
					dosage: '',
					disabled: false
				});

			},
			
			edit: function(scope,row) {
				
				row.disabled = !row.disabled;				
				
			},			
			
			delete: function(scope,row) {
				
				if (row.id > 0) {
					scope.opd.record.prescriptionDels.push(row.id);
				};
				
				var prescriptions = scope.opd.record.prescription;
				var index = scope.opd.record.prescription.indexOf(row);
				scope.opd.record.prescription = [];			
				
				angular.forEach(prescriptions, function(d,i) {
					
					if (index != i) {
						
						delete d['$$hashKey'];
						scope.opd.record.prescription.push(d);
						
					};
					
				});

			}			
			
		};
		
		self.laboratory = {
			
			add: function(scope) {

				scope.opd.record.laboratory.push({
					id: 0,
					record_id: 0,
					lab_type: '',
					lab_remark: '',
					disabled: false
				});

			},
			
			edit: function(scope,row) {
				
				row.disabled = !row.disabled;				
				
			},			
			
			delete: function(scope,row) {
				
				if (row.id > 0) {
					scope.opd.record.laboratoryDels.push(row.id);
				};
				
				var laboratories = scope.opd.record.laboratory;
				var index = scope.opd.record.laboratory.indexOf(row);
				scope.opd.record.laboratory = [];			
				
				angular.forEach(laboratories, function(d,i) {
					
					if (index != i) {
						
						delete d['$$hashKey'];
						scope.opd.record.laboratory.push(d);
						
					};
					
				});

			}			
			
		};
		
		self.diagnose = {
			
			add: function(scope) {

				scope.opd.record.diagnose.push({
					id: 0,
					record_id: 0,
					complaint: '',
					diagnosis: '',
					disabled: false
				});

			},
			
			edit: function(scope,row) {
				
				row.disabled = !row.disabled;				
				
			},			
			
			delete: function(scope,row) {
				
				if (row.id > 0) {
					scope.opd.record.diagnoseDels.push(row.id);
				};
				
				var diagnosis = scope.opd.record.diagnose;
				var index = scope.opd.record.diagnose.indexOf(row);
				scope.opd.record.diagnose = [];			
				
				angular.forEach(diagnosis, function(d,i) {
					
					if (index != i) {
						
						delete d['$$hashKey'];
						scope.opd.record.diagnose.push(d);
						
					};
					
				});

			}			
			
		};
		
		self.cancel = function(scope) {
			
			self.list(scope);
			
		};

	};
	
	return new app();
	
});