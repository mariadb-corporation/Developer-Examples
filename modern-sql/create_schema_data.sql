DROP TABLE IF EXISTS `supers`;

CREATE TABLE `supers` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '',
  `alias` varchar(50) NOT NULL DEFAULT '',
  `type` char(1) NOT NULL DEFAULT '',
  `rescues` int(11) NOT NULL,
  `mentor` int(11) DEFAULT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  PRIMARY KEY (`id`),
  PERIOD FOR `date_period` (`startDate`, `endDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `supers` WRITE;

INSERT INTO `supers` (`id`, `name`, `alias`, `type`, `rescues`, `mentor`, `startDate`, `endDate`)
VALUES
	(1,'Bruce Wayne','Batman','H',192,6,'2016-01-01 00:00:00','2020-01-01 00:00:00'),
	(2,'Clark Kent','Superman','H',257,NULL,'2016-01-01 00:00:00','2020-01-01 00:00:00'),
	(3,'Diana Prince','Wonder Woman','H',212,NULL,'2016-01-01 00:00:00','2020-01-01 00:00:00'),
	(4,'Dick Grayson','Robin/Nightwing','H',127,1,'2016-01-01 00:00:00','2020-01-01 00:00:00'),
	(5,'Beast Boy','Gar Logan','H',59,NULL,'2016-01-01 00:00:00','2020-01-01 00:00:00'),
	(6,'Ra\'s Ah Ghul','The Demon\'s Head','V',3,NULL,'2016-06-01 00:00:00','2020-01-01 00:00:00'),
	(7,'Frank Castle','The Punisher','V',37,NULL,'2016-01-01 00:00:00','2020-01-01 00:00:00');

UNLOCK TABLES;


# Dump of table supersteams
# ------------------------------------------------------------

DROP TABLE IF EXISTS `supersteams`;

CREATE TABLE `supersteams` (
  `supersid` int(11) unsigned NOT NULL,
  `teamsid` int(11) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `supersteams` WRITE;

INSERT INTO `supersteams` (`supersid`, `teamsid`)
VALUES
	(1,1),
	(2,1),
	(3,1),
	(4,1),
	(4,2),
	(5,2);

UNLOCK TABLES;


# Dump of table teams
# ------------------------------------------------------------

DROP TABLE IF EXISTS `teams`;

CREATE TABLE `teams` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `teams` WRITE;

INSERT INTO `teams` (`id`, `name`)
VALUES
	(1,'Justice League'),
	(2,'Teen Titans');

UNLOCK TABLES;
