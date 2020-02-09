#!/bin/bash

SCHEMA_DIR=$(readlink -f ./schema)

# create innodbtables: airports, airlines
/usr/bin/mysql -udba -pDemo_password1 -h10.10.10.10 -vvv < $SCHEMA_DIR/idb_schema.sql
# create columnstore table: flights
/usr/bin/mysql -udba -pDemo_password1 -h10.10.10.10 -vvv < $SCHEMA_DIR/cs_schema.sql
