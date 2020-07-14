import React from 'react';
import { Line } from 'react-chartjs-2';
import "../../App.css";

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
            return(`Reproduction rate in the state of ${props.state}`);
        }
        return(`New reported cases by day in ${props.county} County`);
    }

    function renderInfo() {
        return(
            <div className="chart-info">
                <span className="info-title">Reproduction Rate</span>
                <span className="info-state">{props.state}</span>
                <p classname="info-summary">On average, each person in {props.state} with COVID is infecting 1.13 other people. As such, the total number of active cases in {props.state} is growing at an unsustainable rate. If this trend continues, the hospital system may become overloaded. Caution is warranted.</p>
            </div>
        );
    }

    function renderFooter() {
        return(
            <div className="chart-footer">
                <p>Last updated 7/04/2020. Each data point represents the estimated daily reproduction rate. I present the most recent seven days of data as a dashed line, as data is often revised by states several days after reporting. The blue shadow above and below the line represent an 80% confidence interval. Source: Rt.live</p>
            </div>
        )
    }
    return(
        <div style={{width: '700px', margin: '25px auto'}}>
            {renderInfo()}
            <Line
                data={lineData}
                options={options}
            />
            {renderFooter()}
        </div>
    );
}

export default ReproductionRate;