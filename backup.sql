-- MySQL dump 10.13  Distrib 8.0.26, for Win64 (x86_64)
--
-- Host: localhost    Database: swasth
-- ------------------------------------------------------
-- Server version	8.0.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `medical_record`
--

DROP TABLE IF EXISTS `medical_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medical_record` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `User_id` int NOT NULL,
  `Record_type_id` int NOT NULL,
  `Details` text,
  `Status` enum('Active','Inactive') NOT NULL,
  `Created_on` datetime NOT NULL,
  `Created_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `User_id` (`User_id`),
  KEY `Record_type_id` (`Record_type_id`),
  CONSTRAINT `medical_record_ibfk_1` FOREIGN KEY (`User_id`) REFERENCES `user` (`Id`),
  CONSTRAINT `medical_record_ibfk_2` FOREIGN KEY (`Record_type_id`) REFERENCES `medical_record_type` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medical_record`
--

LOCK TABLES `medical_record` WRITE;
/*!40000 ALTER TABLE `medical_record` DISABLE KEYS */;
/*!40000 ALTER TABLE `medical_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medical_record_type`
--

DROP TABLE IF EXISTS `medical_record_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medical_record_type` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Record_type` varchar(255) NOT NULL,
  `Status` enum('Active','Inactive') NOT NULL,
  `Created_on` datetime NOT NULL,
  `Created_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medical_record_type`
--

LOCK TABLES `medical_record_type` WRITE;
/*!40000 ALTER TABLE `medical_record_type` DISABLE KEYS */;
INSERT INTO `medical_record_type` VALUES (1,'Symptom','Active','2023-10-10 22:18:36','Admin'),(2,'Test_report','Active','2023-10-10 22:18:36','Admin'),(3,'Prescription','Active','2023-10-10 22:18:36','Admin'),(4,'Medicine','Active','2023-10-10 22:18:36','Admin');
/*!40000 ALTER TABLE `medical_record_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otps`
--

DROP TABLE IF EXISTS `otps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `phoneNumber` varchar(15) NOT NULL,
  `otp` varchar(6) NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otps`
--

LOCK TABLES `otps` WRITE;
/*!40000 ALTER TABLE `otps` DISABLE KEYS */;
INSERT INTO `otps` VALUES (1,'+919667539064','R51iDY','2023-12-13 08:08:16'),(2,'+919667539064','SHASHI','2023-12-13 08:11:20');
/*!40000 ALTER TABLE `otps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `record_files`
--

DROP TABLE IF EXISTS `record_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `record_files` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Medical_record_id` int NOT NULL,
  `File_name` varchar(255) NOT NULL,
  `File_location` varchar(255) NOT NULL,
  `Status` enum('Active','Inactive') NOT NULL,
  `Created_on` datetime NOT NULL,
  `Created_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `Medical_record_id` (`Medical_record_id`),
  CONSTRAINT `record_files_ibfk_1` FOREIGN KEY (`Medical_record_id`) REFERENCES `medical_record` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `record_files`
--

LOCK TABLES `record_files` WRITE;
/*!40000 ALTER TABLE `record_files` DISABLE KEYS */;
/*!40000 ALTER TABLE `record_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Phone` varchar(20) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Address` text,
  `Latitude` decimal(10,6) DEFAULT NULL,
  `Longitude` decimal(10,6) DEFAULT NULL,
  `Status` enum('Active','Inactive') NOT NULL,
  `Created_on` datetime NOT NULL,
  `Created_by` varchar(255) DEFAULT NULL,
  `Updated_on` datetime DEFAULT NULL,
  `Updated_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-19 23:40:35
