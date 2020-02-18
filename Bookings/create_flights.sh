#!/bin/bash

target_year=$1
source_year=$2
month=$3

MariaDB="mariadb -h10.10.10.11 -udba -pDemo_password1 innodb_schema -e"

${MariaDB} "INSERT INTO innodb_schema.flights (year,month,day,fl_date,carrier,fl_num,origin,dest,dep_time,arr_time,distance) SELECT $target_year,month,day,(concat($target_year,'-',month,'-',day)),carrier,fl_num,origin,dest,dep_time,arr_time,distance from columnstore_schema.flights where (year=$source_year and month=$month);"

${MariaDB} "DELETE FROM innodb_schema.tickets;"

${MariaDB} "INSERT INTO innodb_schema.tickets (fl_date,fl_num,carrier,origin,dest,price) SELECT fl_date,fl_num,carrier,origin,dest,distance*((FLOOR(RAND()*(75-55+1))+55)/100) FROM innodb_schema.flights;"


