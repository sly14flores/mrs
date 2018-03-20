<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("users");

$user = $con->get(array("id"=>$_POST['id']));

$group = $con->getData("SELECT group_id, group_description FROM groups WHERE group_id = ".$user[0]['groups']);
$user[0]['groups'] = $group[0];	

echo json_encode($user[0]);

?>