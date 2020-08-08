import React from 'react';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import "../../App.css";

const ReproductionRate = (props) => {
    const { data, summary } = props;
    const reproductionRate = summary.reproductionRate.y;
    const lineData = {
        datasets: [
            {
                label: 'Reproduction Rate',
                data: data,
                borderColor: 'red',
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
                        max: 2,
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
                <span className="info-title">Reproduction Rate</span>
                <span className="info-state">{props.state}</span>
                <p className="info-summary">On average, each person in {props.state} with COVID is infecting {reproductionRate} other people. As such, the total number of active cases in {props.state} is growing at an unsustainable rate. If this trend continues, the hospital system may become overloaded. Caution is warranted.</p>
            </div>
        );
    }

    function renderFooter() {
        // Each data point represents the estimated daily reproduction rate. I present the most recent seven days of data as a dashed line, as data is often revised by states several days after reporting. The blue shadow above and below the line represent an 80% confidence interval.
        return(
            <div className="chart-footer">
                <p>Last updated 8/7/2020. Source: Rt.live</p>
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

export default ReproductionRate;