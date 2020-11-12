import * as React from 'react';
import StatePath from './StatePath';
import states from '../json/states.json';
import getRiskLevelColor from '../util/getRiskLevelColor';

const USMap = ({ nav, data }) => {

    const filteredStates = states.filter(state => state.name !== "Washington DC");
        const map = filteredStates.map((state, index) => 
            <StatePath
                draw={state}
                unique={index}
                key={index}
                data={state.name}
                nav={nav}
                fill={getRiskLevelColor(data[state.name].summary.risk_level)}
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

export default USMap;