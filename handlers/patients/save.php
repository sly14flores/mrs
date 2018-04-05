<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("patients");

$_POST['date_of_birth'] = date("Y-m-d",strtotime($_POST['date_of_birth']));
$_POST['province'] = $_POST['province']['province_id'];
$_POST['city'] = $_POST['city']['municipality_id'];
$_POST['barangay'] = $_POST['barangay']['barangay_id'];

unset($_POST['record']);

if ($_POST['id']) { # update

	$update = $con->updateData($_POST,'id');
	$id = $_POST['id'];	
	
} else { # insert

	unset($_POST['id']);
	$insert = $con->insertData($_POST);
	$id = $con->insertId;	
	
};

echo $id;

?>