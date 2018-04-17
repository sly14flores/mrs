<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("patients");

$insert = $con->insertData(array("hospital_no"=>""));

$id = $con->insertId;

$hospital_no = STR_PAD((string)$id,4,"0",STR_PAD_LEFT);

$patient = array("id"=>$id,"hospital_no"=>$hospital_no);

echo json_encode($patient);

?>