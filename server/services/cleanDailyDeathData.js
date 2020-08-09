const fs = require('fs');
const dailyCaseData = require('../data/raw-json/nyt-us-states.json');
const getStateNames = require('../data/contract-trace-percent-by-state.json');

function cleanDailyDeathData(filtered) {

  const deathData = [];
  for(let i = 0; i < filtered.length; i++) {
    let tempObject = {};
    tempObject["x"] = filtered[i].date;
    tempObject["y"] = filtered[i].deaths;
    deathData.push(tempObject);
  }

  const dailyDeaths = [];
  for(let i = 0; i < deathData.length; i++) {
    let tempObject = {};
    if(i === 0) {
      tempObject["x"] = deathData[i]["x"];
      tempObject["y"] = parseFloat(deathData[i]["y"]);
      dailyDeaths.push(tempObject);
    } else {
      tempObject["x"] = deathData[i]["x"];
      tempObject["y"] = deathData[i]["y"]-deathData[i-1]["y"];
      dailyDeaths.push(tempObject);
    }
  }
  return dailyDeaths;
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
      let dailyData = cleanDailyDeathData(filtered);
      dataStructure[stateNames[i]] = dailyData;
  }
  return dataStructure;
}

const response = createJson(dailyCaseData, getStateNames);

const json = JSON.stringify(response);

fs.writeFile('../data/computed/dailyDeathData.json', json, (e) => {
  if(e) throw new Error;
  console.log("Successfully wrote the file to disk");
})