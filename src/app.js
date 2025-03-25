const express = require('express');
const getRateLimiter = require('./utils/getRateLimiter');
const renderRoute = require('./routes/render');

const app = express();
app.use(express.json());
app.use(getRateLimiter());
app.use('/', renderRoute);

module.exports = app;
