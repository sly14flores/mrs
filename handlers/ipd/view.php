<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("records");

# record
$record = $con->get(array("id"=>$_POST['record_id']));

$physician = $con->getData("SELECT id, CONCAT(first_name, ' ', last_name) fullname FROM users WHERE id = ".$record[0]['physician']);
$record[0]['physician'] = $physician[0];

# rooms
$room = $con->getData("SELECT * FROM rooms WHERE id = ".$record[0]['room_type_id']);
$record[0]['room_type_id'] = $room[0];

# other history
$other_history = $con->getData("SELECT * FROM other_history WHERE record_id = ".$_POST['record_id']);
$record[0]['other_history'] = $other_history[0];

# prescriptions
$prescriptions = $con->getData("SELECT * FROM prescriptions WHERE record_id = ".$_POST['record_id']);

foreach ($prescriptions as $i => $prescription) {
	
	$prescriptions[$i]['disabled'] = true;
	
};

$record[0]['prescription'] = $prescriptions;
$record[0]['prescriptionDels'] = [];

# laboratories
$laboratories = $con->getData("SELECT * FROM laboratories WHERE record_id = ".$_POST['record_id']);

foreach ($laboratories as $i => $laboratory) {
	
	$laboratories[$i]['disabled'] = true;
	
};

$record[0]['laboratory'] = $laboratories;
$record[0]['laboratoryDels'] = [];


# diagnosis
$diagnosis = $con->getData("SELECT * FROM diagnosis WHERE record_id = ".$_POST['record_id']);

foreach ($diagnosis as $i => $diagnose) {
	
	$diagnosis[$i]['disabled'] = true;
	
};

$record[0]['diagnose'] = $diagnosis;
$record[0]['diagnoseDels'] = [];

# follow up
$follow_up = $con->getData("SELECT * FROM follow_ups WHERE record_id = ".$_POST['record_id']);
$record[0]['follow_up'] = $follow_up[0];

echo json_encode($record[0]);

?>