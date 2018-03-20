<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("users");

$_POST['date_of_birth'] = date("Y-m-d",strtotime($_POST['date_of_birth']));
$_POST['user_group'] = "Doctor";

if ($_POST['id']) { # update

	$update = $con->updateData($_POST,'id');
	
} else { # inserts

	unset($_POST['id']);
	$insert = $con->insertData($_POST);
	
}

?>