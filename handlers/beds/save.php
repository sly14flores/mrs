<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("beds");

$beds = $_POST['beds']['data'];
unset($_POST['beds']['data']);

$dels = $_POST['beds']['dels'];
unset($_POST['beds']['dels']);


if (count($dels)) {

	$con->table = "beds";
	$delete = $con->deleteData(array("id"=>implode(",",$dels)));		
	
}

if (count($beds)) {

	$con->table = "beds";
	
	foreach ($beds as $index => $value) {
		
		$beds[$index]['room_no_id'] = $_POST['room_no_id'];
		unset($beds[$index]['disabled']);
		
	}
	
	foreach ($beds as $index => $value) {

		if ($value['id']) {
			
			$room_row = $con->updateData($beds[$index],'id');
			
		} else {
			
			unset($beds[$index]['id']);
			$room_row = $con->insertData($beds[$index]);
			
		}
	
	}
	
}

?>