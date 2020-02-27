#!/bin/bash
SCHEMA_DIR=$(readlink -f ./schema)
# create flights database (dropping if exists) with 3 columnstore tables: flights, airports, airlines
/usr/bin/mysql --defaults-file=/etc/my.cnf -u root -vvv < $SCHEMA_DIR/schema.sql
# load data into dimension tables airports and airlines.
/usr/bin/cpimport -m 2 -s ',' -E '"' flights airports -l $SCHEMA_DIR/airports.csv
/usr/bin/cpimport -m 2 -s ',' -E '"' flights airlines -l $SCHEMA_DIR/airlines.csv
[root@flight-demo-mdb-cs-single-0 data]# cat 
load^C
[root@flight-demo-mdb-cs-single-0 data]# cat load_flight_data.sh 
#!/bin/bash
# check for argument, if so use as wildcard for file load match, otherwise load everything
DATA_DIR=$(readlink -f ./data)
filematch="*"
if [ $# -eq 1 ]
then
  filematch="*$1*"
fi
# load the specified files under the data directory with the file pattern match
# here we use cpimport mode 2 to force processing at each PM node which has
# the advantage of this being runnable as a regular user with a root installation.
for f in $DATA_DIR/$filematch.csv; do
  echo $f
  /usr/bin/cpimport -m2 -s ',' -E '"' flights flights -l $f
done