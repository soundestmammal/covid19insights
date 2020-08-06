const fs = require('fs');
const dailyCaseData = require('../data/computed/dailyCaseData.json');

function calcDailyCasesMovingAverage(filtered) {
    const movingAverageDailyCases = [];

    // I could just weight it first n-day average until day 7... (n < 7)
    for(let i = 0; i < 7; i++) {
        let tempObject = {};
        tempObject["x"] = filtered[i].x;
        tempObject["y"] = 0;
        movingAverageDailyCases.push(tempObject);
    }

    // Calculate the 7 day average set of points
    for(let i = 7; i < filtered.length; i++) {
        let sum = 0;
        let mean = 0;
        // This should be tested for an off by one error.
        // In fact, just refactor out 7day moving average f'n
        // More modularized, easier to test, ... 
        for(let j = i-6; j <= i; j++) {
            sum = parseFloat(sum) + parseFloat(filtered[j].y);
        }
        mean = sum/7;
        let tempObject = {};
        tempObject["x"] = filtered[i].x;
        tempObject["y"] = Math.round(mean);
        movingAverageDailyCases.push(tempObject);
    }
    return movingAverageDailyCases;
}

function createJson(data) {
    // 1. Create a dataStructure object to be returned
    const dataStructure = {};

    // 2. Create an array of US State names
    const stateNames = [...Object.keys(data)];

    // 3. Loop through each US State, apply data transformation and assign new data to dataStructure object
    for(let i = 0; i < stateNames.length; i++) {
        let currentState = stateNames[i];
        const dataForCurrentState = data[currentState];
        let movingAverageDataForCurrentState = calcDailyCasesMovingAverage(dataForCurrentState);
        dataStructure[stateNames[i]] = movingAverageDataForCurrentState;
    }
    return dataStructure;
}

const response = createJson(dailyCaseData);

const json = JSON.stringify(response);

fs.writeFile('../data/computed/daily-cases-moving-average.json', json, (e) => {
    if(e) return console.log(e);
    console.log("Was able to write the file");
});