#!/bin/bash

SCHEMA_DIR=$(readlink -f ./schema)

# create innodbtables: airports, airlines
/usr/bin/mysql --defaults-file=/etc/my.cnf -u root -vvv < $SCHEMA_DIR/idb_schema.sql
# create columnstore table: flights
/usr/bin/mysql --defaults-file=/etc/my.cnf -u root -vvv < $SCHEMA_DIR/cs_schema.sql