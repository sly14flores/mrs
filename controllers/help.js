var app = angular.module('help',['account-module']);

app.controller('helpCtrl',function($scope) {

	$scope.views = {};
	$scope.views.content = '1.pdf';
	
	$scope.selectContent = function() {

		$('#preview').attr('src',"manuals/"+$scope.views.content);

	};

});