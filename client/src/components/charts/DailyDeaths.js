import React from 'react';
import { Bar } from 'react-chartjs-2';

const DailyDeaths = (props) => {
    const barData = {
        datasets: [
            {
                type: 'line',
                label: '7 day moving average',
                data: props.movingData,
                borderColor: '#555',
                strokeWidth: '2px',
                fill: true,
                backgroundColor: 'rgba(85, 85, 85, 0.1)',
                lineTension: 1,
                pointRadius: 0
            },
            {   
                type: 'bar',
                label: 'Daily Deaths',
                backgroundColor: '#bbbaba',
                hoverBackgroundColor: '#646363',
                data: props.barData,
            },
        ]
    }
    const options = {
            scales: {
                xAxes: [{
                    type: 'time',
                    gridLines: {

                    },
                    time: {
                        unit: 'month'
                    },
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize: 100,
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
            },
            maintainAspectRatio: false,
    }

    function renderInfo() {
        return(
            <div className="chart-info">
                <span className="info-title">Daily deaths</span>
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
            <div className="chart-height">
                <Bar
                    data={barData}
                    options={options}
                />
            </div>
            {renderFooter()}
        </div>
    );
}

export default DailyDeaths;