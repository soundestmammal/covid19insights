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
                    max: 0.5,
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
    }

    function renderInfo() {
        const positiveTestRate = Math.round(props.summary.positiveTestRate.y*100);
        let summary;
        if(positiveTestRate < 3) {
            summary = `A low percentage ${positiveTestRate}% of COVID tests were positive, which suggests widespread testing is available.`;
        } else if (positiveTestRate >= 3 && positiveTestRate < 10) {
            summary = `A moderate percentage ${positiveTestRate}% of COVID tests were positive, which suggests testing is available but not widespread.`;
        } else if(positiveTestRate >= 10 && positiveTestRate < 20) {
            summary = `A large percentage ${positiveTestRate}% of COVID tests were positive, which suggests that testing is limited.`;
        } else if(positiveTestRate >= 20 && positiveTestRate <= 100) {
            summary = `A massive percentage ${positiveTestRate}% of COVID tests were positive, which suggests testing is unable to keep up with demand. With a rate this high, many cases may exist undetected.`;
        }
        return(
            <div className="chart-info">
                <span className="info-title">Positive Test Rate</span>
                <span className="info-state">{props.state}</span>
                <p classname="info-summary">{summary}</p>
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
        <div>
            {renderInfo()}
            <Line
                data={lineData}
                options={options}
            />
            {renderFooter()}
        </div>
    );
}

export default PositiveTestRate;