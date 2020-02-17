#!/bin/bash

# Variables
MariaDB="mariadb -h10.10.10.11 -udba -pDemo_password1 innodb_schema -e"
year=2020
month=02



${MariaDB} "CREATE TABLE `flights` (   `year` smallint(6) DEFAULT NULL,   `month` tinyint(4) DEFAULT NULL,   `day` tinyint(4) DEFAULT NULL,   `day_of_week` tinyint(4) DEFAULT NULL,   `fl_date` date DEFAULT NULL,   `carrier` char(2) DEFAULT NULL,   `tail_num` char(6) DEFAULT NULL,   `fl_num` smallint(6) DEFAULT NULL,   `origin` varchar(5) DEFAULT NULL,   `dest` varchar(5) DEFAULT NULL,   `crs_dep_time` char(4) DEFAULT NULL,   `dep_time` char(4) DEFAULT NULL,   `dep_delay` smallint(6) DEFAULT NULL,   `taxi_out` smallint(6) DEFAULT NULL,   `wheels_off` char(4) DEFAULT NULL,   `wheels_on` char(4) DEFAULT NULL,   `taxi_in` smallint(6) DEFAULT NULL,   `crs_arr_time` char(4) DEFAULT NULL,   `arr_time` char(4) DEFAULT NULL,   `arr_delay` smallint(6) DEFAULT NULL,   `cancelled` smallint(6) DEFAULT NULL,   `cancellation_code` char(1) DEFAULT NULL,   `diverted` smallint(6) DEFAULT NULL,   `crs_elapsed_time` smallint(6) DEFAULT NULL,   `actual_elapsed_time` smallint(6) DEFAULT NULL,   `air_time` smallint(6) DEFAULT NULL,   `distance` smallint(6) DEFAULT NULL,   `carrier_delay` smallint(6) DEFAULT NULL,   `weather_delay` smallint(6) DEFAULT NULL,   `nas_delay` smallint(6) DEFAULT NULL,   `security_delay` smallint(6) DEFAULT NULL,   `late_aircraft_delay` smallint(6) DEFAULT NULL,   KEY `idx_fl_num_dep_delay` (`fl_num`,`dep_delay`),   KEY `idx_fl_num_dep_delay_carrier` (`fl_num`,`dep_delay`,`carrier`),   KEY `idx_dep_delay` (`dep_delay`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8"

${MariaDB} insert into innodb_schema.flights
${MariaDB} select * from columnstore_schema.flights where ( year='2019' and month='02');
${MariaDB} insert into innodb_schema.flights select * from columnstore_schema.flights where ( year='2019' and month='02');
${MariaDB} insert into innodb_schema.flights select * from columnstore_schema.flights where ( year='2019' and month='03');
${MariaDB} update innodb_schema.flights set year='2020' where year='2019';
${MariaDB} CREATE TABLE `tickets` (   `id` int(11) unsigned NOT NULL AUTO_INCREMENT,   `fl_date` date NOT NULL,   `fl_num` smallint(6) NOT NULL,   `carrier` char(2) NOT NULL DEFAULT '',   `origin` varchar(5) NOT NULL DEFAULT '',   `dest` varchar(5) NOT NULL DEFAULT '',   `price` decimal(9,2) NOT NULL DEFAULT 0.00,   PRIMARY KEY (`id`) ) ENGINE=InnoDB AUTO_INCREMENT=583156 DEFAULT CHARSET=utf8;
${MariaDB} insert into innodb_schema.tickets ('fl_date','fl_num', 'carrier', 'origin', 'dest', 'price')
select ('fl_date','fl_num','carrier','origin','dest',EXP('distance'*0,80*RAND())) from innodb_schema.flights;

${MariaDB} insert into innodb_schema.tickets (fl_date,fl_num, carrier, origin, dest, price) select fl_date,fl_num,carrier,origin,dest,distance from innodb_schema.flights;
${MariaDB} update tickets set price=price*rand();

${MariaDB} update innodb_schema.flights set fl_date=DATE_ADD(fl_date, INTERVAL 1 YEAR) where fl_date like '2019%';
