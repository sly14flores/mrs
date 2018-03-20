angular.module('bootstrap-growl', []).factory('growl',function() {
	
	function growl() {
		
		var self = this;
		
		self.show = function(type = 'success',offset,content) {
			
			$.bootstrapGrowl(content, {
				type: type,
				offset: offset,
				align: 'right',
				width: 'auto',
				allow_dismiss: true,
                stackup_spacing: 30				
			});			
			
		};
		
	}
	
	return new growl();
	
});