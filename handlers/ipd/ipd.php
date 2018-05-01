<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("patients");

$patient = $con->getData("SELECT id, hospital_no, age, gender, civil_status, CONCAT(last_name, ', ', first_name, ' ', middle_name) fullname, province, city, barangay FROM patients WHERE id = ".$_POST['id']);

$records = $con->getData("SELECT *, DATE_FORMAT(date, '%M %d, %Y') date, (SELECT CONCAT(users.first_name, ' ', users.last_name) FROM users WHERE users.id = records.physician) physician FROM records WHERE records.patient_id = ".$_POST['id']." AND records.department = '".$_POST['department']."'");

$province = $con->getData("SELECT * FROM provinces WHERE province_id = ".$patient[0]['province']);
$patient[0]['province'] = $province[0];

$city = $con->getData("SELECT * FROM municipalities WHERE municipality_id = ".$patient[0]['city']);
$patient[0]['city'] = $city[0];

$barangay = $con->getData("SELECT * FROM barangays WHERE barangay_id = ".$patient[0]['barangay']);
$patient[0]['barangay'] = $barangay[0];

$patient[0]['records'] = $records; 

echo json_encode($patient[0]);

?>