<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("records");

$records = $con->getData("SELECT *, DATE_FORMAT(date, '%M %d, %Y') date, (SELECT CONCAT(users.first_name, ' ', users.last_name) FROM users WHERE users.id = records.physician) physician FROM records WHERE patient_id = ".$_POST['patient_id']." AND department = 'Out-Patient'");

echo json_encode($records);

?>