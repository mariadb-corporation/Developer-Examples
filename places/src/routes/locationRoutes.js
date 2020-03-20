"use strict";

let express = require("express"),
    router = express.Router(),
    pool = require('../db');

// GET all locations
router.get("/", async (req, res, next) => {
    let conn;
    try {
        conn = await pool.getConnection();
        var query = "select id, name, type, longitude, latitude, " +
                    "case when type = 'R' then concat((case when json_length(attr, '$.favorites') " +
                    "is not null then json_length(attr, '$.favorites') else 0 end), ' favorite meals') " +
                    "when type = 'A' then (case when json_value(attr, '$.lastVisitDate') is not null " +
                    "then json_value(attr, '$.lastVisitDate') else 'N/A' end) " +
                    "when type = 'S' then concat((case when json_length(attr, '$.events') is not null " +
                    "then json_length(attr, '$.events') else 0 end), ' events') end as description " +
                    "from locations";
        var rows = await conn.query(query);
        res.send(rows);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.release();
    }
});

// POST new location
router.post("/", async (req, res, next) => {
    let location = req.body;
    let conn;
    try {
        conn = await pool.getConnection();
        var query = "insert into locations (name, description, type, latitude, longitude, attr) values (?, ?, ?, ?, ?, json_compact(?))";
        var result = await conn.query(query, [location.name, location.description, location.type, location.latitude, location.longitude, JSON.stringify(location.attr)]);
        res.send(result);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.release();
    }
});

// GET restaurant by id
router.get("/restaurant", async (req, res, next) => {
    let conn;

    try {
        conn = await pool.getConnection();
        var id = req.query.id;
        var query = "select " +
                    "name, " +
                    "json_value(attr,'$.details.foodType') as foodType, " +
                    "json_value(attr,'$.details.menu') as menu, " +
                    "json_query(attr,'$.favorites') as favorites " +
                    "from locations " +
                    "where id = ?";
        var rows = await conn.query(query, [id]);
        res.send(rows[0]);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.release();
    }
});

// POST new restaurant favorite
router.post("/restaurant/favorites", async (req, res, next) => {
    let favorite = req.body;
    let details = favorite.details; 
    let conn;
    try {
        conn = await pool.getConnection();
        var query = "update locations set attr = json_array_append(attr, '$.favorites', json_compact(?)) where id = ?"
        var result = await conn.query(query, [JSON.stringify(details), favorite.locationid]);
        res.send(result);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.release();
    }
});

// GET sports venue by id
router.get("/sportsvenue", async (req, res, next) => {
    let conn;

    try {
        conn = await pool.getConnection();
        var id = req.query.id;
        var query = "select " +
                    "name, " +
                    "json_value(attr,'$.details.yearOpened') as yearOpened, " +
                    "json_value(attr,'$.details.capacity') as capacity, " +
                    "json_query(attr,'$.events') as events " +
                    "from locations " +
                    "where id = ?";
        var rows = await conn.query(query, [id]);
        res.send(rows[0]);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.release();
    }
});

// POST new sports venue event
router.post("/sportsvenue/event", async (req, res, next) => {
    let event = req.body;
    let conn;
    try {
        conn = await pool.getConnection();
        var query = "update locations set attr = json_array_append(attr, '$.events', json_compact(?)) where id = ?";
        var result = await conn.query(query, [JSON.stringify(event.details), event.locationid]);
        res.send(result);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.release();
    }
});

// PUT last visited an attraction
router.put("/attractions", async (req, res, next) => {
    let locationId = req.query.id;
    let lastVisitDate = req.query.dt;
    let conn;
    try {
        conn = await pool.getConnection();
        var query = "update locations set attr = json_set(attr,'$.lastVisitDate', ?) where id = ?";
        var result = await conn.query(query, [lastVisitDate, locationId]);
        res.send(result);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.release();
    }
});

module.exports = router;