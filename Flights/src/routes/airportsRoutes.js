"use strict";

let express = require("express"),
    router = express.Router(),
    pool = require('../db');

// GET all airports
router.get("/", async (req, res, next) => {
    let conn;
    try {
        conn = await pool.getConnection();
        var query = "select iata_code, airport from airports group by airport, iata_code order by airport";
        var rows = await conn.query(query);
        res.send(rows);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.release();
    }
});

module.exports = router;