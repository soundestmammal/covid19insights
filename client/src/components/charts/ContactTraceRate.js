import React from 'react';
import { Line } from 'react-chartjs-2';
import "../../App.css";

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
                pointRadius: 0,
                borderWidth: 4,
            },
        ]
    }
    
    const options = {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'month'
                    },
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        max: 1,
                    },
                    gridLines: {
                        borderDash: [3, 2],
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
            maintainAspectRatio: false,
    }

    function renderInfo() {
        return(
            <div className="chart-info">
                <span className="info-title">Contact Trace Rate</span>
                <span className="info-state">{props.state}</span>
                <p className="info-summary">Per best available data, {props.state} has ???? contact tracers. With an average of ??? new daily cases, we estimate {props.state} needs ???? contact tracing staff to trace all new cases in 24 hours, before too many other people are infected. This means that {props.state} is likely able to trace ???% of new COVID infections in 24 hours. When this level of tracing is coupled with widely available testing, COVID can be contained without resorting to lockdowns.</p>
            </div>
        );
    }

    function renderFooter() {
        return(
            <div className="chart-footer">
                <p>Last updated 7/10/2020. Experts recommend that at least 90% of contacts for each new case must be traced within 48 hours in order to contain COVID. Experts estimate that tracing each new case within 48 hours requires an average of 5 contact tracers per new case, as well as fast testing.</p>
            </div>
        )
    }

    return(
        <div className="chart-wrapper">
            {renderInfo()}
            <div className="chart-height">
                <Line
                    data={lineData}
                    options={options}
                />
            </div>
            {renderFooter()}
        </div>
    );
}

export default ContactTraceRate;