<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db($_POST['table']);

$con->query("SET FOREIGN_KEY_CHECKS = 0;");

$restore = $con->insertData($_POST['data']);

$con->query("SET FOREIGN_KEY_CHECKS = 1;");

?>