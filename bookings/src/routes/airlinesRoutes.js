"use strict";

let express = require("express"),
    router = express.Router(),
    pool = require('../db');

// GET all airlines
router.get("/", async (req, res, next) => {
    let conn;
    try {
        conn = await pool.getConnection();
        var query = "select * from travel.airlines order by airline";
        var rows = await conn.query(query);
        res.send(rows);
        throw err;
    } finally {
        if (conn) return conn.release();
    }
});

module.exports = router;