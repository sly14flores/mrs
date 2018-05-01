<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("beds");

$data = $con->getData("SELECT id, description FROM beds WHERE room_no_id = ".$_POST['room_no_id']);

foreach ($data as $i => $d) {
	
	$data[$i]['disabled'] = true;
	
};

$beds = array("data"=>$data,"dels"=>[]);

echo json_encode($beds);

?>