#!/bin/bash

SCHEMA_DIR=$(readlink -f ./schema)

# create orders database and table
/usr/bin/mysql --defaults-file=/etc/my.cnf -u root -vvv < $SCHEMA_DIR/create.sql