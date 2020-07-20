import React from 'react';
import { Bar } from 'react-chartjs-2';

const DailyCases = (props) => {

    const barData = {
        datasets: [
            {
                type: 'line',
                label: '7 day moving average',
                data: props.movingData,
                borderColor: 'red',
                backgroundColor: 'rgba(207, 17, 17, 0.1)',
                fill: true,
                lineTension: 1,
                pointRadius: 0
            },
            {   
                type: 'bar',
                label: 'Positive Cases',
                backgroundColor: '#fac9c7',
                hoverBackgroundColor: 'red',
                data: props.barData,
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
                        stepSize: 1000,
                    },
                    gridLines: {
                        borderDash: [3, 2],
                        drawBorder: false,
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
            }
    }

    function renderInfo() {
        return(
            <div className="chart-info">
                <span className="info-title">Daily cases</span>
                <span className="info-state">{props.state}</span>
            </div>
        );
    }

    function renderFooter() {
        return(
            <div className="chart-footer">
                <p>Last updated 7/10/2020. Source: New York Times</p>
            </div>
        )
    }

    return(
        <div>
            {renderInfo()}
            <Bar
                data={barData}
                options={options}
            />
            {renderFooter()}
        </div>
    );
}

export default DailyCases;