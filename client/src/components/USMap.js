import React, { Component } from 'react';
import StatePath from './StatePath';
import states from '../json/states.json';
import riskData from '../json/risk-level-7-days.json';

class USMap extends Component {

    getRiskLevelColor = (riskLevel) => {
        let key;
        if(riskLevel >= 0.9) {
            key = 'low';
        } else if(riskLevel >= 0.2 && riskLevel < 0.9) {
            key = 'medium';
        } else if(riskLevel >= 0.07 && riskLevel < 0.20) {
            key = 'high';
        } else {
            key = 'outbreak';
        }
        const riskLevelColorMap = {
            low: "rgb(0, 212, 116)",
            medium: "rgb(255, 201, 0)",
            high: "rgb(255, 150, 0)",
            outbreak: "rgb(255, 0, 52)",
        }
        return riskLevelColorMap[key];
    }

    getRiskLevel = (state) => {
        const riskLevelData = riskData;
        const thisRisk = riskLevelData[state];
        return this.getRiskLevelColor(thisRisk);
    }

    render() {
        const map = states.map((state, index) => 
            <StatePath
                draw={state}
                unique={index}
                data={state.name}
                nav={this.props.nav}
                fill={this.getRiskLevel(state.name)}
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