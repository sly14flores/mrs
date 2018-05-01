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
			$('#content').load('forms/ipd.html');
			$timeout(function() {
				$compile($('#content')[0])(scope);
				self.list(scope);
			}, 200);

			$(function () {
			  $('[data-toggle="tooltip"]').tooltip();
			});			
			
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
				self.list(scope);
				
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
		
		function rooms(scope) {
			
			$http({
				method: 'POST',
				url: 'api/suggestions/rooms.php'
			}).then(function mySucces(response) {
				
				scope.rooms = response.data;
				
			},function myError(response) {
				
			});	
			
		};
		
		self.medicalRecord = function(scope,row) {
		if (!access.has(scope,scope.profile.groups,scope.module.id,scope.module.privileges.add)) return;
		if (scope.patient.id == null){
			growl.show('alert alert-danger alert-solid',{from: 'top', amount: 55},'You have to search first to add record.');
		}
		
		else
		{
			if (row == null) { // add				
				
				scope.ipd = {};				
				scope.ipd.record = {};
				scope.ipd.record.id = 0;
				scope.ipd.record.date = new Date();				
				scope.ipd.record.patient_id = scope.patient_id;				
				scope.ipd.record.other_history = {};
				scope.ipd.record.other_history.id = 0;
				scope.ipd.record.prescription = [];
				scope.ipd.record.prescriptionDels = [];
				scope.ipd.record.laboratory = [];
				scope.ipd.record.laboratoryDels = [];
				scope.ipd.record.diagnose = [];
				scope.ipd.record.diagnoseDels = [];
				scope.ipd.record.follow_up = {};			
				scope.ipd.record.follow_up.id = 0;
				
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
				  url: 'handlers/ipd/view.php',
				  data: {record_id: row.id},
				}).then(function mySucces(response) {
					
					scope.ipd = {};
					scope.ipd.record = angular.copy(response.data);
					scope.ipd.record.date = new Date(response.data.date);
					scope.ipd.record.admission_date = new Date(response.data.admission_date);
					scope.ipd.record.follow_up.date = new Date(response.data.follow_up.date);					
					
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
			
			$('#ipd-records').html('Please wait...');
			
			$('#ipd-records').load('html/ipd.html',function() {
				$timeout(function() { $compile($('#ipd-records')[0])(scope); }, 500);				
			});
		}
		};
		
		self.edit = function(scope) {

			scope.controls.btns.ok = false;
		};

		self.save = function(scope) {
			
			$http({
			  method: 'POST',
			  url: 'handlers/ipd/save.php',
			  data: scope.ipd
			}).then(function mySucces(response) {
				
				self.list(scope);
				if (scope.ipd.record.id == 0){ 
					growl.show('alert alert-success alert-solid',{from: 'top', amount: 55},'Patient record successfully added.');
				} else{
					growl.show('alert alert-success alert-solid',{from: 'top', amount: 55},'Patient record successfully updated.');
				}
				
			}, function myError(response) {
				
			});
			
		};

		self.list = function(scope) {
			
			$('#ipd-records').html('Please wait...');			
			
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
			  url: 'handlers/ipd/records.php',
			  data: {patient_id: scope.patient_id}
			}).then(function mySucces(response) {

				scope.patient.records = angular.copy(response.data);
				
				$('#ipd-records').load('lists/ipd-records.html');
				$timeout(function() { $compile($('#ipd-records')[0])(scope); }, 500);				

			}, function myError(response) {
				
			});

			

		};
		
		self.delete = function(scope,row) {			
		if (!access.has(scope,scope.profile.groups,scope.module.id,scope.module.privileges.delete)) return		
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

				scope.ipd.record.prescription.push({
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
		
		self.laboratory = {
			
			add: function(scope) {

				scope.ipd.record.laboratory.push({
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
					scope.ipd.record.laboratoryDels.push(row.id);
				};
				
				var laboratories = scope.ipd.record.laboratory;
				var index = scope.ipd.record.laboratory.indexOf(row);
				scope.ipd.record.laboratory = [];			
				
				angular.forEach(laboratories, function(d,i) {
					
					if (index != i) {
						
						delete d['$$hashKey'];
						scope.ipd.record.laboratory.push(d);
						
					};
					
				});

			}			
			
		};
		
		self.diagnose = {
			
			add: function(scope) {

				scope.ipd.record.diagnose.push({
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
					scope.ipd.record.diagnoseDels.push(row.id);
				};
				
				var diagnosis = scope.ipd.record.diagnose;
				var index = scope.ipd.record.diagnose.indexOf(row);
				scope.ipd.record.diagnose = [];			
				
				angular.forEach(diagnosis, function(d,i) {
					
					if (index != i) {
						
						delete d['$$hashKey'];
						scope.ipd.record.diagnose.push(d);
						
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