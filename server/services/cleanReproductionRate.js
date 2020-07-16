const fs = require('fs');
const csvToJson = require('convert-csv-to-json');
const data = require('./reproduction-rate.json');
const states = require('../data/contract-trace-percent-by-state.json');

// Transform the CSV Input into JSON format
function csvToJsonHelper(){
    let fileInput = '../data/reproduction-rate.csv';
    let fileOutput = 'reproduction-rate.json';
    csvToJson.fieldDelimiter(',').generateJsonFileFromCsv(fileInput, fileOutput);
}

// csvToJsonHelper();

/**
 * Name: generateUIData
 * Purpose: Transforms data into an array of (x,y) for UI Data Visualization
 * 
 * @param {Array} filteredByStateData
 * @return {Array}
 */

function generateUIData(filteredByStateData) {
    const returnMe = [];
    for(let i = 0; i < filteredByStateData.length; i++) {
        const tempObject = {};
        tempObject["x"] = filteredByStateData[i].date;
        tempObject["y"] = filteredByStateData[i].mean;
        returnMe.push(tempObject);
    }
    return returnMe;
}

/**
 * 
 * @param {Array} data
 * @param {Object} states
 */
module.exports = function createJson(data, states) {
    const dataStructure = {};
    const stateNames = [...Object.keys(states)];

    // For each state, I need to locate it's data (array) and apply a transformation
    for(let i = 0; i < stateNames.length; i++) {
        let currentState = stateNames[i];

        // filtered is a new array that has only items from the current state
        const filtered = data.filter((data) => data.state === currentState);

        // Trim down for UI        
        dataStructure[stateNames[i]] = generateUIData(filtered);
    }
    return dataStructure;
}

// const prod = createJson(data, states);
// const json = JSON.stringify(prod);

// fs.writeFile('reproduction-rates-for-ui.json', json, (e) => {
//     if(e) return console.log(e);
//     console.log("Was able to write the file");
// });