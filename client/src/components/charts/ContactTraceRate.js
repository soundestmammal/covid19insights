import React from 'react';
import { Line } from 'react-chartjs-2';

const ContactTraceRate = (props) => {
    const stateData = props.data;

    const lineData = {
        datasets: [
            {
                label: 'Contact Trace Rate',
                data: stateData,
                borderColor: 'orange',
                backgroundColor: 'rgba(0, 0, 0, 0)',
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
            return(`Contact trace rate in ${props.state}`);
        }
        return(`New reported cases by day in ${props.county} County`);
    }

    function renderInfo() {
        return(
            <div className="chart-info">
                <span className="info-title">Contact Trace Rate</span>
                <span className="info-state">{props.state}</span>
                <p classname="info-summary">Per best available data, {props.state} has 9,600 contact tracers. With an average of 651 new daily cases, we estimate New York needs 3,255 contact tracing staff to trace all new cases in 48 hours, before too many other people are infected. This means that New York is likely able to trace 100% of new COVID infections in 48 hours. When this level of tracing is coupled with widely available testing, COVID can be contained without resorting to lockdowns.</p>
            </div>
        );
    }

    function renderFooter() {
        return(
            <div className="chart-footer">
                <p>Last updated 7/10/2020. Experts recommend that at least 90% of contacts for each new case must be traced within 48 hours in order to contain COVID. Experts estimate that tracing each new case within 48 hours requires an average of 5 contact tracers per new case, as well as fast testing. Learn more about our methodology and our data sources (for contact tracing data, we partner with testandtrace.com).</p>
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
}

export default ContactTraceRate;