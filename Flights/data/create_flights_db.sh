#!/bin/bash
SCHEMA_DIR=$(readlink -f ./schema)
# create flights database (dropping if exists) with 3 columnstore tables: flights, airports, airlines
/usr/bin/mysql --defaults-file=/etc/my.cnf -u root -vvv < $SCHEMA_DIR/schema.sql
# load data into dimension tables airports and airlines.
/usr/bin/cpimport -m 2 -s ',' -E '"' flights airports -l $SCHEMA_DIR/airports.csv
/usr/bin/cpimport -m 2 -s ',' -E '"' flights airlines -l $SCHEMA_DIR/airlines.csv