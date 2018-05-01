<?php

require_once '../../db.php';

$con = new pdo_db("users");

$doctors = $con->get(array("groups"=>2),["*","DATE_FORMAT(date_of_birth,'%b %e, %Y') dob"]);

foreach ($doctors as $i => $doctor) {
	
	foreach ($doctor as $ii => $d) {
		
		$doctors[$i][$ii] = ($d == NULL)?"":$doctors[$i][$ii];
		if ($d == NULL) $doctors[$i][$ii] = "";
		if (gettype($d) == "integer") $doctors[$i][$ii] = (string)$doctors[$i][$ii];

	};

};

foreach ($doctors as $key => $rec) {
	
$municipality = $con->getData("SELECT * FROM municipalities WHERE municipality_id = ".$rec['city']);
$doctors[$key]['municipality'] = $municipality[0];

$province = $con->getData("SELECT * FROM provinces WHERE province_id = ".$rec['province']);
$doctors[$key]['province'] = $province[0];

$barangay = $con->getData("SELECT * FROM barangays WHERE barangay_id = ".$rec['barangay']);
$doctors[$key]['barangay'] = $barangay[0];

}

echo json_encode($doctors);

?>