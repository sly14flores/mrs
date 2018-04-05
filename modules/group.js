angular.module('group-module',['bootstrap-modal','bootstrap-growl']).factory('form', function($compile,$timeout,$http,bootstrapModal,growl) {
	
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
				
			scope.group = {};
			scope.group.group_id = 0;
			
			scope.groups = []; // list
			
			
		};

		function validate(scope) {
			
			var controls = scope.formHolder.group.$$controls;
			
			angular.forEach(controls,function(elem,i) {
				
				if (elem.$$attr.$attr.required) elem.$touched = elem.$invalid;
									
			});

			return scope.formHolder.group.$invalid;
			
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
		
		self.group = function(scope,row) {	
		
			scope.group = {};
			scope.group.group_id = 0;
			
			privileges(scope);	
			
			mode(scope,row);
			
			$('#x_content').html(loading);
			$('#x_content').load('forms/group.html',function() {
				$timeout(function() { $compile($('#x_content')[0])(scope); },200);
			});
			
			if (row != null) {
				
				if (scope.$id > 2) scope = scope.$parent;				
				$http({
				  method: 'POST',
				  url: 'handlers/groups/group-view.php',
				  data: {group_id: row.group_id}
				}).then(function mySucces(response) {
					
					angular.copy(response.data, scope.group);
					privileges(scope);
					
				}, function myError(response) {
				  // error
				});
					
			}; //row
		
			
		};
		
		
		self.edit = function(scope) {
			
			scope.controls.ok.btn = !scope.controls.ok.btn;
			
		};
		
		self.save = function(scope) {
			
			if (validate(scope)){ 
			growl.show('danger',{from: 'top', amount: 55},'Please complete required fields.');
			return;
			}
		
			$http({
			  method: 'POST',
			  url: 'handlers/groups/group-save.php',
			  data: {group: scope.group, privileges: scope.privileges}
			}).then(function mySucces(response) {
				
				if (scope.group.group_id == 0) {
					scope.group.group_id = response.data;
					growl.show('success',{from: 'top', amount: 55},'Group Information successfully added.');
					}	else{
						growl.show('success',{from: 'top', amount: 55},'Group Information successfully updated.');
					}
					mode(scope,scope.group);
				
			}, function myError(response) {
				 
			  // error
				
			});			
			
		};		
		
		self.delete = function(scope,row) {
			
		var onOk = function() {
			
			if (scope.$id > 2) scope = scope.$parent;			
			
			$http({
			  method: 'POST',
			  url: 'handlers/groups/group-delete.php',
			  data: {group_id: [row.group_id]}
			}).then(function mySucces(response) {

				self.list(scope);
				
				growl.show('danger',{from: 'top', amount: 55},'Group Information successfully deleted.');
				
			}, function myError(response) {
				 
			  // error
				
			});

		};

		bootstrapModal.confirm(scope,'Confirmation','Are you sure you want to delete this record?',onOk,function() {});
			
		};
		
		self.list = function(scope) {

			scope.group = {};
			scope.group.group_id = 0;
			
			$http({
			  method: 'POST',
			  url: 'handlers/groups/group-list.php',
			}).then(function mySucces(response) {
				
				scope.groups = response.data;
				
			}, function myError(response) {
				 
			  // error
				
			});
			
			
			$('#x_content').html(loading);
			$('#x_content').load('lists/groups.html', function() {
				$timeout(function() { $compile($('#x_content')[0])(scope); },100);								
				// instantiate datable
				$timeout(function() {
					$('#groups').dataTable({
						"ordering": false,
						"processing": true
					});	
				},200);
				
			});				
			
		};
		
		function privileges(scope) {
			
			$http({
			  method: 'POST',
			  url: 'handlers/privileges.php',
			  data: {id: scope.group.group_id}
			}).then(function mySuccess(response) {
				
				scope.privileges = angular.copy(response.data);
				// iCheckInit();
				
			}, function myError(response) {
				
				//
				
			});				
			
		};		
		
		
	};
	
	return new form();
	
});