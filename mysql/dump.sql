-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 22, 2021 at 05:46 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `devops_vuelos`
--

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `phone_code` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`id`, `name`, `phone_code`) VALUES
(6, 'Argentina', 54),
(4, 'China', 86),
(3, 'España', 34),
(2, 'Estados Unidos', 1),
(1, 'México', 52),
(5, 'Rusia', 7);

-- --------------------------------------------------------

--
-- Table structure for table `flights`
--

CREATE TABLE `flights` (
  `id` int(11) NOT NULL,
  `estimatedHours` int(11) NOT NULL,
  `takeOffSiteId` int(11) DEFAULT NULL,
  `landingSiteId` int(11) DEFAULT NULL,
  `date` varchar(15) NOT NULL,
  `hour` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `flights`
--

INSERT INTO `flights` (`id`, `estimatedHours`, `takeOffSiteId`, `landingSiteId`, `date`, `hour`) VALUES
(8, 8, 2, 1, '2022-10-25', '10:35');

-- --------------------------------------------------------

--
-- Table structure for table `flight_classes`
--

CREATE TABLE `flight_classes` (
  `id` int(11) NOT NULL,
  `cabinClass` enum('0','1','2','3') NOT NULL DEFAULT '0',
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `flight_classes`
--

INSERT INTO `flight_classes` (`id`, `cabinClass`, `price`) VALUES
(1, '0', 150),
(2, '1', 300);

-- --------------------------------------------------------

--
-- Table structure for table `flight_tickets`
--

CREATE TABLE `flight_tickets` (
  `id` int(11) NOT NULL,
  `passengers` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `flightId` int(11) DEFAULT NULL,
  `flightClassId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sities`
--

CREATE TABLE `sities` (
  `id` int(11) NOT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `countryId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sities`
--

INSERT INTO `sities` (`id`, `city`, `state`, `countryId`) VALUES
(1, 'Mérida', 'Yucatán', 1),
(2, 'Valladolid', 'Yucatán', 1),
(3, 'Caucel', 'Yucatán', 1),
(4, 'Santa Rosa', 'La Pampa', 6);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `balance` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_b8b1c8a8e5f224441739882de1` (`name`,`phone_code`);

--
-- Indexes for table `flights`
--
ALTER TABLE `flights`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_c18cff61e0b9ebe7d1835d1e2b` (`date`,`hour`),
  ADD KEY `FK_989d7af5119d03fc41ba5cec090` (`takeOffSiteId`),
  ADD KEY `FK_f2835ca09d1032e16d27f6314f9` (`landingSiteId`);

--
-- Indexes for table `flight_classes`
--
ALTER TABLE `flight_classes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_45d5ef39fc1e514cc09a1031c5` (`cabinClass`);

--
-- Indexes for table `flight_tickets`
--
ALTER TABLE `flight_tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_2dcb922d01510a20ecd25584f26` (`userId`),
  ADD KEY `FK_a240577c5de82bfc7451e87c6b8` (`flightId`),
  ADD KEY `FK_19df51b4a8846e79b3b12c864a4` (`flightClassId`);

--
-- Indexes for table `sities`
--
ALTER TABLE `sities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_350d1215c3ad06a9eb76f9117b` (`city`,`state`),
  ADD KEY `FK_7eee898e38204d09bb60b6bc741` (`countryId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `flights`
--
ALTER TABLE `flights`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `flight_classes`
--
ALTER TABLE `flight_classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `flight_tickets`
--
ALTER TABLE `flight_tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `sities`
--
ALTER TABLE `sities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `flights`
--
ALTER TABLE `flights`
  ADD CONSTRAINT `FK_989d7af5119d03fc41ba5cec090` FOREIGN KEY (`takeOffSiteId`) REFERENCES `sities` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_f2835ca09d1032e16d27f6314f9` FOREIGN KEY (`landingSiteId`) REFERENCES `sities` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `flight_tickets`
--
ALTER TABLE `flight_tickets`
  ADD CONSTRAINT `FK_19df51b4a8846e79b3b12c864a4` FOREIGN KEY (`flightClassId`) REFERENCES `flight_classes` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_2dcb922d01510a20ecd25584f26` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_a240577c5de82bfc7451e87c6b8` FOREIGN KEY (`flightId`) REFERENCES `flights` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `sities`
--
ALTER TABLE `sities`
  ADD CONSTRAINT `FK_7eee898e38204d09bb60b6bc741` FOREIGN KEY (`countryId`) REFERENCES `countries` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
