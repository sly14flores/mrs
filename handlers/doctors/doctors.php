<?php

require_once '../../db.php';

$con = new pdo_db("users");

$doctors = $con->get(array("groups"=>3),["*","DATE_FORMAT(date_of_birth,'%b %e, %Y') dob"]);

foreach ($doctors as $i => $doctor) {
	
	foreach ($doctor as $ii => $d) {
		
		$doctors[$i][$ii] = ($d == NULL)?"":$doctors[$i][$ii];
		if ($d == NULL) $doctors[$i][$ii] = "";
		if (gettype($d) == "integer") $doctors[$i][$ii] = (string)$doctors[$i][$ii];

	};

};

echo json_encode($doctors);

?>