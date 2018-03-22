<?php

require_once '../../db.php';

$con = new pdo_db("users");

$staffs = $con->get(array("groups"=>2),["*","CONCAT(last_name,',',first_name) fullname","DATE_FORMAT(date_of_birth,'%b %e, %Y') dob"]);

foreach ($staffs as $i => $staff) {
	
	foreach ($staff as $ii => $s) {
		
		$staffs[$i][$ii] = ($s == NULL)?"":$staffs[$i][$ii];
		if ($s == NULL) $staffs[$i][$ii] = "";
		if (gettype($s) == "integer") $staffs[$i][$ii] = (string)$staffs[$i][$ii];		
		
	};
	
};

echo json_encode($staffs);

?>