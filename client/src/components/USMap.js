import React, { Component } from 'react';
import StatePath from './StatePath';
import states from '../json/states.json';

class USMap extends Component {
    render() {
        const map = states.map((state, index) => 
            <StatePath
                draw={state}
                unique={index}
                data={state.name}
                nav={this.props.nav}
                fill={'blue'}
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