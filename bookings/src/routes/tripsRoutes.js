"use strict";
 
let express = require("express"),
    router = express.Router(),
    pool = require('../db');

router.get("/", async (req, res, next) => {
    let conn;
    try {
        conn = await pool.getConnection();

        var query = "select \
                        t.fl_num, \
                        a.airline, \
                        t.carrier airline_code, \
                        t.fl_date, \
                        t.origin, \
                        t.dest, \
                        f.dep_time, \
                        f.arr_time, \
                        fh.delayed_pct, \
                        fh.avg_delay \
                    from \
                        innodb_schema.trips tr inner join  \
                        innodb_schema.tickets t on tr.ticket_id = t.id inner join \
                        innodb_schema.airlines a on t.carrier = a.iata_code, \
                        (select * from innodb_schema.flights where year >= 2020) f, \
                        (select  \
                            a.avg_delay, \
                            round(100 * (a.`delayed` / a.volume), 2) delayed_pct, \
                            round(100 * (a.cancelled / a.volume), 2) cancelled_pct, \
                            a.carrier, \
                            a.day, \
                            a.month \
                        from  \
                            (select  \
                                count(*) volume, \
                                sum(case when dep_delay > 0 then 1 else 0 end) `delayed`, \
                                sum(cancelled) cancelled, \
                                avg(dep_delay) avg_delay, \
                                carrier, \
                                month, \
                                day \
                            from  \
                                columnstore_schema.flights \
                            where \
                                year >= 2014 and \
                                month in (select month(fl_date) from innodb_schema.trips tr inner join innodb_schema.tickets t on tr.ticket_id = t.id) and \
                                day in (select day(fl_date) from innodb_schema.trips tr inner join innodb_schema.tickets t on tr.ticket_id = t.id) \
                            group by  \
                                day, \
                                month, \
                                carrier) a) fh \
                    where \
                        t.carrier = f.carrier and \
                        t.fl_date = f.fl_date and \
                        t.fl_num = f.fl_num and \
                        t.carrier = fh.carrier and \
                        fh.month = month(t.fl_date) and \
                        fh.day = day(t.fl_date)";

        var results = await conn.query(query);

        if (results.length > 0) {
            var analyzedResults = analyzeResults(results);
            res.send(analyzedResults);
        }
        else {
            res.send(results);
        }
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if (conn) return conn.release();
    }
});

// secret (scoring) sauce
function analyzeResults(items) {
    items.forEach(item => { 
        let forecast = forecasts[item.origin + "_" + item.fl_date.toISOString().substring(0, 10)];
        
        // Catch all in case the forecast hasn't been updated
        if (forecast === undefined) {
            forecast = {
                description: "Clear",
                icon: "clear-day",
                temp_low: "55°F",
                temp_high: "55°F",
                precip_probability: 0.2,
                wind_speed: 10
            };
        }

        let weather_score = 5 - 5*(forecast.precip_probability + (forecast.wind_speed/100));
        let historical_score = round(5 * ((100 - item.delayed_pct)/100), 1);
        let overall_score = round((weather_score + historical_score) / 2, 1);
        let weather_delay_multiplier = round((forecast.precip_probability + (forecast.wind_speed/100)) * 5, 3);
        let projected_delay = round(weather_delay_multiplier * item.avg_delay, 0);

        item.assessment = {
            overall_score: overall_score,
            historical_score: historical_score,
            historical_delay_percentage: item.delayed_pct,
            weather_score: weather_score,
            weather_delay_multiplier: weather_delay_multiplier,
            projected_delay: projected_delay
        };

        item.forecast = forecast;
    }); 

    return items;
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

// You can either tie into an existing Weather Forecast API 
// or provide hard-coded lookups like the following.
var forecasts = {
    "ORD_2020-02-27": {
        description: "Snow",
        icon: "snow",
        temp_low: "-2°C",
        temp_high: "-1°C",
        precip_probability: .6,
        wind_speed: 15
    },
    "LAX_2020-02-28": {
        description: "Clear",
        icon: "clear-day",
        temp_low: "13°C",
        temp_high: "15°C",
        precip_probability: 0,
        wind_speed: 5
    }
};

module.exports = router;