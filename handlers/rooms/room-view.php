<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

session_start();

$con = new pdo_db();

$room = $con->getData("SELECT * FROM rooms WHERE id = $_POST[id]");

<<<<<<< HEAD
$room_nos = $con->getData("SELECT * FROM room_nos WHERE room_no_id = ".$room[0]['id']);

foreach ($room_nos as $i => $rn) {
	
	$room_nos[$i]['disabled'] = true;
	
};

$room[0]['room_nos'] = $room_nos;
$room[0]['dels'] = [];

=======
>>>>>>> origin/jp
header("Content-Type: application/json");
echo json_encode($room[0]);

?>