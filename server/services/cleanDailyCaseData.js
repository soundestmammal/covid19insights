const fs = require('fs');
const dailyCaseData = require('../data/state-level-time-series-cases-deaths.json');
const getStateNames = require('../data/contract-trace-percent-by-state.json');

function cleanDailyCaseData(filtered) {

    // The raw data tallies cumulative cases
    const caseData = [];
    for(let i = 0; i < filtered.length; i++) {
        let tempObject = {};
        tempObject["x"] = filtered[i].date;
        tempObject["y"] = parseFloat(filtered[i].cases);
        caseData.push(tempObject);
    }

    // Calculate daily cases : y(t) = y(t)-y(t-1)
    const dailyCases = [];
    for(let i = 0; i < caseData.length; i++) {
        let tempObject = {};
        if(i === 0) {
        tempObject["x"] = caseData[i]["x"];
        tempObject["y"] = caseData[i]["y"];
        dailyCases.push(tempObject);
        } else {
        tempObject["x"] = caseData[i]["x"];
        tempObject["y"] = caseData[i]["y"]-caseData[i-1]["y"];
        dailyCases.push(tempObject);
        }
    }
    return dailyCases;
}

function createJson(data, states) {
    // 1. Create a dataStructure object to be returned
    const dataStructure = {};

    // 2. Create an array of US State names
    const stateNames = [...Object.keys(states)];

    // 3. Loop through each US State, apply data transformation and assign new data to dataStructure object
    for(let i = 0; i < stateNames.length; i++) {
        let currentState = stateNames[i];
        const filtered = data.filter((data) => data.state === currentState);
        let dailyData = cleanDailyCaseData(filtered, currentState);
        dataStructure[stateNames[i]] = dailyData;
    }
    return dataStructure;
}

const response = createJson(dailyCaseData, getStateNames);

const json = JSON.stringify(response);

fs.writeFile('../data/dailyCaseData.json', json, (e) => {
    if(e) return console.log(e);
    console.log("Was able to write the file");
});