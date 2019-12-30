"use strict";

let express = require("express"),
    router = express.Router(),
    pool = require('../db');

// GET 
router.get("/", async (req, res, next) => {
    let connection_id = req.query.c;
    let read_count = req.query.r;
    let write_count = req.query.w;
    let conn;
    try {
        conn = await pool.getConnection(connection_id);
        let query= "";

        // reads
        for (let i = 0; i < read_count; i++) {
            query += "select * from orders limit 1;";
        }

        // writes
        let transaction_id = Date.now().toString();
        for (let i = 0; i < write_count; i++) {
            query += "insert into orders (description) values('order - " + transaction_id + "');";
        }

        var start = Date.now();
        await conn.query(query);
        var delta = Date.now() - start;

        res.send({ execution_time: delta });
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.release();
    }
});

module.exports = router;