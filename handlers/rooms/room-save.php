<?php

header("Content-Type: application/json");

$_POST = json_decode(file_get_contents('php://input'), true);

include_once '../../db.php';

$con = new pdo_db("rooms");

<<<<<<< HEAD
$room_nos = $_POST['room']['room_nos'];
unset($_POST['room']['room_nos']);

$dels = $_POST['room']['dels'];
unset($_POST['room']['dels']);

if ($_POST['room']['id']) {
	
	$room = $con->updateData($_POST['room'],'id');
	$room_id = $_POST['room']['id'];
=======
if ($_POST['room']['id']) {
	
	$room = $con->updateData($_POST['room'],'id');
>>>>>>> origin/jp
	
} else {
	
	$room = $con->insertData($_POST['room']);
<<<<<<< HEAD
	$room_id = $con->insertId;

}

if (count($dels)) {

	$con->table = "room_nos";
	$delete = $con->deleteData(array("id"=>implode(",",$dels)));		
	
}

if (count($room_nos)) {

	$con->table = "room_nos";
	
	foreach ($room_nos as $index => $value) {
		
		$room_nos[$index]['room_no_id'] = $room_id ;
		unset($room_nos[$index]['disabled']);
		
	}
	
	foreach ($room_nos as $index => $value) {

		if ($value['id']) {
			
			$room_row = $con->updateData($room_nos[$index],'id');
			
		} else {
			
			unset($room_nos[$index]['id']);
			$room_row = $con->insertData($room_nos[$index]);
			
		}
	
	}
	
=======
	echo $con->insertId;

>>>>>>> origin/jp
}

?>