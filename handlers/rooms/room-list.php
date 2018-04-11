<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("rooms");

$rooms = $con->getData("SELECT * FROM rooms");

echo json_encode($rooms);

?>