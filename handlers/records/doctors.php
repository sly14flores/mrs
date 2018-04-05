<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("users");

<<<<<<< HEAD
$doctors = $con->get(array("groups"=>"'2'"),["id","CONCAT(first_name, ' ', last_name) fullname"]);
=======
$doctors = $con->get(array("groups"=>"'Doctor'"),["id","CONCAT(first_name, ' ', last_name) fullname"]);
>>>>>>> origin/master

echo json_encode($doctors);

?>