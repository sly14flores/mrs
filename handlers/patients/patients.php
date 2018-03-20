<?php

require_once '../../db.php';

$con = new pdo_db("patients");

$patients = $con->all(["*","DATE_FORMAT(date_of_birth,'%b %e, %Y') dob"]);

foreach ($patients as $i => $patient) {
	
	foreach ($patient as $ii => $p) {
		
		$patients[$i][$ii] = ($p == NULL)?"":$patients[$i][$ii];
		if ($p == NULL) $patients[$i][$ii] = "";
		if (gettype($p) == "integer") $patients[$i][$ii] = (string)$patients[$i][$ii];
		
	};
	
};

echo json_encode($patients);

?>