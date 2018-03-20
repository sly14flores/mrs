var app = angular.module('backupRestore',['account-module','bootstrap-modal','bootstrap-growl']);

app.controller('backupRestoreCtrl',function($scope,$http,$window,$timeout,$compile,fileUpload,bootstrapModal,growl) {

	$scope.views = {};	

	$scope.monitor = {

		success: function(e,msg,clear) {

			if (clear) $(e).html('');			
			$(e).append('<span class="success-response">'+msg+'</span>');
			$(e).scrollTop(($(e)[0]).scrollHeight);			
			
		},
		
		info: function(e,msg,clear) {

			if (clear) $(e).html('');		
			$(e).append('<span class="info-response">'+msg+'</span>');
			$(e).scrollTop(($(e)[0]).scrollHeight);			
		
		},
		
		error: function(e,msg,clear) {
			
			if (clear) $(e).html('');		
			$(e).append('<span class="error-response">'+msg+'</span>');
			$(e).scrollTop(($(e)[0]).scrollHeight);
			
		},
		
		content: function(e,content,clear) {
			
			if (clear) $(e).html(content);
			$(e).append(content);
			$(e).scrollTop(($(e)[0]).scrollHeight);			
			
		}
		
	};
	
	$scope.backup = {
		
		monitor: '#backup-monitor',
		
		i: {table: 0, data: 0},
		
		start: function() {
			
			$scope.backup.i.table = 0;
			$scope.backup.i.data = 0;
			
			$http({
				method: 'GET',
				url: 'handlers/backup/start.php'
			}).then(function success(response) {

				$scope.monitor.info($scope.backup.monitor,'Initializing backup...',true);
				$timeout(function() {
					$scope.backup.tables(response.data);
				}, 500);

			}, function error(response) {
				
				
			});
						
		},

		tables: function(tables) {

			$scope.backup.i.data = 0;			
			$scope.monitor.info($scope.backup.monitor,'Processing backup for '+tables[$scope.backup.i.table].table.name+'...',false);
			$scope.backup.data(tables,tables[$scope.backup.i.table]);			

		},

		data: function(tables,table) {			
			
			backupData(tables,table);
			
			function backupData(tables,table) {

				$scope.monitor.success($scope.backup.monitor,'Processing ('+($scope.backup.i.data+1)+'/'+table.table.data.length+') for '+table.table.name+'...',false);
				
				$http({
					method: 'POST',
					url: 'handlers/backup/backup.php',
					data: {tableIdx: $scope.backup.i.table, dataIdx: $scope.backup.i.data, row: {table: table.table.name, data: table.table.data[$scope.backup.i.data]}}
				}).then(function success(response) {

					++$scope.backup.i.data;

				}, function error(response) {
					
					++$scope.backup.i.data;
					
				});

				
				$timeout(function() {		
					
					if ($scope.backup.i.data < table.table.data.length) {						
						
						$timeout(function() {
							backupData(tables,tables[$scope.backup.i.table]);
						}, 100);

					} else {			
						
						++$scope.backup.i.table;
						
						$timeout(function() {

							if ($scope.backup.i.table < tables.length) {
								
								$scope.backup.tables(tables);
								
							} else {
								
								$scope.monitor.content($scope.backup.monitor,'<div style="margin: 10px 0;"><button class="btn btn-primary"><a download href="backup/mrs.json">Download</a></button></div>',false);
								
							};

						}, 100);					

					};
					
				}, 200);				
				
			};

		}
		
	};
	
	$scope.restore = {

		monitor: '#restore-monitor',
		
		i: 0,

		file: function(scope) {
			
			$('#upload-file').click();
			
		},

		start: function() {
			
			var sqlFile = $scope.sqlFile;
			
			if (sqlFile == null) {
				$scope.monitor.error($scope.restore.monitor,'No file selected.',false);							
				return;
			};

			var fn = sqlFile['name'];
			var en = fn.substring(fn.indexOf("."),fn.length);			

			if (en != ".json") {				
				$scope.monitor.error($scope.restore.monitor,'Invalid file please upload file of json type.',false);
				return;								
			};

			$scope.views.sqlFilename = fn;			

			$scope.monitor.success($scope.restore.monitor,'Uploading {{views.sqlFilename}} ({{views.progress}}%)',false);
			$compile($($scope.restore.monitor)[0])($scope);

			var uploadUrl = "handlers/restore/upload.php";
			fileUpload.uploadFileToUrl(sqlFile, uploadUrl, $scope);	

		},
		
		truncate: function() {
			
			$http({
				method: 'GET',
				url: 'handlers/restore/truncate.php',
			}).then(function success(response) {
				
				$scope.restore.i = 0;
				$scope.monitor.success($scope.restore.monitor,'Initializing restore...',false);
				$scope.restore.process(response.data);
				
			}, function error(response) {
				
			});
			
		},
		
		process: function(restores) {
			console.log(restores);
			restore();

			function restore() {

				$scope.monitor.success($scope.restore.monitor,'Processing restore for '+restores[$scope.restore.i].table+' ('+($scope.restore.i+1)+'/'+restores.length+')...',false);			
			
				$http({
					method: 'POST',
					url: 'handlers/restore/restore.php',
					data: restores[$scope.restore.i]
				}).then(function success(response) {

					++$scope.restore.i;
					$timeout(function() {

						if ($scope.restore.i < restores.length) {
							restore();
						} else {
							$scope.monitor.info($scope.restore.monitor,'Restore completed '+restores[$scope.restore.i-1].table+' ('+($scope.restore.i)+'/'+restores.length+'...',false);								
						};

					}, 200);

				}, function error(response) {

				});

			};

		}

	};
	
});

app.directive('fileModel', function ($parse) {
	
	return {
	   restrict: 'A',
	   link: function(scope, element, attrs) {
		  var model = $parse(attrs.fileModel);
		  var modelSetter = model.assign;
		  
		  element.bind('change', function(){
			  
			scope.$apply(function(){
				modelSetter(scope, element[0].files[0]);
			});
			 
		  });

	   }
	};

});

app.service('fileUpload', function () {
	
	this.uploadFileToUrl = function(file, uploadUrl, scope) {
		
	   var fd = new FormData();
	   fd.append('file', file);
	
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", uploadProgress, false);
        xhr.addEventListener("load", uploadComplete, false);
        xhr.open("POST", uploadUrl)
        xhr.send(fd);

		// upload progress
		function uploadProgress(evt) {
			scope.$apply(function(){
				scope.views.progress = 0;			
				if (evt.lengthComputable) {
					scope.views.progress = Math.round(evt.loaded * 100 / evt.total);
				} else {
					scope.views.progress = 'unable to compute';
				}
			});
		}

		function uploadComplete(evt) {
			/* This event is raised when the server send back a response */
			scope.$apply(function() {
				scope.monitor.info(scope.restore.monitor,'Sql file successfully uploaded',false);
			});
			$('#sqlFile').val(null);
			scope.views.sqlFile = null;
			scope.restore.truncate();
		}

	}
	
});