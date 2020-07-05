import React from 'react';
import { Link } from 'react-router-dom';

const StatePath = (props) => {
    const { unique, draw, data, fill } = props;
    return(
        <Link to="/detail">
            <path
                key={'path' + unique}
                d={draw.shape}
                stroke="#fff"
                strokeWidth="1px"
                style={{cursor: "pointer", fill: fill}}
                onClick={(e) => {
                    props.nav(data);
                }}
                onMouseOver={(event) => {
                    event.target.style.fill = fill;
                }}
                onMouseOut={(event) => {
                    event.target.style.fill = fill;
                }}
            />
       </Link>
    );
}

export default StatePath;