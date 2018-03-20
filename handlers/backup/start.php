<?php

require_once '../../db.php';

$con = new pdo_db();

$db_tables = $con->getData("show tables");

$tables = [];

foreach ($db_tables as $i => $table) {

	$tables[] = array("table"=>array("name"=>$table['Tables_in_'.$con->db_name],"data"=>[]));
	
};

foreach ($tables as $i => $table) {
	
	$con->table = $table['table']['name'];
	$data = $con->all();
	
	$tables[$i]['table']['data'] = $data;
	
}

echo json_encode($tables);

?>