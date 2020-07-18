/**
 * This is the main module that will export the latest data.
 * 
 * Structure:
 * 
 * 1. Import the data
 * 2. Create the returnMeDataStructure
 * 3. Call the services
 * 4. Return the data structure
 * 5. Write a JSON file to the disk
 */

const fs = require('fs');

// Dataconst data = require('./reproduction-rate.json');
const reproductionRateData = require('./reproduction-rate.json');
const hasStatesAsKeys = require('../data/contract-trace-percent-by-state.json');

// Services
// Inputs data and states
const cleanReproductionRate = require('./cleanReproductionRate');
const generateSummaryData = require('./generateSummaryData');

function main() {
    const returnMe = {};
    console.log("This is the main.");
    const stateNames = [...Object.keys(hasStatesAsKeys)];

    // I need to get an array of the names of the states

    // For loop! 
    for(let i = 0; i < stateNames.length; i++) {
        let currentState = stateNames[i];
        // Create the state object
        // const currentStateObject = {};

        // const chartData = {};
        // Call reproduction-rate
        const reproRateResponse = cleanReproductionRate(reproductionRateData, hasStatesAsKeys);

        // Assign
        // currentStateObject["reproduction-rate-for-ui"] = response;

        // Call PositiveTestRate

        // Assign it

        // ... do other things ...

        // Create summary object
        const summaryData = generateSummaryData(currentState);

        // Call a function here that will return the number that goes in the UI


        // Call FUTURE state summary object function

        // Assign the state object to returnMe[currentState] = state-object
        returnMe[currentState] = summaryData;
    }
    return returnMe;
}


const response = main();
console.log("This is the final data ", response);
const json = JSON.stringify(response);
console.log("This is the JSON", json);

fs.writeFile('summary.json', json, (e) => {
    if(e) return console.log(e);
    console.log("Was able to write the file");
});
