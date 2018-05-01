angular.module('record-module',['bootstrap-modal','bootstrap-growl']).factory('record', function($http,bootstrapModal,growl) {
	
	function record() {
		
		var self = this;
		
		self.data = function(scope) {
			
			scope.patient.record = {};
			scope.patient.record.id = 0;
			scope.patient.record.other_history = {};
			scope.patient.record.other_history.id = 0;
			scope.patient.record.prescription = [];
			scope.patient.record.prescription.dels = [];
			scope.patient.record.laboratory = [];
			scope.patient.record.laboratory.dels = [];
			scope.patient.record.diagnose = [];
			scope.patient.record.diagnose.dels = [];			
			scope.patient.record.follow_up = {};			
			scope.patient.record.follow_up.id = 0;

			scope.controls.show.editRecord = false;
			
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
			
			var departments = {
				"Out-Patient": "opd.html",
				"In-Patient": "ipd.html"
			};
			
			if (scope.controls.btns.addRecord) return;
			
			if (scope.patient.id == 0) {

				growl.show('alert alert-danger alert-solid',{from: 'top', amount: 55},'You have to search one patient info first before you can add record.');				
				return;

			};
			
			if (row == null) { // add
				
				scope.controls.show.editRecord = false;
				
				scope.patient.record = {};
				scope.patient.record.id = 0;
				scope.patient.record.other_history = {};
				scope.patient.record.other_history.id = 0;
				scope.patient.record.prescription = [];
				scope.patient.record.prescriptionDels = [];
				scope.patient.record.laboratory = [];
				scope.patient.record.laboratoryDels = [];
				scope.patient.record.diagnose = [];
				scope.patient.record.diagnoseDels = [];
				scope.patient.record.follow_up = {};			
				scope.patient.record.follow_up.id = 0;

			} else { // edit
				
				$http({
				  method: 'POST',
				  url: 'handlers/records/view.php',
				  data: {record_id: row.id},
				}).then(function mySucces(response) {

					scope.patient.record = angular.copy(response.data);
					scope.patient.record.date = new Date(response.data.date);
					scope.patient.record.follow_up.date = new Date(response.data.follow_up.date);
					scope.patient.record.admission_date = new Date(response.data.admission_date);
					scope.patient.record.discharge_date = new Date(response.data.discharge_date);
					
					scope.controls.show.editRecord = true;

				}, function myError(response) {
					
				});					
				
			};

			doctors(scope);			
			rooms(scope);			

			bootstrapModal.box2(scope,'Medical Record','dialogs/'+departments[row.department]);

		};
		
		self.save = function(scope) {
			
			$http({
			  method: 'POST',
			  url: 'handlers/records/save.php',
			  data: scope.patient
			}).then(function mySucces(response) {
				
				// self.list(scope);
				if (scope.patient.record.id == 0) growl.show('alert alert-success alert-solid',{from: 'top', amount: 55},'Patient record successfully added.');		
				scope.controls.show.editRecord = true;
				
			}, function myError(response) {
				
			});
			
		};

		self.list = function(scope) {
			
			if (scope.$id > 2) scope = scope.$parent;
			
			$http({
			  method: 'POST',
			  url: 'handlers/records/records.php',
			  data: {patient_id: scope.patient.id}
			}).then(function mySucces(response) {

				scope.medical_records = angular.copy(response.data);

			}, function myError(response) {
				
			});			

		};
		
		self.delete = function(scope,row) {
			
			// if (scope.controls.btns.addRecord) return;			
			
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

				scope.patient.record.prescription.push({
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
					scope.patient.record.prescriptionDels.push(row.id);
				};
				
				var prescriptions = scope.patient.record.prescription;
				var index = scope.patient.record.prescription.indexOf(row);
				scope.patient.record.prescription = [];			
				
				angular.forEach(prescriptions, function(d,i) {
					
					if (index != i) {
						
						delete d['$$hashKey'];
						scope.patient.record.prescription.push(d);
						
					};
					
				});

			}			
			
		};

		self.laboratory = {
			
			add: function(scope) {

				scope.patient.record.laboratory.push({
					id: 0,
					record_id: 0,
					lab_type: '',
					lab_remark: '',
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
					scope.patient.record.laboratoryDels.push(row.id);
				};
				
				var laboratories = scope.patient.record.laboratory;
				var index = scope.patient.record.laboratory.indexOf(row);
				scope.patient.record.laboratory = [];			
				
				angular.forEach(laboratories, function(d,i) {
					
					if (index != i) {
						
						delete d['$$hashKey'];
						scope.patient.record.laboratory.push(d);
						
					};
					
				});

			}			
			
		};

		self.diagnose = {
			
			add: function(scope) {

				scope.patient.record.diagnose.push({
					id: 0,
					record_id: 0,
					complaint: '',
					diagnosis: '',
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
					scope.patient.record.diagnoseDels.push(row.id);
				};
				
				var diagnosis = scope.patient.record.diagnose;
				var index = scope.patient.record.diagnose.indexOf(row);
				scope.patient.record.diagnose = [];			
				
				angular.forEach(diagnosis, function(d,i) {
					
					if (index != i) {
						
						delete d['$$hashKey'];
						scope.patient.record.diagnose.push(d);
						
					};
					
				});

			}			
			
		};		

	};
	
	return new record();
	
});