const express = require('express');
const riskData = require('./data/risk-level-7-days.json');
const reproductionRateData = require('./data/computed/reproduction-rate.json');
const contactTraceRateData = require('./data/computed/contact-trace.json');
const positiveTestRateData = require('./data/computed/positive-test-rate.json');
const dailyCaseData = require('./data/computed/dailyCaseData.json');
const dailyCaseDataMovingAverage = require('./data/computed/daily-cases-moving-average.json');
const dailyDeathData = require('./data/computed/dailyDeathData.json');
const dailyDeathDataMovingAverage = require('./data/computed/daily-deaths-moving-average.json');
const summaryData = require('./data/summary.json');

const router = new express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to the root route!');
});

router.get('/v1/risk_level', (req, res) => {
  res.json(riskData);
});

router.get('/v1/reproduction_rate', (req, res) => {
  res.json(reproductionRateData);
});

router.get('/v1/contact_trace_rate', (req, res) => {
  res.json(contactTraceRateData);
});

router.get('/v1/positive_test_rate', (req, res) => {
  res.json(positiveTestRateData);
});

router.get('/v1/daily_cases', (req, res) => {
  res.json(dailyCaseData);
});

router.get('/v1/daily_cases_moving_average', (req, res) => {
  res.json(dailyCaseDataMovingAverage);
});

router.get('/v1/daily_deaths', (req, res) => {
  res.json(dailyDeathData);
});

router.get('/v1/daily_deaths_moving_average', (req, res) => {
  res.json(dailyDeathDataMovingAverage);
});

router.get('/v1/summary', (req, res) => {
  res.json(summaryData);
});

module.exports = router;
