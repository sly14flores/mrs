angular.module('form-validator', ['bootstrap-modal']).factory('validate', function() {
	
	function validate() {
	
		var self = this;
	
		self.form = function(scope,form) {
			
			var controls = scope.form[form].$$controls;
			
			angular.forEach(controls,function(elem,i) {
				
				if (elem.$$attr.$attr.required) elem.$touched = elem.$invalid;
									
			});

			return scope.form[form].$invalid;
			
		};

		self.cancel = function(scope,form) {
			
			var controls = scope.form[form].$$controls;
			
			angular.forEach(controls,function(elem,i) {
				
				if (elem.$$attr.$attr.required) elem.$touched = false;
									
			});			
			
		};		
		
	};
	
	return new validate();
	
});