/**
 * data.js - Data Routes Module
 * Provide data for the client to consume
 */

 const express = require('express');
 const router = express.Router();

const contactTrace = require('../data/contact-trace.json');
const contactTraceState = require('../data/contract-trace-percent-by-state.json');
const usStates = require('../data/us-states.json');
const nysCounty = require('../data/nys-county-data.json');

router.get('/data/contact-trace', (req,res) => {
    res.send({data: contactTrace});
});

router.get('/data/contact-trace-percent-by-state', (req,res) => {
    res.send({data: contactTraceState});
});

router.get('/data/us-states', (req,res) => {
    res.send({data: usStates});
});

router.get('/data/nys-county-data', (req,res) => {
    res.send({data: nysCounty});
});

module.exports = router;