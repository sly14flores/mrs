<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

session_start();

$con = new pdo_db();

$users = $con->getData("SELECT id, first_name, last_name, middle_name, username, password, groups, group_id, group_name, group_description FROM groups, users WHERE users.groups = groups.group_id");

header("Content-Type: application/json");
echo json_encode($users);

?>