<?php

$_POST = json_decode(file_get_contents('php://input'), true);

$dir = "../../restore";

move_uploaded_file($_FILES['file']['tmp_name'],"$dir/mrs.json");

?>