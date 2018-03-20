<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("records");

$other_history = (isset($_POST['record']['other_history']))?$_POST['record']['other_history']:[];
$diagnosis = (isset($_POST['record']['diagnosis']))?$_POST['record']['diagnosis']:[];
$prescriptions = (isset($_POST['record']['prescription']))?$_POST['record']['prescription']:[];
$prescriptionsDels = (isset($_POST['record']['prescriptionDels']))?$_POST['record']['prescriptionDels']:[];
$follow_up = (isset($_POST['record']['follow_up']))?$_POST['record']['follow_up']:[];

if (isset($_POST['record']['other_history'])) unset($_POST['record']['other_history']);
if (isset($_POST['record']['diagnosis'])) unset($_POST['record']['diagnosis']);
if (isset($_POST['record']['prescription'])) unset($_POST['record']['prescription']);
if (isset($_POST['record']['prescriptionDels'])) unset($_POST['record']['prescriptionDels']);
if (isset($_POST['record']['follow_up'])) unset($_POST['record']['follow_up']);

$_POST['record']['date'] = (isset($_POST['record']['date']))?date("Y-m-d",strtotime($_POST['record']['date'])):"1970-01-01";
$_POST['record']['physician'] = $_POST['record']['physician']['id'];

# record
if ($_POST['record']['id']) {

	$con->updateData($_POST['record'],'id');
	$record_id = $_POST['record']['id'];

} else {

	unset($_POST['record']['id']);
	$_POST['record']['patient_id'] = $_POST['id'];
	$con->insertData($_POST['record']);
	$record_id = $con->insertId;

};

# history
if (count($other_history)) {
	
	$con->table = "other_history";
	
	if ($other_history['id']) {

		$con->updateData($other_history,'id');
		
	} else {
	
		unset($other_history['id']);
		$other_history['record_id'] = $record_id;
		$con->insertData($other_history);	
	
	};

};

# diagnosis
if (count($diagnosis)) {
	
	$con->table = "diagnosis";
	
	if ($diagnosis['id']) {

		$con->updateData($diagnosis,'id');
		
	} else {
	
		unset($diagnosis['id']);
		$diagnosis['record_id'] = $record_id;
		$con->insertData($diagnosis);	
	
	};

};

# prescriptions
if (count($prescriptionsDels)) {
	
	$con->table = "prescriptions";	
	
	$deletePrecriptions = array("id"=>implode(",",$prescriptionsDels));

	$con->deleteData($deletePrecriptions);	
	
};

if (count($prescriptions)) {
	
	$con->table = "prescriptions";		
	
	foreach ($prescriptions as $i => $prescription) {
		
		if ($prescription['id']) { # update

			unset($prescription['disabled']);
			unset($prescription['record_id']);
			$con->updateData($prescription,'id');
			
		} else { # insert
			
			unset($prescription['id']);
			unset($prescription['disabled']);
			$prescription['record_id'] = $record_id;
			$con->insertData($prescription);		
			
		};
		
	};	
	
};

# follow_ups
if (count($follow_up)) {
	
	$con->table = "follow_ups";
	
	$follow_up['date'] = (isset($follow_up['date']))?date("Y-m-d",strtotime($follow_up['date'])):"1970-01-01";	
	
	if ($follow_up['id']) {

		$con->updateData($follow_up,'id');
		
	} else {
	
		unset($follow_up['id']);
		$follow_up['record_id'] = $record_id;
		$con->insertData($follow_up);	
	
	};

};

?>