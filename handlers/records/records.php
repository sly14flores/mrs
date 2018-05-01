<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("records");

$doctors = $con->get(array("patient_id"=>$_POST['patient_id']),["*","(SELECT CONCAT(users.first_name, ' ', users.last_name) FROM users WHERE users.id = records.physician) physician"]);

echo json_encode($doctors);

?>