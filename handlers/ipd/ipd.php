<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("patients");

$patient = $con->getData("SELECT id, hospital_no, age, gender, civil_status, CONCAT(last_name, ', ', first_name, ' ', middle_name) fullname FROM patients WHERE id = ".$_POST['id']);

$records = $con->getData("SELECT *, DATE_FORMAT(date, '%M %d, %Y') date, (SELECT CONCAT(users.first_name, ' ', users.last_name) FROM users WHERE users.id = records.physician) physician FROM records WHERE records.patient_id = ".$_POST['id']." AND records.department = '".$_POST['department']."'");

$patient[0]['records'] = $records;

echo json_encode($patient[0]);

?>