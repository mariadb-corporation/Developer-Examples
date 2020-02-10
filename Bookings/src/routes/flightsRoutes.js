"use strict";

let express = require("express"),
    router = express.Router(),
    pool = require('../db');

router.get("/", async (req, res, next) => {
    let date = new Date(req.query.dt);
    let origin = req.query.o;
    let dest = req.query.d;
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    // ignore time offsets
    let formattedDate = formatDate(year,month,day);
    //let formattedDate = date;

    let conn;
    try {
        conn = await pool.getConnection();

        var query = "select \
                        a.airline, \
                        t.carrier airline_code, \
                        t.origin, \
                        t.dest, \
                        t.price, \
                        a.`airline`, \
                        f.dep_time, \
                        f.arr_time, \
                        fh.avg_delay, \
                        (select avg(arr_time - dep_time) from columnstore_schema.flights \
                        where month = ? and day = ? and origin = ? and dest = ? and carrier = t.carrier and year >= 2014) avg_duration, \
                        fh.delayed_pct, \
                        fh.cancelled_pct \
                    from \
                        innodb_schema.tickets t, \
                        (select * from innodb_schema.flights where year = ? and month = ? and day = ?) f, \
                        (select  \
                            a.avg_delay, \
                            round(100 * (a.`delayed` / a.volume), 2) delayed_pct, \
                            round(100 * (a.cancelled / a.volume), 2) cancelled_pct, \
                            a.carrier \
                        from \
                            (select \
                                count(*) volume, \
                                sum(case when dep_delay > 0 then 1 else 0 end) `delayed`, \
                                sum(cancelled) cancelled, \
                                avg(dep_delay) avg_delay, \
                                carrier \
                            from  \
                                columnstore_schema.flights \
                            where \
                                year >= 2014 and \
                                month = ? and day = ? and origin = ? and dest = ? group by carrier) a) fh, \
                        innodb_schema.airlines a  \
                    where \
                        t.carrier = f.carrier and \
                        t.fl_date = f.fl_date and \
                        t.fl_num = f.fl_num and \
                        t.carrier = fh.carrier and \
                        f.carrier = a.iata_code and \
                        t.fl_date = ? and \
                        t.origin = ? and \
                        t.dest = ?";
 
        var results = await conn.query(query, [month,day,origin,dest,year,month,day,month,day,origin,dest,formattedDate,origin,dest]);

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

function formatDate(year,month,day) {
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

// secret (scoring) sauce
function analyzeResults(items) {
    let prices = items.map(item => item.price)
    let average_price = getAverage(prices);

    items.forEach(item => { 
        let price_score =  round(3.5 * (average_price / item.price), 1);
        let delay_score = round(5 * ((100 - item.delayed_pct)/100), 1);
        let cancel_score = round(5 * ((100 - item.cancelled_pct)/100), 1);
        let overall_score = round((price_score + delay_score + cancel_score) / 3, 1);

        item.assessment = {
            overall_score: overall_score,
            price_score: price_score,
            delay_score: delay_score,
            delay_percentage: item.delayed_pct,
            cancel_score: cancel_score,
            cancel_percentage: item.cancelled_pct
        };
    }); 

    return items;
}
 
function getAverage(arr) {
    let reducer = (total, currentValue) => total + currentValue;
    let sum = arr.reduce(reducer)
    return sum / arr.length;
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

module.exports = router;