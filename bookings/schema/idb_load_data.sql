use innodb_schema;

/* load airports data */
LOAD DATA INFILE '/Developer-Examples/Bookings/schema/airports.csv' INTO TABLE airports
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n';

/* load airlines data */
LOAD DATA INFILE '/Developer-Examples/Bookings/schema/airlines.csv' INTO TABLE airlines
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n';