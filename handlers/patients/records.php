<?php

require_once '../../db.php';

$con = new pdo_db("medical_records");

$records = $con->all(["id","opd_no","department","(SELECT CONCAT(users.first_name, ' ', users.last_name) FROM users WHERE users.id = medical_records.physician) physician","date"]);

echo json_encode($records);

?>