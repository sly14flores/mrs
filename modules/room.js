angular.module('room-module',['bootstrap-modal','bootstrap-growl']).factory('form', function($compile,$timeout,$http,bootstrapModal,growl) {
	
	function form() {
		
		var self = this;
		
		var loading = '<div class="col-sm-offset-4 col-sm-8"><button type="button" class="btn btn-dark" title="Loading" disabled><i class="fa fa-spinner fa-spin"></i>&nbsp; Please wait...</button></div>';
		
		self.data = function(scope) { // initialize data			
						
			scope.mode = null;
			
			scope.controls = {
				ok: {
					btn: false,
					label: 'Save'
				},
				cancel: {
					btn: false,
					label: 'Cancel'
				},
			};
				
			scope.room = {};
			scope.room.id = 0;
			
			scope.room.room_nos = [];
			scope.room.dels = [];
			
			scope.rooms = []; // list
			
			
			
		};

		function validate(scope) {
			
			var controls = scope.formHolder.room.$$controls;
			
			angular.forEach(controls,function(elem,i) {
				
				if (elem.$$attr.$attr.required) elem.$touched = elem.$invalid;
									
			});

			return scope.formHolder.room.$invalid;
			
		};
		
		function mode(scope,row) {
			
			if (row == null) {
				scope.controls.ok.label = 'Save';
				scope.controls.ok.btn = false;
				scope.controls.cancel.label = 'Cancel';
				scope.controls.cancel.btn = false;
			} else {
				scope.controls.ok.label = 'Update';
				scope.controls.ok.btn = true;
				scope.controls.cancel.label = 'Close';
				scope.controls.cancel.btn = false;				
			}
			
		};	
		
		self.room = function(scope,row) {	
		
			scope.room = {};
			scope.room.id = 0;
			
			scope.room.room_nos = [];
			scope.room.dels = [];
			
			mode(scope,row);
			
			$('#x_content').html(loading);
			$('#x_content').load('forms/room.html',function() {
				$timeout(function() { $compile($('#x_content')[0])(scope); },200);
			});
			
			if (row != null) {
				
				if (scope.$id > 2) scope = scope.$parent;				
				$http({
				  method: 'POST',
				  url: 'handlers/rooms/room-view.php',
				  data: {id: row.id}
				}).then(function mySucces(response) {
					
					angular.copy(response.data, scope.room);
					
				}, function myError(response) {
				  // error
				});
					 
			}; //row
		
			
		};		
		
		self.edit = function(scope) {
			
			scope.controls.ok.btn = !scope.controls.ok.btn;
			
		};
		
		self.save = function(scope) {
			
			if (validate(scope)) {
				
				growl.show('alert alert-danger alert-solid',{from: 'top', amount: 55},'Please complete required fields.');
				return;
			
			}
		
			$http({
			  method: 'POST',
			  url: 'handlers/rooms/room-save.php',
			  data: {room: scope.room}
			}).then(function mySucces(response) {
				
				if (scope.room.id == 0) {
					scope.room.id = response.data;
					growl.show('alert alert-success alert-solid',{from: 'top', amount: 55},'Room Information successfully added.');
				} else {					
					growl.show('alert alert-success alert-solid',{from: 'top', amount: 55},'Room Information successfully updated.');
				}
					
				self.list(scope);
				mode(scope,scope.room);
				
			}, function myError(response) {
				 
			  // error
				
			});			
			
		};		
		
		self.delete = function(scope,row) {
			
		var onOk = function() {
			
			if (scope.$id > 2) scope = scope.$parent;			
			
			$http({
			  method: 'POST',
			  url: 'handlers/rooms/room-delete.php',
			  data: {id: [row.id]}
			}).then(function mySucces(response) {

				self.list(scope);
				
				growl.show('alert alert-danger alert-solid',{from: 'top', amount: 55},'Room Information successfully deleted.');
				
			}, function myError(response) {
				 
			  // error
				
			});

		};

		bootstrapModal.confirm(scope,'Confirmation','Are you sure you want to delete this record?',onOk,function() {});
			
		};
		
		self.list = function(scope) {

			scope.room = {};
			scope.room.id = 0;
			
			$http({
			  method: 'POST',
			  url: 'handlers/rooms/room-list.php',
			}).then(function mySucces(response) {
				
				scope.rooms = response.data;
				
			}, function myError(response) {
				 
			  // error
				
			});
			
			$('#x_content').html(loading);
			$('#x_content').load('lists/rooms.html', function() {
				$timeout(function() { $compile($('#x_content')[0])(scope); },500);								
				// instantiate datable
				$timeout(function() {
					$('#rooms').dataTable({
						ordering: false,
						processing: true,
						columnDefs: [{}]
					});	
				},1000);
				
			});				
			
		};	
		
		self.addNewChoice = function(scope) {
			
			scope.room.room_nos.push({id:0,room_number:'',disabled:false});
			
		};
		  
		self.removeChoice = function(scope,row) {

			if (row.id > 0) {
				scope.room.dels.push(row.id);
			};

			var room_nos = scope.room.room_nos;
			
			var index = scope.room.room_nos.indexOf(row);
			
			scope.room.room_nos = [];
			
			angular.forEach(room_nos, function(d,i) {
			
				if (index != i) {
					
					delete d['$$hashKey'];
					scope.room.room_nos.push(d);
					
				};
			
			});
	  
		};
		
		self.bedsForm = function(scope,room_no) {
			
			scope.beds = {};
			scope.beds.data = [];
			scope.beds.dels = [];
			
			$http({
			  method: 'POST',
			  url: 'handlers/beds/beds.php',
			  data: {room_no_id: room_no.id}
			}).then(function mySucces(response) {
				
				scope.beds = angular.copy(response.data);
				
			}, function myError(response) {
				 
			  // error
				
			});				
			
			var onOk = function() {
				
				bedsSave(scope,room_no);
				
			};
			
			bootstrapModal.box(scope,'Beds','dialogs/beds.html',onOk);
			
		};
		
		function bedsSave(scope,room_no) {
			
			$http({
			  method: 'POST',
			  url: 'handlers/beds/save.php',
			  data: {room_no_id: room_no.id, beds: scope.beds}
			}).then(function mySucces(response) {
				
				scope.beds = angular.copy(response.data);
				growl.show('alert alert-success alert-solid',{from: 'top', amount: 55},'Bed Information successfully updated.');
				
			}, function myError(response) {
				 
			  // error
				
			});			
			
		};
		
		self.beds = {
			
			add: function(scope) {
				
				scope.beds.data.push({id:0,description:'',disabled:false});				
				
			},
			
			remove: function(scope,row) {
				
				if (row.id > 0) {
					scope.beds.dels.push(row.id);
				};

				var beds = scope.beds.data;
				
				var index = scope.beds.data.indexOf(row);
				
				scope.beds.data = [];
				
				angular.forEach(beds, function(d,i) {
				
					if (index != i) {
						
						delete d['$$hashKey'];
						scope.beds.data.push(d);
						
					};
				
				});	
				
			}
			
		};
		
	};
	
	return new form();
	
});