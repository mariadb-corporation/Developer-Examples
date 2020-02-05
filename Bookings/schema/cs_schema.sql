use columnstore_schema;

create table airlines (
iata_code char(2),
airline varchar(30)
) engine=columnstore default character set=utf8;

create table airports (
iata_code char(3),
airport varchar(80),
city varchar(30),
state char(2),
country varchar(30),
latitude float,
longitude float
) engine=columnstore default character set=utf8;

create table flights (
year smallint,
month tinyint,
day tinyint,
day_of_week tinyint,
fl_date date,
carrier char(2),
tail_num char(6),
fl_num smallint,
origin varchar(5),
dest varchar(5),
crs_dep_time char(4),
dep_time char(4),
dep_delay smallint,
taxi_out smallint,
wheels_off char(4),
wheels_on char(4),
taxi_in smallint,
crs_arr_time char(4),
arr_time char(4),
arr_delay smallint,
cancelled smallint,
cancellation_code smallint,
diverted smallint,
crs_elapsed_time smallint,
actual_elapsed_time smallint,
air_time smallint,
distance smallint,
carrier_delay smallint,
weather_delay smallint,
nas_delay smallint,
security_delay smallint,
late_aircraft_delay smallint
) engine=columnstore default character set=utf8;

