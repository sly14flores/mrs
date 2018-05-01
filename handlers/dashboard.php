<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db();

$patients = $con->getData("SELECT count(*) no_of_patients FROM patients");
$opd = $con->getData("SELECT count(*) no_of_opd FROM records WHERE department = 'Out-Patient'");
$ipd = $con->getData("SELECT count(*) no_of_ipd FROM records WHERE department = 'In-Patient'");
$doctors = $con->getData("SELECT count(*) no_of_doctors FROM users WHERE groups = 2");

$recent_patients = $con->getData("SELECT CONCAT(patients.last_name, ', ', patients.first_name, ' ', IFNULL(patients.middle_name,'')) fullname FROM records LEFT JOIN patients ON records.patient_id = patients.id WHERE date = '".date("Y-m-d")."'");

$dashboard = array(
	"no_of_patients"=>(count($patients))?$patients[0]['no_of_patients']:0,
	"no_of_opd"=>(count($opd))?$opd[0]['no_of_opd']:0,
	"no_of_ipd"=>(count($ipd))?$ipd[0]['no_of_ipd']:0,
	"no_of_doctors"=>(count($doctors))?$doctors[0]['no_of_doctors']:0,
	"recent_patients"=>(count($recent_patients))?$recent_patients:[],
);

echo json_encode($dashboard);

?>