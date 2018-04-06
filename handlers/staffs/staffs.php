<?php

require_once '../../db.php';

$con = new pdo_db("users");

$staffs = $con->get(array("groups"=>3),["*","CONCAT(last_name,',',first_name) fullname","DATE_FORMAT(date_of_birth,'%b %e, %Y') dob"]);

$province = $con->getData("SELECT * FROM provinces WHERE province_id = ".$staffs[0]['province']);
$staffs[0]['province'] = $province[0];

$municipality = $con->getData("SELECT * FROM municipalities WHERE municipality_id = ".$staffs[0]['city']);
$staffs[0]['municipality'] = $municipality[0];

$barangay = $con->getData("SELECT * FROM barangays WHERE barangay_id = ".$staffs[0]['barangay']);
$staffs[0]['barangay'] = $barangay[0];

foreach ($staffs as $i => $staff) {
	
	foreach ($staff as $ii => $s) {
		
		$staffs[$i][$ii] = ($s == NULL)?"":$staffs[$i][$ii];
		if ($s == NULL) $staffs[$i][$ii] = "";
		if (gettype($s) == "integer") $staffs[$i][$ii] = (string)$staffs[$i][$ii];		
		
	};
	
};

echo json_encode($staffs);

?>