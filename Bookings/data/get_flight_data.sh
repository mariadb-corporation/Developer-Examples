#!/bin/bash
#
# This script will remotely invoke the bureau of transportation statistics web form to retrieve data by month:
# https://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time
# for the specific columns listed in the SQL and utilized by the sample schema.
mkdir -p data
for y in {1990..2020}; do
  for m in {1..12}; do
    yyyymm="$y-$(printf %02d $m)"
    echo "$yyyymm"
    curl -L -o data.zip -d "sqlstr=+SELECT+YEAR%2CMONTH%2CDAY_OF_MONTH%2CDAY_OF_WEEK%2CFL_DATE%2CCARRIER%2CTAIL_NUM%2CFL_NUM%2CORIGIN%2CDEST%2CCRS_DEP_TIME%2CDEP_TIME%2CDEP_DELAY%2CTAXI_OUT%2CWHEELS_OFF%2CWHEELS_ON%2CTAXI_IN%2CCRS_ARR_TIME%2CARR_TIME%2CARR_DELAY%2CCANCELLED%2CCANCELLATION_CODE%2CDIVERTED%2CCRS_ELAPSED_TIME%2CACTUAL_ELAPSED_TIME%2CAIR_TIME%2CDISTANCE%2CCARRIER_DELAY%2CWEATHER_DELAY%2CNAS_DELAY%2CSECURITY_DELAY%2CLATE_AIRCRAFT_DELAY+FROM++T_ONTIME+WHERE+Month+%3D$m+AND+YEAR%3D$y" https://www.transtats.bts.gov/DownLoad_Table.asp?Table_ID=236
    rm -f *.csv
    unzip data.zip
    rm -f data.zip
    mv *.csv $yyyymm.csv
    tail -n +2 $yyyymm.csv > data/$yyyymm.csv
    rm -f $yyyymm.csv
  done
done