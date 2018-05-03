<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("records");

$insert = $con->insertData(array("ipd_no"=>""));

$id = $con->insertId;

$ipd_no = STR_PAD((string)$id,4,"0",STR_PAD_LEFT);

$ipd = array("id"=>$id,"ipd_no"=>$ipd_no);

echo json_encode($ipd);

?>