<?php

require_once '../db.php';
require_once '../system_privileges.php';
require_once '../classes.php';

session_start();

$con = new pdo_db("users,groups");

$user = $con->get(["id"=>$_SESSION['id']],["id", "groups", "CONCAT(first_name, ' ', last_name) user"]);

$dir = "pictures/";
$avatar = $dir."avatar-48.png";

$picture = $dir.$user[0]['id'].".jpg";
if (!file_exists("../".$picture)) $picture = $avatar;

$user[0]['picture'] = $picture;

/* $profile = array(
	"user"=>$user[0]['user'],
	"picture"=>$picture
); */

$con->table = "groups";
$group_privileges = $con->get(array("group_id"=>$user[0]['groups']),["privileges"]);

$pages_access = [];
if (count($group_privileges)) {
	if ($group_privileges[0]['privileges']!=NULL) {

		$privileges_obj = new privileges(system_privileges,$group_privileges[0]['privileges']);
		$pages_access = $privileges_obj->getPagesPrivileges();

	};
}

$user[0]['pages_access'] = $pages_access;


echo json_encode($user[0]);

?>