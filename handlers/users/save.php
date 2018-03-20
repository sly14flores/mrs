<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("users");

$_POST['user']['groups'] = $_POST['user']['groups']['group_id'];

if ($_POST['user']['id']) { # update

	$update = $con->updateData($_POST['user'],'id');
	
} else { # inserts

	unset($_POST['id']);
	$insert = $con->insertData($_POST['user']);
	
}

?>