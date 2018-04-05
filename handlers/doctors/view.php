<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("users");

$user = $con->get(array("id"=>$_POST['id']));

$province = $con->getData("SELECT * FROM provinces WHERE province_id = ".$user[0]['province']);
$user[0]['province'] = $province[0];

$municipality = $con->getData("SELECT * FROM municipalities WHERE municipality_id = ".$user[0]['city']);
$user[0]['city'] = $municipality[0];

$barangay = $con->getData("SELECT * FROM barangays WHERE barangay_id = ".$user[0]['barangay']);
$user[0]['barangay'] = $barangay[0];

echo json_encode($user[0]);

?>