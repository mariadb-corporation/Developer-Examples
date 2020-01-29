CREATE DATABASE travel;

-- Create syntax for TABLE 'airlines_idb'
CREATE TABLE `airlines_idb` (
  `iata_code` char(2) DEFAULT NULL,
  `airline` varchar(30) DEFAULT NULL,
  UNIQUE KEY `idx_iata_code` (`iata_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create syntax for TABLE 'airports_idb'
CREATE TABLE `airports_idb` (
  `iata_code` char(3) DEFAULT NULL,
  `airport` varchar(80) DEFAULT NULL,
  `city` varchar(30) DEFAULT NULL,
  `state` char(2) DEFAULT NULL,
  `country` varchar(30) DEFAULT NULL,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create syntax for TABLE 'flights_cs'
CREATE TABLE `flights_cs` (
  `year` smallint(6) DEFAULT NULL,
  `month` tinyint(4) DEFAULT NULL,
  `day` tinyint(4) DEFAULT NULL,
  `day_of_week` tinyint(4) DEFAULT NULL,
  `fl_date` date DEFAULT NULL,
  `carrier` char(2) DEFAULT NULL,
  `tail_num` char(6) DEFAULT NULL,
  `fl_num` smallint(6) DEFAULT NULL,
  `origin` varchar(5) DEFAULT NULL,
  `dest` varchar(5) DEFAULT NULL,
  `crs_dep_time` char(4) DEFAULT NULL,
  `dep_time` char(4) DEFAULT NULL,
  `dep_delay` smallint(6) DEFAULT NULL,
  `taxi_out` smallint(6) DEFAULT NULL,
  `wheels_off` char(4) DEFAULT NULL,
  `wheels_on` char(4) DEFAULT NULL,
  `taxi_in` smallint(6) DEFAULT NULL,
  `crs_arr_time` char(4) DEFAULT NULL,
  `arr_time` char(4) DEFAULT NULL,
  `arr_delay` smallint(6) DEFAULT NULL,
  `cancelled` smallint(6) DEFAULT NULL,
  `cancellation_code` smallint(6) DEFAULT NULL,
  `diverted` smallint(6) DEFAULT NULL,
  `crs_elapsed_time` smallint(6) DEFAULT NULL,
  `actual_elapsed_time` smallint(6) DEFAULT NULL,
  `air_time` smallint(6) DEFAULT NULL,
  `distance` smallint(6) DEFAULT NULL,
  `carrier_delay` smallint(6) DEFAULT NULL,
  `weather_delay` smallint(6) DEFAULT NULL,
  `nas_delay` smallint(6) DEFAULT NULL,
  `security_delay` smallint(6) DEFAULT NULL,
  `late_aircraft_delay` smallint(6) DEFAULT NULL
) ENGINE=Columnstore DEFAULT CHARSET=utf8;

-- Create syntax for TABLE 'flights_idb'
CREATE TABLE `flights_idb` (
  `year` smallint(6) DEFAULT NULL,
  `month` tinyint(4) DEFAULT NULL,
  `day` tinyint(4) DEFAULT NULL,
  `day_of_week` tinyint(4) DEFAULT NULL,
  `fl_date` date DEFAULT NULL,
  `carrier` char(2) DEFAULT NULL,
  `tail_num` char(6) DEFAULT NULL,
  `fl_num` smallint(6) DEFAULT NULL,
  `origin` varchar(5) DEFAULT NULL,
  `dest` varchar(5) DEFAULT NULL,
  `crs_dep_time` char(4) DEFAULT NULL,
  `dep_time` char(4) DEFAULT NULL,
  `dep_delay` smallint(6) DEFAULT NULL,
  `taxi_out` smallint(6) DEFAULT NULL,
  `wheels_off` char(4) DEFAULT NULL,
  `wheels_on` char(4) DEFAULT NULL,
  `taxi_in` smallint(6) DEFAULT NULL,
  `crs_arr_time` char(4) DEFAULT NULL,
  `arr_time` char(4) DEFAULT NULL,
  `arr_delay` smallint(6) DEFAULT NULL,
  `cancelled` smallint(6) DEFAULT NULL,
  `cancellation_code` char(1) DEFAULT NULL,
  `diverted` smallint(6) DEFAULT NULL,
  `crs_elapsed_time` smallint(6) DEFAULT NULL,
  `actual_elapsed_time` smallint(6) DEFAULT NULL,
  `air_time` smallint(6) DEFAULT NULL,
  `distance` smallint(6) DEFAULT NULL,
  `carrier_delay` smallint(6) DEFAULT NULL,
  `weather_delay` smallint(6) DEFAULT NULL,
  `nas_delay` smallint(6) DEFAULT NULL,
  `security_delay` smallint(6) DEFAULT NULL,
  `late_aircraft_delay` smallint(6) DEFAULT NULL,
  KEY `idx_fl_num_dep_delay` (`fl_num`,`dep_delay`),
  KEY `idx_fl_num_dep_delay_carrier` (`fl_num`,`dep_delay`,`carrier`),
  KEY `idx_dep_delay` (`dep_delay`)
) ENGINE=InnoDB;

-- Create syntax for TABLE 'tickets_idb'
CREATE TABLE `tickets_idb` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `fl_date` date NOT NULL,
  `fl_num` smallint(6) NOT NULL,
  `carrier` char(2) NOT NULL DEFAULT '',
  `origin` varchar(5) NOT NULL DEFAULT '',
  `dest` varchar(5) NOT NULL DEFAULT '',
  `price` decimal(9,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- Create syntax for TABLE 'trips_idb'
CREATE TABLE `trips_idb` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ticket_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;