const fs = require('fs');
const axios = require('axios');
let csvToJson = require('convert-csv-to-json');

// 1. Fetch the data from NYT
async function fetch() {
    const response = await axios.get("https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv");
    fs.writeFile('../data/raw/nyt-us-states.csv', response.data, (err) => {
        if(err) {
            throw new Error(err);
        } else {
            console.log("It was saved");
        }
    });
};

fetch();

// 2.  Transform the data from csv to json format and save it in the raw-json folder
let fileInputName = '../data/raw/nyt-us-states.csv';
let fileOutputName = '../data/raw-json/nyt-us-states.json';
csvToJson.fieldDelimiter(',').generateJsonFileFromCsv(fileInputName,fileOutputName);

// 3. Data is now in json format, call the service to prepare the data for client-side.