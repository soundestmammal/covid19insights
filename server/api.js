const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const riskData = require('./data/risk-level-7-days.json');
const reproductionRateData = require('./data/reproduction-rates-for-ui.json');
const contactTraceRateData = require('./data/contract-trace-percent-by-state.json');
const positiveTestRateData = require('./data/positive-test-rates-for-ui.json');
const dailyCaseData = require('./data/computed/dailyCaseData.json');
const dailyCaseDataMovingAverage = require('./data/computed/daily-cases-moving-average.json');
const dailyDeathData = require('./data/dailyDeathData.json');
const dailyDeathDataMovingAverage = require('./data/daily-deaths-moving-average.json');
const summaryData = require('./data/summary.json');


const app = express();

app.use(cors({
    origin: '*'
}));

app.use(morgan('combined'));

app.get('/', (req, res) => {
    res.send("Welcome to the root route!");
});

app.get('/v1/risk_level', (req, res) => {
    res.json(riskData);
});

app.get('/v1/reproduction_rate', (req, res) => {
    res.json(reproductionRateData);
});

app.get('/v1/contact_trace_rate', (req, res) => {
    res.json(contactTraceRateData);
});

app.get('/v1/positive_test_rate', (req, res) => {
    res.json(positiveTestRateData);
});

app.get('/v1/daily_cases', (req, res) => {
    res.json(dailyCaseData);
});

app.get('/v1/daily_cases_moving_average', (req, res) => {
    res.json(dailyCaseDataMovingAverage);
});

app.get('/v1/daily_deaths', (req, res) => {
    res.json(dailyDeathData);
})

app.get('/v1/daily_deaths_moving_average', (req, res) => {
    res.json(dailyDeathDataMovingAverage);
});

app.get('/v1/summary', (req, res) => {
    res.json(summaryData);
})

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server is listening on Port: ${PORT}`);
});