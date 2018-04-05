<?php


$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

session_start();

$con = new pdo_db();

$provinces = $con->getData("SELECT province_id, province_description FROM provinces");
 
foreach ($provinces as $key => $province) {

$municipalities = $con->getData("SELECT municipality_id, municipality_description FROM municipalities WHERE municipality_province = ".$province['province_id']);
	
	foreach ($municipalities as $i => $municipality){
		
		$barangays = $con->getData("SELECT barangay_id, barangay_description FROM barangays WHERE barangay_municipality = ".$municipality['municipality_id']);
		$municipalities[$i]['barangays'] = $barangays;
		
	}

$provinces[$key]['municipalities'] = $municipalities;

};

header("Content-Type: application/json");
echo json_encode($provinces);

?>