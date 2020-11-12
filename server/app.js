const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const router = require('./router');

const app = express();

app.use(
  cors({
    origin: '*',
  })
);

app.use(morgan('combined'));

app.use(router);

module.exports = app;
