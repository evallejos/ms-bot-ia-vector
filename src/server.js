const express = require("express");
const path = require("path");
const cors = require('cors');
// Initializations
const app = express();
// Settings
app.set("port", process.env.PORT || 4000);
app.options('*', cors());
// Middlewares
app.use(express.urlencoded({ limit: '10mb', extended: false, parameterLimit: 1000000 }));
app.use(express.json({ limit: '10mb', type: ['application/*+json', 'application/json'] }));
// Routes
app.use("/api", require("./routes"));

// Static file
app.use(express.static(path.join(__dirname, "public")));

module.exports = app;
