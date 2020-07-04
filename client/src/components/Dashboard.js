import React, { Component } from 'react';
import Searchbar from './Searchbar';
import '../App.css';

class Dashboard extends Component {

    /**
     * Props for Summary:
     * String State
     * String Risk Level
     * Reproduction Rate
     * Positive Test Rate
     * Contact Trace Rate
     * Date Last Updated
     * 
     * Props for Charts
     * 
     */

    // Conditional data
    // Color of the background
    getRiskLevelColor = (riskLevel) => {
        const riskLevelColorMap = {
            green: "rgb(0, 212, 116)",
            yellow: "rgb(255, 201, 0)",
            orange: "rgb(255, 150, 0)",
            red: "rgb(255, 0, 52)",
        }
        return riskLevelColorMap[riskLevel];
    }

    riskLevelColorBackground = (findMeColor) => {
        
        const riskLevelColor = this.getRiskLevelColor(findMeColor);
        return <div style={{height: '380px', backgroundColor: `${riskLevelColor}`, zIndex: '1'}}></div>
    }

    render(){
        return(
            <div>
                <div className="dashboard-risk-level-background">
                    <Searchbar />
                </div>
                {this.riskLevelColorBackground(this.props.riskLevel)}
                <div className="summary-container">
                        <div className="overview-container">
                            <div className="state-status">
                                <div className="state-status-container">
                                    <span className="state-name">{this.props.state || "New York"}</span>
                                    <p>New York is on track to contain COVID. Cases are steadily decreasing and New York’s COVID preparedness meets or exceeds international standards.</p>
                                </div>
                            </div>
                            <div className="risk-level">
                                <span className="top">{this.props.risk || "Low"}</span>
                                <div className="risk-level-color"></div>
                                <span className="">COVID Risk Level</span>
                            </div>
                        </div>
                        <div className="indicator-container">
                            <div className="indicator-card">
                                <div className="indicator-card-content">
                                    <span className="title">Reproduction rate</span>
                                    <span className="subtitle">The number of daily cases are decreasing</span>
                                    <span className="data-value">{this.props.reproductionRate || "0.95"}</span>
                                    <span className="risk">Low</span>
                                </div>
                            </div>
                            <div className="indicator-card">
                                <div className="indicator-card-content">
                                    <span className="title">Positive Test Rate</span>
                                    <span className="subtitle">The number of daily cases is decreasing</span>
                                    <span className="data-value">1.07%</span>
                                    <span className="risk">Low</span>
                                </div>
                            </div>
                            <div className="indicator-card">
                                <div className="indicator-card-content">
                                    <span className="title">Contact Trace Rate</span>
                                    <span className="subtitle">The number of daily cases is decreasing</span>
                                    <span className="data-value">100%</span>
                                    <span className="risk">Low</span>
                                </div>
                            </div>
                            {/* <div className="indicator-card">Fourth data indicator</div> */}
                        </div>
                        <div className="last-updated">
                            <span>Updated June 27, 2020</span>
                        </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;