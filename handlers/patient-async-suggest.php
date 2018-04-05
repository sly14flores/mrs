<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

session_start();

$con = new pdo_db("patients");

$filter = (isset($_POST['filter']))?" WHERE CONCAT(last_name, ', ', first_name, ' ', middle_name) LIKE '%".$_POST['filter']."%'":"";

$patients = $con->getData("SELECT id, CONCAT(last_name, ', ', first_name, ' ', middle_name) fullname FROM patients".$filter);

echo json_encode($patients);

?>