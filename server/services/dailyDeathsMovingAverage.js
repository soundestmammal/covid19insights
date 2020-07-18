const fs = require('fs');
const dailyDeathData = require('../data/dailyDeathData.json');

function calcDailyDeathsMovingAverage(filtered) {
  const movingAverageDailyDeaths = [];

  for(let i = 0; i < 7; i++) {
    let tempObject = {};
    tempObject["x"] = filtered[i].x;
    tempObject["y"] = 0;
    movingAverageDailyDeaths.push(tempObject);
  }
  
  // Calculate the 7 day average set of points
  for(let i = 7; i < filtered.length; i++) {
    let sum = 0;
    let mean = 0;
    for(let j = i-6; j <= i; j++) {
      sum = parseFloat(sum) + parseFloat(filtered[j].y);
    }
    mean = sum/7;
    let tempObject = {};
    tempObject["x"] = filtered[i].x;
    tempObject["y"] = Math.round(mean);
    movingAverageDailyDeaths.push(tempObject);
  }
  return movingAverageDailyDeaths;
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
    let movingAverageDataForCurrentState = calcDailyDeathsMovingAverage(dataForCurrentState);
    dataStructure[stateNames[i]] = movingAverageDataForCurrentState;
  }
  return dataStructure;
}

const response = createJson(dailyDeathData);

const json = JSON.stringify(response);

fs.writeFile('../data/daily-deaths-moving-average.json', json, (e) => {
    if(e) return console.log(e);
    console.log("Was able to write the file");
});