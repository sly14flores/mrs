-- phpMyAdmin SQL Dump
-- version 4.5.4.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 05, 2018 at 12:17 PM
-- Server version: 5.7.11
-- PHP Version: 7.0.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mrs`
--

-- --------------------------------------------------------

--
-- Table structure for table `diagnosis`
--

CREATE TABLE `diagnosis` (
  `id` int(11) NOT NULL,
  `record_id` int(11) DEFAULT NULL,
  `complaint` longtext,
  `diagnosis` longtext
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `diagnosis`
--

INSERT INTO `diagnosis` (`id`, `record_id`, `complaint`, `diagnosis`) VALUES
(1, 1, 'ADGS', 'ASGD'),
(2, 2, 'ADGS', 'ASGD');

-- --------------------------------------------------------

--
-- Table structure for table `follow_ups`
--

CREATE TABLE `follow_ups` (
  `id` int(11) NOT NULL,
  `record_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `remarks` varchar(10000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `follow_ups`
--

INSERT INTO `follow_ups` (`id`, `record_id`, `date`, `remarks`) VALUES
(1, 1, '2018-03-12', 'asdgd'),
(2, 2, '2018-03-12', 'asdgd');

-- --------------------------------------------------------

--
-- Table structure for table `other_history`
--

CREATE TABLE `other_history` (
  `id` int(11) NOT NULL,
  `record_id` int(11) DEFAULT NULL,
  `hospital_name` varchar(500) DEFAULT NULL,
  `complaint` longtext,
  `diagnosis` longtext
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `other_history`
--

INSERT INTO `other_history` (`id`, `record_id`, `hospital_name`, `complaint`, `diagnosis`) VALUES
(1, 1, 'LORMA', 'AGD', 'ASDG'),
(2, 2, 'LORMA', 'AGD', 'ASDG');

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id` int(11) NOT NULL,
  `hospital_no` varchar(50) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `birth_place` varchar(100) DEFAULT NULL,
  `gender` varchar(100) DEFAULT NULL,
  `mobile_number` varchar(100) DEFAULT NULL,
  `civil_status` varchar(100) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `nationality` varchar(100) DEFAULT NULL,
  `religion` varchar(100) DEFAULT NULL,
  `occupation` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `hospital_no`, `first_name`, `middle_name`, `last_name`, `date_of_birth`, `age`, `birth_place`, `gender`, `mobile_number`, `civil_status`, `address`, `nationality`, `religion`, `occupation`) VALUES
(1, NULL, 'Reanjan', 'Ragudo', 'Obra', '1995-07-06', 22, 'Luna, La Union', 'Male', '09231576884', 'Female', 'Carisquis, Luna, La Union', 'Filipino', 'Roman Catholic', 'Welder'),
(2, NULL, 'Rose Anne', 'Aquino', 'Balbuena', '1993-03-24', 24, 'Pura Tarlac', 'Female', '09773735195', 'Male', 'Sudipen, La Union', 'Filipino', 'Roman Catholic', 'Doctor');

-- --------------------------------------------------------

--
-- Table structure for table `prescriptions`
--

CREATE TABLE `prescriptions` (
  `id` int(11) NOT NULL,
  `record_id` int(11) DEFAULT NULL,
  `medicine` varchar(10000) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `dosage` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `prescriptions`
--

INSERT INTO `prescriptions` (`id`, `record_id`, `medicine`, `quantity`, `dosage`) VALUES
(1, 1, 'asdgsd', 21, '10'),
(2, 1, 'asdgsd', 28, '15'),
(3, 2, 'asdgsd', 21, '10'),
(4, 2, 'asdgsd', 28, '15');

-- --------------------------------------------------------

--
-- Table structure for table `records`
--

CREATE TABLE `records` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `opd_no` varchar(50) DEFAULT NULL,
  `department` varchar(50) DEFAULT NULL,
  `physician` int(11) DEFAULT NULL,
  `temperature` varchar(50) DEFAULT NULL,
  `height` varchar(50) DEFAULT NULL,
  `weight` varchar(50) DEFAULT NULL,
  `blood_pressure` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `records`
--

INSERT INTO `records` (`id`, `patient_id`, `date`, `opd_no`, `department`, `physician`, `temperature`, `height`, `weight`, `blood_pressure`) VALUES
(1, 2, '2018-03-05', '1', 'Out-Patient', 2, '100', '4', '70', '120/80'),
(2, 2, '2018-03-05', '1', NULL, 2, '100', '4', '70', '120/80');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `gender` varchar(6) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `age` int(100) DEFAULT NULL,
  `birth_place` varchar(200) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `education` varchar(500) DEFAULT NULL,
  `mobile_number` varchar(20) DEFAULT NULL,
  `civil_status` varchar(100) DEFAULT NULL,
  `nationality` varchar(100) DEFAULT NULL,
  `religion` varchar(100) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `specialization` varchar(100) DEFAULT NULL,
  `user_group` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `middle_name`, `last_name`, `gender`, `date_of_birth`, `age`, `birth_place`, `address`, `education`, `mobile_number`, `civil_status`, `nationality`, `religion`, `username`, `password`, `designation`, `specialization`, `user_group`) VALUES
(1, 'Aquilino', 'Yabut', 'Navalta', 'Male', '1995-12-31', 22, 'Luna, La Union', 'Magallanes, Luna, La Union', 'Admin', '09121816445', 'Single', 'Filipino', 'Roman Catholic', 'admin', 'admin', 'Admin', 'Admin', 'Administrator'),
(2, 'Rose Anne', 'Reyes', 'Balbuena', 'Female', '1993-02-03', 24, 'Pura Tarlac', 'Sudipen, La Union', 'MD', '09773735195', 'Male', 'Filipino', 'Roman Catholic', 'rose', 'rose', NULL, 'Obegyne', 'Doctor'),
(3, 'Angeliza', 'Suya', 'Dulay', 'Female', '1997-11-01', 20, 'Aringay, La Union', 'Aringay, La Union', 'BSN', '09773747108', 'Male', 'Filipino', 'Roman Catholic', 'anglzsydly', 'xxsuy', NULL, 'Nurse Aide', 'Staff');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `diagnosis`
--
ALTER TABLE `diagnosis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `record_id` (`record_id`);

--
-- Indexes for table `follow_ups`
--
ALTER TABLE `follow_ups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `record_id` (`record_id`);

--
-- Indexes for table `other_history`
--
ALTER TABLE `other_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `record_id` (`record_id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `record_id` (`record_id`);

--
-- Indexes for table `records`
--
ALTER TABLE `records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `physician` (`physician`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `diagnosis`
--
ALTER TABLE `diagnosis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `follow_ups`
--
ALTER TABLE `follow_ups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `other_history`
--
ALTER TABLE `other_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `prescriptions`
--
ALTER TABLE `prescriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `records`
--
ALTER TABLE `records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `diagnosis`
--
ALTER TABLE `diagnosis`
  ADD CONSTRAINT `diagnosis_ibfk_1` FOREIGN KEY (`record_id`) REFERENCES `records` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `follow_ups`
--
ALTER TABLE `follow_ups`
  ADD CONSTRAINT `follow_ups_ibfk_1` FOREIGN KEY (`record_id`) REFERENCES `records` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `other_history`
--
ALTER TABLE `other_history`
  ADD CONSTRAINT `other_history_ibfk_1` FOREIGN KEY (`record_id`) REFERENCES `records` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD CONSTRAINT `prescriptions_ibfk_1` FOREIGN KEY (`record_id`) REFERENCES `records` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `records`
--
ALTER TABLE `records`
  ADD CONSTRAINT `records_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `records_ibfk_2` FOREIGN KEY (`physician`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
