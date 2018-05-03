<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("records");

$insert = $con->insertData(array("opd_no"=>""));

$id = $con->insertId;

$opd_no = STR_PAD((string)$id,4,"0",STR_PAD_LEFT);

$opd = array("id"=>$id,"opd_no"=>$opd_no);

echo json_encode($opd);

?>