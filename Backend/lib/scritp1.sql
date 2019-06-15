/*!40000 ALTER TABLE `actor_pelicula` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competencias`
--

DROP TABLE IF EXISTS `competencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `competencias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `director_id` int(11) unsigned NOT NULL DEFAULT '0',
  `actor_id` int(11) unsigned NOT NULL DEFAULT '0',
  `genero_id` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competencias`
--

LOCK TABLES `competencias` WRITE;
/*!40000 ALTER TABLE `competencias` DISABLE KEYS */;
/*!40000 ALTER TABLE `competencias` ENABLE KEYS */;


UNLOCK TABLES;

--
-- Table structure for table `peli_votada`
--

DROP TABLE IF EXISTS `peli_votada`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `peli_votada` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `competencia` int(11) NOT NULL,
  `voto` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `competenciafk_idx` (`competencia`),
  CONSTRAINT `competenciafk` FOREIGN KEY (`competencia`) REFERENCES `competencias` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `peli_votada`
--

LOCK TABLES `peli_votada` WRITE;
/*!40000 ALTER TABLE `peli_votada` DISABLE KEYS */;
/*!40000 ALTER TABLE `peli_votada` ENABLE KEYS */;