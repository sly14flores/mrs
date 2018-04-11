<?php

require_once '../../db.php';

$con = new pdo_db("users");

$doctors = $con->get(array("groups"=>2),["*","DATE_FORMAT(date_of_birth,'%b %e, %Y') dob"]);

$province = $con->getData("SELECT * FROM provinces WHERE province_id = ".$doctors[0]['province']);
$doctors[0]['province'] = $province[0];

$municipality = $con->getData("SELECT * FROM municipalities WHERE municipality_id = ".$doctors[0]['city']);
$doctors[0]['municipality'] = $municipality[0];

$barangay = $con->getData("SELECT * FROM barangays WHERE barangay_id = ".$doctors[0]['barangay']);
$doctors[0]['barangay'] = $barangay[0];

foreach ($doctors as $i => $doctor) {
	
	foreach ($doctor as $ii => $d) {
		
		$doctors[$i][$ii] = ($d == NULL)?"":$doctors[$i][$ii];
		if ($d == NULL) $doctors[$i][$ii] = "";
		if (gettype($d) == "integer") $doctors[$i][$ii] = (string)$doctors[$i][$ii];

	};

};

echo json_encode($doctors);

?>