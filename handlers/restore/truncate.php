<?php

require_once '../../db.php';

$con = new pdo_db();

$db_tables = $con->getData("show tables");

$tables = [];

$con->query("SET FOREIGN_KEY_CHECKS = 0;");

foreach ($db_tables as $i => $table) {

	$sql = "TRUNCATE ".$table['Tables_in_'.$con->db_name].";";
	$con->query($sql);

};

$con->query("SET FOREIGN_KEY_CHECKS = 1;");

$dir = "../../restore";

$restore = file_get_contents("$dir/mrs.json");

$restore = "[".$restore."]";

echo $restore;

?>