import React from 'react';
import { Link } from 'react-router-dom';

import openNewTab from './util/openNewTab';

const NavBar = () => {
    return (
        <div className="nav-bar">
            <div className="nav-bar-inner">
                <div className="nav-bar-left">
                    <Link to="/" className="nav-bar-title">COVID-19 Insights</Link>
                </div>
                <div className="nav-bar-right">
                    <Link to="/" className="nav-bar-link">Map</Link>
                    <Link to="/about" className="nav-bar-link">About</Link>
                    <div className="nav-bar-link" onClick={() => openNewTab("https://www.github.com/soundestmammal/covid19insights")}>Code</div>
                </div>
            </div>
        </div>
    );
}

export default NavBar;