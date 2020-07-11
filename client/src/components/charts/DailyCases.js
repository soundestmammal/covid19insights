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
                    gridLines: {

                    },
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
    function renderLocation() {
        if(props.state !== undefined) {
            return(`New reported cases by day in ${props.state}`);
        }
        return(`New reported cases by day in ${props.county} County`);
    }

    return(
        <div style={{width: '700px', margin: '0 auto'}}>
            <h3>{renderLocation()}</h3>
            <Bar
                data={barData}
                options={options}
            />
        </div>
    );
}

export default DailyCases;