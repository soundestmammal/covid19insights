import React, { Component } from 'react';
import StatePath from './StatePath';
import states from '../json/states.json';
// Load in Color Data...

class USMap extends Component {

    getRiskLevelColor = (riskLevel) => {
        const riskLevelColorMap = {
            low: "rgb(0, 212, 116)",
            medium: "rgb(255, 201, 0)",
            high: "rgb(255, 150, 0)",
            outbreak: "rgb(255, 0, 52)",
        }
        return riskLevelColorMap[riskLevel];
    }

    getRiskLevel = (state) => {
        const riskLevelByState = [];
        const thisRisk = riskLevelByState[state];
        return this.getRiskLevelColor(thisRisk)
    }

    render() {
        const map = states.map((state, index) => 
            <StatePath
                draw={state}
                unique={index}
                data={state.name}
                nav={this.props.nav}
                fill={this.getRiskLevelColor("low")}
            > 
            </StatePath>
        );
        return (
            <div style={{width: '1000px', margin: '0 auto'}}>
                <svg viewBox="0 0 960 600">
                    {map}
                </svg>
            </div>
        );
    }
}

export default USMap;