// Reproduction Rate
const reproductionRateData = require('../data/reproduction-rates-for-ui.json');
// Positive Test Rate
const positiveTestRateData = require('../data/positive-test-rates-for-ui.json');
// Contact Trace Rate
const contactTraceRateData = require('../data/contract-trace-percent-by-state.json');
const { PRIORITY_HIGH } = require('constants');

// Risk Level
function riskLevel(rate) {
    console.log(rate);
    if(rate < 1) {
        return "low";
    };
    if(rate >= 1 && rate < 1.1) {
        return "medium";
    }
    if(rate >= 1.1 && rate < 1.2) {
        return "high";
    }
    if(rate >= 1.2) {
        return "critical";
    }
    throw new Error("Risk level function is breaking in generate summary data");
}

module.exports = function generateSummaryData(state) {
    const summaryData = {};

    summaryData["reproductionRate"] = reproductionRateData[state][reproductionRateData[state].length-1];

    summaryData["positiveTestRate"] = positiveTestRateData[state][positiveTestRateData[state].length-1];

    summaryData["contactTraceRate"] = contactTraceRateData[state][contactTraceRateData[state].length-1];

    summaryData["riskLevel"] = riskLevel(summaryData["reproductionRate"].y);

    return summaryData;
}