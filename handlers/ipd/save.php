<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("records");

$other_history = (isset($_POST['record']['other_history']))?$_POST['record']['other_history']:[];
$prescriptions = (isset($_POST['record']['prescription']))?$_POST['record']['prescription']:[];
$prescriptionsDels = (isset($_POST['record']['prescriptionDels']))?$_POST['record']['prescriptionDels']:[];
$laboratories = (isset($_POST['record']['laboratory']))?$_POST['record']['laboratory']:[];
$laboratoryDels = (isset($_POST['record']['laboratoryDels']))?$_POST['record']['laboratoryDels']:[];
$diagnosis = (isset($_POST['record']['diagnose']))?$_POST['record']['diagnose']:[];
$diagnoseDels = (isset($_POST['record']['diagnoseDels']))?$_POST['record']['diagnoseDels']:[];
$follow_up = (isset($_POST['record']['follow_up']))?$_POST['record']['follow_up']:[];

if (isset($_POST['record']['other_history'])) unset($_POST['record']['other_history']);
if (isset($_POST['record']['prescription'])) unset($_POST['record']['prescription']);
if (isset($_POST['record']['prescriptionDels'])) unset($_POST['record']['prescriptionDels']);
if (isset($_POST['record']['laboratory'])) unset($_POST['record']['laboratory']);
if (isset($_POST['record']['laboratoryDels'])) unset($_POST['record']['laboratoryDels']);
if (isset($_POST['record']['diagnose'])) unset($_POST['record']['diagnose']);
if (isset($_POST['record']['diagnoseDels'])) unset($_POST['record']['diagnoseDels']);
if (isset($_POST['record']['follow_up'])) unset($_POST['record']['follow_up']);

$_POST['record']['date'] = (isset($_POST['record']['date']))?date("Y-m-d",strtotime($_POST['record']['date'])):"1970-01-01";
$_POST['record']['admission_date'] = (isset($_POST['record']['admission_date']))?date("Y-m-d",strtotime($_POST['record']['admission_date'])):"1970-01-01";
<<<<<<< HEAD
=======
$_POST['record']['discharge_date'] = (isset($_POST['record']['discharge_date']))?date("Y-m-d",strtotime($_POST['record']['discharge_date'])):"1970-01-01";
>>>>>>> origin/jp
$_POST['record']['room_type_id'] = $_POST['record']['room_type_id']['id'];
$_POST['record']['physician'] = $_POST['record']['physician']['id'];

$_POST['record']['department'] = "In-Patient";

# record
if ($_POST['record']['id']) {

	$con->updateData($_POST['record'],'id');
	$record_id = $_POST['record']['id'];

} else {

	unset($_POST['record']['id']);
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

# laboratories
if (count($laboratoryDels)) {
	
	$con->table = "laboratories";	
	
	$deleteLab = array("id"=>implode(",",$laboratoryDels));

	$con->deleteData($deleteLab);	
	
};

if (count($laboratories)) {
	
	$con->table = "laboratories";		
	
	foreach ($laboratories as $i => $laboratory) {
		
		if ($laboratory['id']) { # update

			unset($laboratory['disabled']);
			unset($laboratory['record_id']);
			$con->updateData($laboratory,'id');
			
		} else { # insert
			
			unset($laboratory['id']);
			unset($laboratory['disabled']);
			$laboratory['record_id'] = $record_id;
			$con->insertData($laboratory);		
			
		};
		
	};	
	
};

# diagnosis
if (count($diagnoseDels)) {
	
	$con->table = "diagnosis";	
	
	$deleteDig = array("id"=>implode(",",$diagnoseDels));

	$con->deleteData($deleteDig);	
	
};

if (count($diagnosis)) {
	
	$con->table = "diagnosis";		
	
	foreach ($diagnosis as $i => $diagnose) {
		
		if ($diagnose['id']) { # update

			unset($diagnose['disabled']);
			unset($diagnose['record_id']);
			$con->updateData($diagnose,'id');
			
		} else { # insert
			
			unset($diagnose['id']);
			unset($diagnose['disabled']);
			$diagnose['record_id'] = $record_id;
			$con->insertData($diagnose);		
			
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