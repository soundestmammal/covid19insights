import React from 'react';
import { Line } from 'react-chartjs-2';

const PositiveTestRate = (props) => {
    const stateData = props.positiveTestRateData[props.state];

    const lineData = {
        datasets: [
            {
                label: 'Positive test rate',
                data: stateData,
                borderColor: 'green',
                backgroundColor: 'rgba(0, 255, 0, 0.2)',
                fill: true,
                // lineTension: 1,
                pointRadius: 0,
                borderWidth: 4,
            },
        ]
    }
    
    const options = {
            scales: {
                xAxes: [{
                    type: 'time',
                    gridLines: {
                        // display: false
                    },
                    time: {
                        unit: 'month'
                    },
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        max: 1,
                    },
                    gridLines: {
                        borderDash: [3, 2],
                        // drawBorder: false,
                    }
                }]
            },
            hover: {
                intersect: false,
                animationDuration: 100
            },
            tooltips: {
                intersect: false,
                mode: 'index',
            },
            animation: {
                duration: 1000
            },
    }
    function renderLocation() {
        if(props.state !== undefined) {
            return(`7 day moving average of the positive test rate in the state of ${props.state}`);
        }
        return(`New reported cases by day in ${props.county} County`);
    }
    return(
        <div style={{width: '700px', margin: '0 auto'}}>
            <h3>{renderLocation()}</h3>
            <Line
                data={lineData}
                options={options}
            />
        </div>
    );
    // console.log("This is the data...", data[props.state]);
    // return<div>This is the PositiveTestRate chart for the state of {props.state}</div>
}

export default PositiveTestRate;

