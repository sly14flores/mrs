<?php

session_start();

if (isset($_SESSION['id'])) unset($_SESSION['id']);
if (isset($_SESSION['user'])) unset($_SESSION['user']);

echo "Logout Successful";

header("location: ../index.html");

?>