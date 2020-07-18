const fs = require('fs');
const data = require('../data/contract-trace-percent-by-state.json');

const returnMe = (data) => {
    const returnMe = {};
    const stateNames = [...Object.keys(data)];
    console.log(stateNames);
    // I need to index the correct array.
    let stateArray;
    for(let i = 0; i < stateNames.length; i++) {
        stateArray = data[stateNames[i]];
        let sum = 0;
        let counter = 0;
        for(let j = stateArray.length - 7; j < stateArray.length; j++) {
            sum += stateArray[j]["y"];
            counter++;
        }
        console.log("Sum goes here ", sum);
        console.log("Counter goes here", counter);
        let mean = sum/counter;
        console.log("Mean goes here ", mean);
        console.log(mean);

        returnMe[stateNames[i]] = mean;
    }
    return returnMe;
}


const response = returnMe(data);
console.log(response);

const json = JSON.stringify(response);
fs.writeFile('risk-level-7-days.json', json, (err) => {
    if(err) throw err;
    console.log("This process was successful. The file was saved to disk.")
});
