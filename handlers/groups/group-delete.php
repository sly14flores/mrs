<?php

header("Content-Type: application/json");

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

session_start();

$con = new pdo_db("groups");

$delete = $con->deleteData(array("group_id"=>implode(",",$_POST['group_id'])));	

?>