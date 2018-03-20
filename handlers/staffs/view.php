<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("users");

$user = $con->get(array("id"=>$_POST['id']));

echo json_encode($user[0]);

?>