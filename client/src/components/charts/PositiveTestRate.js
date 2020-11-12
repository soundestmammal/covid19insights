import React from 'react';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import "../../App.css";

const PositiveTestRate = (props) => {
    const positive_test_rate = props.data;

    const lineData = {
        datasets: [
            {
                label: 'Positive test rate',
                data: positive_test_rate,
                borderColor: 'black',
                backgroundColor: 'transparent',
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
        const positive_test_rate = Math.round(props.summary.positive_test_rate.y*100);
        let summary;
        if(positive_test_rate < 3) {
            summary = `A low percentage ${positive_test_rate}% of COVID tests were positive, which suggests widespread testing is available.`;
        } else if (positive_test_rate >= 3 && positive_test_rate < 10) {
            summary = `A moderate percentage ${positive_test_rate}% of COVID tests were positive, which suggests testing is available but not widespread.`;
        } else if(positive_test_rate >= 10 && positive_test_rate < 20) {
            summary = `A large percentage ${positive_test_rate}% of COVID tests were positive, which suggests that testing is limited.`;
        } else if(positive_test_rate >= 20 && positive_test_rate <= 100) {
            summary = `A massive percentage ${positive_test_rate}% of COVID tests were positive, which suggests testing is unable to keep up with demand. With a rate this high, many cases may exist undetected.`;
        }
        return(
            <div className="chart-info">
                <span className="info-title">Positive Test Rate</span>
                <span className="info-state">{props.state}</span>
                <p className="info-summary">{summary}</p>
            </div>
        );
    }

    function renderFooter() {
        return(
            <div className="chart-footer">
                <p>Last updated 8/7/2020. The World Health Organization recommends a positive test rate of below 10%. The most successful countries have rates less than 3%. Each data point represents the 7-day trailing average.</p>
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

export default PositiveTestRate;