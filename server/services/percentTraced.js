const fs = require('fs');
const csvToJson = require('convert-csv-to-json');

const data = require('../data/raw-json/contact-trace.json');
const dailyCaseDataMA = require('../data/computed/daily-cases-moving-average.json');

// Transform the data into JSON format
function csvToJsonHelper(){
    let fileInput = '../data/raw/contact-trace.csv';
    let fileOutput = '../data/raw-json/contact-trace.json';
    csvToJson.fieldDelimiter(',').generateJsonFileFromCsv(fileInput, fileOutput);
}

// csvToJsonHelper();

/**
 * Returns an array of processed data.
 * 
 * This function applies data tranformations on raw data and returns a cleaned output
 * 
 * @param {Array} contactTraceData 
 * @param {Array} usStateData
 * @returns {Array}
 */

 function calculate(contactTraceData){

    function calcPercentTraced(cases, tracers) {
        let dailyTracingCapacity = tracers/5;
        let percentTraced = dailyTracingCapacity/cases;
        if(percentTraced > 1) {
            percentTraced = 1;
        }
        return percentTraced;
    }

    const dataStructure = {};
    for(let i = 0; i < contactTraceData.length; i++) {
        let currentState = contactTraceData[i].State;
        if(currentState === "District of Columbia") continue;
        let tempArray = [];
        // X is data
        const dailyCases = dailyCaseDataMA[currentState];
        for(let j = 0; j < dailyCases.length; j++) {
            if(j < 6) continue;
            let dataPoint = {};
            dataPoint["x"] = dailyCases[j].x;
            dataPoint["y"] = calcPercentTraced(dailyCases[j].y, contactTraceData[i]["#ofContactTracers"]);
            tempArray.push(dataPoint);
        }
        dataStructure[currentState] = tempArray;
        console.log("Length of the Data Structure", Object.keys(dataStructure).length);
    }
    return dataStructure;
}

const prod = calculate(data);

const json = JSON.stringify(prod);

fs.writeFile('../data/computed/contact-trace.json', json, (e) => {
    if(e) return console.log(e);
    console.log("Was able to write the file");
});