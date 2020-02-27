const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const bodyParser = require("body-parser");

const airlinesRoutes = require("./routes/airlinesRoutes"); 
const airportsRoutes = require("./routes/airportsRoutes"); 
const flightsRoutes = require("./routes/flightsRoutes");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
}

app.use("/api/airlines", airlinesRoutes);
app.use("/api/airports", airportsRoutes);
app.use("/api/flights", flightsRoutes);

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

app.use((err, req, res, next) => {
    res.status(422).send({ error: err._message });
});

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));