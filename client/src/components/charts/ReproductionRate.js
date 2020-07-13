import React from 'react';
import { Line } from 'react-chartjs-2';

const ReproductionRate = (props) => {
    const { data } = props;

    const lineData = {
        datasets: [
            {
                label: 'Reproduction Rate',
                data: data,
                borderColor: 'red',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                fill: true,
                lineTension: 1,
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
            return(`Reproduciton rate in the state of ${props.state}`);
        }
        return(`New reported cases by day in ${props.county} County`);
    }
    return(
        <div style={{width: '700px', margin: '0 auto'}}>
            <h3>{renderLocation()}</h3>
            <Line
                data={lineData}
                options={options}
            />
        </div>
    );
}

export default ReproductionRate;