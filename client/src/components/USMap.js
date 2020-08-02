import React, { Component } from 'react';
import StatePath from './StatePath';
import states from '../json/states.json';

class USMap extends Component {

    getRiskLevelColor = (state) => {
        let riskLevel = this.props.data[state].riskLevel;
        const riskLevelColorMap = {
            low: "rgb(0, 212, 116)",
            medium: "rgb(255, 201, 0)",
            high: "rgb(255, 150, 0)",
            critical: "rgb(255, 0, 52)",
        }
        return riskLevelColorMap[riskLevel];
    }

    render() {
        const filteredStates = states.filter(state => state.name !== "Washington DC");
        const map = filteredStates.map((state, index) => 
            <StatePath
                draw={state}
                unique={index}
                data={state.name}
                nav={this.props.nav}
                fill={this.getRiskLevelColor(state.name)}
            > 
            </StatePath>
        );
        return (
            <div className="us-map-container">
                <svg viewBox="0 0 960 600">
                    {map}
                </svg>
            </div>
        );
    }
}

export default USMap;