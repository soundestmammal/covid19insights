/**
 * Returns an array of processed data.
 * 
 * This function applies data tranformations on raw data and returns a cleaned output
 * 
 * @param {Array} contactTraceData 
 * @param {Array} usStateData
 * @returns {Array}
 */

module.exports = function(contactTraceData, usStateData){
    function calculateDailyCases(data, state) {

        // Filter the data so it is only data from one state
        const filtered = data.filter((dat) => dat.state === state);

        // Atomic data refers to an individual data point (x,y)
        function createAtomicData({date, cases}) {
            return {
                "x": date,
                "y": cases
            }
        }

        // Array of cumulative cases by day
        const caseData = [];

        for(let i = 0; i < filtered.length; i++) {
            let atomicData = createAtomicData(filtered[i]);
            caseData.push(atomicData);
        }
    
        const dailyCases = [];
        for(let i = 0; i < caseData.length; i++) {
          let tempObject = {};
          if(i === 0) {
            tempObject["x"] = caseData[i]["x"];
            tempObject["y"] = parseFloat(caseData[i]["y"]);
            dailyCases.push(tempObject);
          } else {
            tempObject["x"] = caseData[i]["x"];
            tempObject["y"] = caseData[i]["y"]-caseData[i-1]["y"];
            dailyCases.push(tempObject);
          }
        }
        return dailyCases;
    }

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
        const dailyCases = calculateDailyCases(usStateData, currentState);
        for(let j = 0; j < dailyCases.length; j++) {
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