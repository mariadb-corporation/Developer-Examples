#!/bin/bash

SCHEMA_DIR=$(readlink -f ./schema)

# use the csv's to load data into the airports and airlines tables
/usr/bin/mysql --defaults-file=/etc/my.cnf -u root -vvv < $SCHEMA_DIR/idb_load_data.sql