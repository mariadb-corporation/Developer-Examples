"use strict";

let express = require("express"),
    router = express.Router(),
    pool = require('../db');

// GET - general flight filter
router.get("/airlines_stats", async (req, res, next) => {
    var origin = req.query.o;
    var dest = req.query.dst;
    var yearFrom = req.query.yf;
    var yearTo = req.query.yt;
    var month = req.query.m;
    var day = req.query.d;

    let conn;
    try {
        conn = await pool.getConnection();
        var query = "select " + 
                    "q.carrier, " +
                    "q.airline, " +
                    "q.volume flight_count, " +
                    "round(100 * q.volume / sum(q.volume) over " + 
                    "(order by q.airline rows between unbounded preceding and unbounded following),2) market_share_pct, " +
                    "round(100 * (q.`delayed` / q.volume), 2) delayed_pct, " + 
                    "round(100 * (q.cancelled / q.volume), 2) cancelled_pct, " +
                    "round(100 * (q.diverted / q.volume), 2) diverted_pct " +
                    "from ( " +
                        "select f.carrier, a.airline, count(*) volume, " +
                        "sum(case when dep_delay > 0 then 1 else 0 end) `delayed`, " +
                        "sum(diverted) diverted, sum(cancelled) cancelled " +
                        "from flights f join airlines a on f.carrier = a.iata_code " +
                        "where " +
                           "f.origin = ? and " +
                           "f.dest = ? and " +
                           "f.year >= ? and " + 
                           "f.year <= ?";

        if (month !== null && !isNaN(month)) {
            query += " and f.month = " + month;
        }

        if (day !== null && !isNaN(day)) {
            query += " and f.day = " + day;
        }

        query += " group by a.airline, f.carrier) q order by flight_count desc;";

        var rows = await conn.query(query, [origin, dest, yearFrom, yearTo]);
        res.send(rows);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.release();
    }
});

// GET - breakdown of delays by type for a given airline
router.get("/airline_delays", async (req, res, next) => {
    var origin = req.query.o;
    var dest = req.query.dst;
    var airline = req.query.a;
    var yearFrom = req.query.yf;
    var yearTo = req.query.yt;
    var month = req.query.m;
    var day = req.query.d;

    let conn;
    try {
        conn = await pool.getConnection();
        var query = "select " +
                        "round(100 * (weather_delayed / total_delayed), 2) weather_delay_pct, " +
                        "round(100 * (carrier_delayed / total_delayed), 2) carrier_delay_pct, " +
                        "round(100 * (nas_delayed / total_delayed), 2) nas_delay_pct, " +
                        "round(100 * (security_delayed / total_delayed), 2) security_delay_pct, " +
                        "round(100 * (late_aircraft_delayed / total_delayed), 2) late_aircraft_delay_pct " +
                    "from (" + 
                        "select " +
                             "carrier_delayed, nas_delayed, security_delayed, late_aircraft_delayed, weather_delayed, " +
                             "(carrier_delayed+nas_delayed+security_delayed+late_aircraft_delayed+weather_delayed) total_delayed " +
                        "from (" +
                            "select " + 
                                "avg(carrier_delay) carrier_delayed, " +
                                "avg(nas_delay) nas_delayed, " +
                                "avg(security_delay) security_delayed, " +
                                "avg(late_aircraft_delay) late_aircraft_delayed, " +
                                "avg(weather_delay) weather_delayed " +
                            "from " + 
                                "flights f join airlines a on f.carrier = a.iata_code " +
                            "where " + 
                                "f.origin = ? and f.dest = ? and f.carrier = ? and f.year >= ? and f.year <= ?";

        if (month !== null && !isNaN(month)) {
            query += " and f.month = " + month;
        }

        if (day !== null && !isNaN(day)) {
            query += " and f.day = " + day;
        }

        query += " group by a.airline, f.carrier) a) b";

        var rows = await conn.query(query, [origin, dest, airline, yearFrom, yearTo]);
        res.send(rows[0]);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.release();
    }
});

// GET - breakdown of delays by type for an airline vs average of all airlines
router.get("/delays_comparison", async (req, res, next) => {
    var origin = req.query.o;
    var dest = req.query.dst;
    var airline = req.query.a;
    var yearFrom = req.query.yf;
    var yearTo = req.query.yt;
    var month = req.query.m;
    var day = req.query.d;

    let conn;
    try {
        conn = await pool.getConnection();
        var query = "select " +
                        "avg(carrier_delay) carrier, " +
                        "avg(nas_delay) nas, " +
                        "avg(security_delay) sec, " +
                        "avg(late_aircraft_delay) late_aircraft, " +
                        "avg(weather_delay) weather " +
                    "from " + 
                        "flights f " +
                    "where " +
                        "f.origin = ? " +
                        "and f.dest = ? " +
                        "and f.carrier = ? " +
                        "and f.year >= ? and f.year <= ?";

                    if (month !== null && !isNaN(month)) {
                        query += " and f.month = " + month;
                    }

                    if (day !== null && !isNaN(day)) {
                        query += " and f.day = " + day;
                    }

        query += " union select " +
                        "avg(carrier_delay) carrier, " +
                        "avg(nas_delay) nas, " +
                        "avg(security_delay) sec, " +
                        "avg(late_aircraft_delay) late_aircraft, " +
                        "avg(weather_delay) weather " +
                    "from " +
                        "flights f " +
                    "where " +
                        "f.origin = ? " +
                        "and f.dest = ? " +
                        "and f.year >= ? and f.year <= ?";

                    if (month !== null && !isNaN(month)) {
                        query += " and f.month = " + month;
                    }

                    if (day !== null && !isNaN(day)) {
                        query += " and f.day = " + day;
                    }

        var rows = await conn.query(query, [origin, dest, airline, yearFrom, yearTo, origin, dest, yearFrom, yearTo]);
        res.send(rows);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.release();
    }
});

module.exports = router;