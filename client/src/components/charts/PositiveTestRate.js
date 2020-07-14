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
                        max: 0.5,
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

    function renderInfo() {
        return(
            <div className="chart-info">
                <span className="info-title">Positive Test Rate</span>
                <span className="info-state">{props.state}</span>
                <p classname="info-summary">A low percentage (1.1%) of COVID tests were positive, which suggests enough widespread, aggressive testing in {props.state} to detect most new cases. Identifying and isolating new cases can help contain COVID without resorting to lockdowns.</p>
            </div>
        );
    }

    function renderFooter() {
        return(
            <div className="chart-footer">
                <p>Last updated 7/04/2020. The World Health Organization recommends a positive test rate of below 10%. The most successful countries have rates less than 3%. Each data point represents the 7-day trailing average.</p>
            </div>
        )
    }

    return(
        <div style={{width: '1200px', margin: '0 auto'}}>
            {renderInfo()}
            <Line
                data={lineData}
                options={options}
            />
            {renderFooter()}
        </div>
    );
    // console.log("This is the data...", data[props.state]);
    // return<div>This is the PositiveTestRate chart for the state of {props.state}</div>
}

export default PositiveTestRate;