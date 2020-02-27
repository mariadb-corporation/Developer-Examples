#!/bin/bash

SCHEMA_DIR=$(readlink -f ./schema)

# use the csv's to load data into the airports and airlines tables
#/usr/bin/mysql --defaults-file=/etc/my.cnf -u root -vvv < $SCHEMA_DIR/idb_load_data.sql
/usr/bin/mysql -udba -pDemo_password1 -h10.10.10.10 -e "LOAD DATA INFILE '${SCHEMA_DIR}/airports.csv' INTO TABLE innodb_schema.airports FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '\"' LINES TERMINATED BY '\n';"
/usr/bin/mysql -udba -pDemo_password1 -h10.10.10.10 -e "LOAD DATA INFILE '${SCHEMA_DIR}/airlines.csv' INTO TABLE innodb_schema.airlines FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '\"' LINES TERMINATED BY '\n';"
