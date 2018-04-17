<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

session_start();

$con = new pdo_db("patients");

$filter = " WHERE CONCAT(last_name, ', ', first_name, ' ', IFNULL(middle_name,'')) LIKE '%$_POST[filter]%'";

$sql = "SELECT id, CONCAT(last_name, ', ', first_name, ' ', IFNULL(middle_name,'')) fullname FROM patients".$filter;

$patients = $con->getData($sql);

echo json_encode($patients);

?>