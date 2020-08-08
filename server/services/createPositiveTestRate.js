const fs = require('fs');
const csvToJson = require('convert-csv-to-json');
const data = require('../data/raw-json/positive-test-rate.json');
const states = require('../data/contract-trace-percent-by-state.json');
const statesShort = require('../data/states.json');

function csvToJsonHelper(){
    let fileInput = '../data/raw/positive-test-rate.csv';
    let fileOutput = '../data/raw-json/positive-test-rate.json';
    csvToJson.fieldDelimiter(',').generateJsonFileFromCsv(fileInput, fileOutput);
}

// csvToJsonHelper();

// Given an array of data from a single state
function calculateDailyData(filtered, currentState) {
            // This code below here is doing the... daily calculation
        // inOrderData is old->new data of cumulative testing
        const inOrderData = [...filtered.reverse()];
        for(let j = inOrderData.length-1; j >= 0; j--) {
            // if(inOrderData[i]['state'] !== "NY") continue;
            // console.log(inOrderData.length);
            // console.log(j);
            if(j === 0) {
                inOrderData[j]['positive-test-rate'] = parseFloat(inOrderData[j]['positive'])/parseFloat(inOrderData[j]['posNeg']);
            } else {
                let copyData = {...inOrderData[j]}

                let yesterdayPositive = parseFloat(inOrderData[j-1]['positive']);
                let todayPositive = parseFloat(inOrderData[j]['positive']);

                let yesterdayTotal = parseFloat(inOrderData[j-1]['posNeg']);
                let todayTotal = parseFloat(inOrderData[j]['posNeg']);

                copyData['positive'] = todayPositive-yesterdayPositive;
                copyData['posNeg'] = todayTotal-yesterdayTotal;

                if(copyData['positive'] < 0 || copyData['posNeg'] < 0) {

                    console.log("Current State", currentState);
                    console.log("Current day", copyData.date);
                    let emptyCopyData = { date: copyData['date'], positive: null, posNeg: null, 'positive-test-rate': null}
                    // console.log("yesterday positive", yesterdayPositive)
                    // console.log("today positive", todayPositive)
                    // console.log("yesterday negative", yesterdayNegative)
                    // console.log("today negative", todayNegative);
                    inOrderData[j] = {...emptyCopyData};
                } else {

                let ptr = function(){ 
                    let num = parseFloat(copyData['positive']);
                    let den = parseFloat(copyData['posNeg']);
                    if(den === 0) {
                        return 0;
                    }
                    return num/den;
                }();
                // console.log(ptr);
                ptr = ptr.toFixed(3);
                ptr = parseFloat(ptr);
                // if(typeof(ptr) === undefined || ptr === null) {
                //     ptr = 0;
                // } else if(ptr > 1){
                //     ptr = 1;
                // }
                copyData['positive-test-rate'] = ptr;
                inOrderData[j] = copyData;
            }
            }
        }
        return inOrderData;
}

function generateDataForClientSide(readData) {
    console.log("START: generate data for client side function!");
    const returnData = [...readData];
    for(let j = 0; j < readData.length; j++) {
        let tempObject = {};
        if(j < 6) {
            tempObject["x"] = readData[j]['date'];
            if(readData[j]["positive-test-rate"] === null){
                let prev = readData[j-1]["positive-test-rate"];
                let next = readData[j+1]["positive-test-rate"];
                if(prev === null || next === null) {
                    throw new Error("There are two consecutive revisisions")
                }
                readData[j]["positive-test-rate"] = (prev+next)/2;
                console.log("This is one of the times where there was a null value!");
            }
            tempObject["y"] = readData[j]["positive-test-rate"];
            returnData[j] = tempObject;
        } else {
            let sum = 0;
            let counter = 0;
            for(let k = j-6; k < j; k++) {
                // console.log(j);
                // console.log(readData[j]);
                // console.log(readData[j]["positive-test-rate"]);
                // console.log(readData[k]);
                let current = readData[k]['positive-test-rate'];

                if(current === null) {
                    console.log("Else block null value!!!");
                    let prev = readData[k-1]["positive-test-rate"];
                    let next = readData[k+1]["positive-test-rate"];
                    current = (prev+next)/2;
                }
                sum = sum + current;
                counter++;
            }

            let today = readData[j]['positive-test-rate'];
            if(today === null) {
                let prev = readData[j-1]['positive-test-rate'];
                let next = readData[j+1]['positive-test-rate'];
                today = (prev+next)/2;
            }
            sum = sum + today;
            counter++;
            // console.log("sum", sum);
            // console.log("counter",counter);
            let mean = (sum/counter);
            mean = mean.toFixed(3);
            mean = parseFloat(mean);

            // if(typeof(mean) !== Number) {
            //     console.log("This is what the mean is!!!", mean);
            //     throw new Error;
            // }
            tempObject["x"] = readData[j]['date'];
            tempObject["y"] = mean;
            returnData[j] = tempObject;
        }
    }
    console.log("END: generate data for client side function!");
    return returnData;
}

// key: state
// value: array of data
function createJson(data, states) {
    const dataStructure = {};
    const stateNames = [...Object.keys(states)];

    // Create a one-to-one mapping of state name to state "**"" id (shorthand)
    // "New York": "NY"
    const mapStateToShort = {};
    for(let i = 0; i < statesShort.length; i++) {
        let name = statesShort[i]['name'];
        let id = statesShort[i]['id'];
        mapStateToShort[name] = id;
    }

    // For each state, I need to locate it's data (array) and apply a transformation
    for(let i = 0; i < stateNames.length; i++) {
        let currentState = stateNames[i];

        // filtered is a new array that has only items from the current state
        const filtered = data.filter((data) => data.state === mapStateToShort[currentState] );

        let dailyData = calculateDailyData(filtered, currentState);

        // Trim down for UI        
        dataStructure[stateNames[i]] = generateDataForClientSide(dailyData);
    }
    return dataStructure;
}

const prod = createJson(data, states);
const json = JSON.stringify(prod);

fs.writeFile('../data/computed/positive-test-rate.json', json, (e) => {
    if(e) return console.log(e);
    console.log("Was able to write the file");
});