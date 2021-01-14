import React from 'react';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import "../../App.css";

const ContactTraceRate = (props) => {
    const stateData = props.data;

    const recentDate = stateData[stateData.length - 1].x
    const lastUpdated = moment(recentDate, 'YYYY MM DD').format('MMMM DD, YYYY')

    const lineData = {
        datasets: [
            {
                label: 'Contact Trace Rate',
                data: stateData,
                borderColor: 'black',
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
                callbacks: {
                    title: function(tooltipItem, chart) {
                        // Change the date format
                        let date = tooltipItem[0].xLabel;
                        return moment(date, 'YYYY MM DD').format('MMMM DD, YYYY');
                    }
                }
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
                <p className="info-summary">At present, {props.state} is experiencing community spread of COVID-19.
                Contact Tracing efforts when combined with accessible testing infrastructure help reduce the spread of COVID-19.
                </p>
            </div>
        );
    }

    function renderFooter() {
        return(
            <div className="chart-footer">
                <p>Last updated {`${lastUpdated}`}.
                Experts recommend that at least 90% of contacts
                for each new case must be traced within 48 hours in order to contain COVID-19.
                Experts estimate that 5 contact tracers are needed for each new case.
                The number of contact tracers by State is sourced from testandtrace.com</p>
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