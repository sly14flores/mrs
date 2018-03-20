<?php

define('system_privileges', array(
	array(
		"id"=>1,
		"description"=>"Dashboard",
		"privileges"=>array( # id=1 must be always page access
			array("id"=>1,"description"=>"Show Dashboard","value"=>false),
		),
	),
	array(
		"id"=>2,
		"description"=>"Accounts",
		"privileges"=>array(
			array("id"=>1,"description"=>"Show User List","value"=>false),
			array("id"=>2,"description"=>"Add User","value"=>false),
			array("id"=>3,"description"=>"Edit User","value"=>false),
			array("id"=>4,"description"=>"Delete User","value"=>false),
		),
	),
	array(
		"id"=>3,
		"description"=>"Doctors",
		"privileges"=>array(
			array("id"=>1,"description"=>"Show Doctors","value"=>false),
			array("id"=>2,"description"=>"Add Doctor","value"=>false),
			array("id"=>3,"description"=>"Edit Doctor","value"=>false),
			array("id"=>4,"description"=>"Delete Doctor","value"=>false),
		),
	),
	array(
		"id"=>4,
		"description"=>"Staffs",
		"privileges"=>array(
			array("id"=>1,"description"=>"Show Staffs","value"=>false),
			array("id"=>2,"description"=>"Add Staff","value"=>false),
			array("id"=>3,"description"=>"Edit Staff","value"=>false),
			array("id"=>4,"description"=>"Delete Staff","value"=>false),
		),
	),
	array(
		"id"=>5,
		"description"=>"Medical Records",
		"privileges"=>array(
			array("id"=>1,"description"=>"Show Patients","value"=>false),
			array("id"=>2,"description"=>"Add Staff","value"=>false),
			array("id"=>3,"description"=>"Edit Staff","value"=>false),
			array("id"=>4,"description"=>"Delete Staff","value"=>false),
		),
	),
	array(
		"id"=>6,
		"description"=>"Reports",
		"privileges"=>array(
			array("id"=>1,"description"=>"Show Reports","value"=>false),
		),
	),
	array(
		"id"=>7,
		"description"=>"Maintenance",
		"privileges"=>array(
			array("id"=>1,"description"=>"Show Maintenance","value"=>false),
		),
	),
	array(
		"id"=>8,
		"description"=>"Help",
		"privileges"=>array(
			array("id"=>1,"description"=>"Show Help","value"=>false),
		),
	),
	
));

?>