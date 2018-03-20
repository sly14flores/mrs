<?php

$_POST = json_decode(file_get_contents('php://input'), true);

$dir_file = "../../backup/mrs.json";

if (($_POST['tableIdx'] == 0) && ($_POST['dataIdx'] == 0)) file_put_contents($dir_file,json_encode($_POST['row']));
else file_put_contents($dir_file,",".json_encode($_POST['row']),FILE_APPEND);

?>