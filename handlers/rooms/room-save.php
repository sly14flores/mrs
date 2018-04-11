<?php

header("Content-Type: application/json");

$_POST = json_decode(file_get_contents('php://input'), true);

include_once '../../db.php';

$con = new pdo_db("rooms");

if ($_POST['room']['id']) {
	
	$room = $con->updateData($_POST['room'],'id');
	
} else {
	
	$room = $con->insertData($_POST['room']);
	echo $con->insertId;

}

?>