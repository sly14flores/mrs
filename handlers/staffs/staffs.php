<?php

require_once '../../db.php';

$con = new pdo_db("users");

$staffs = $con->get(array("groups"=>3),["*","CONCAT(last_name,',',first_name) fullname","DATE_FORMAT(date_of_birth,'%b %e, %Y') dob"]);

foreach ($staffs as $i => $staff) {
	
	foreach ($staff as $ii => $s) {
		
		$staffs[$i][$ii] = ($s == NULL)?"":$staffs[$i][$ii];
		if ($s == NULL) $staffs[$i][$ii] = "";
		if (gettype($s) == "integer") $staffs[$i][$ii] = (string)$staffs[$i][$ii];		
		
	};
	
};

foreach ($staffs as $key => $rec) {
	
$municipality = $con->getData("SELECT * FROM municipalities WHERE municipality_id = ".$rec['city']);
$staffs[$key]['municipality'] = $municipality[0];

$province = $con->getData("SELECT * FROM provinces WHERE province_id = ".$rec['province']);
$staffs[$key]['province'] = $province[0];

$barangay = $con->getData("SELECT * FROM barangays WHERE barangay_id = ".$rec['barangay']);
$staffs[$key]['barangay'] = $barangay[0];

}

echo json_encode($staffs);

?>