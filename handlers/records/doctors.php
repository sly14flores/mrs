<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("users");

$doctors = $con->get(array("user_group"=>"'Doctor'"),["id","CONCAT(first_name, ' ', last_name) fullname"]);

echo json_encode($doctors);

?>