import React from 'react';

const Summary = (props) => {

    const {state, risk, reproductionRate, positiveTestRate, contactTraceRate, updated } = props;

    return (
        <div className="summary-container">
            <div className="overview-container">
                <div className="state-status">
                    <div className="state-status-container">
                        <span className="state-name">{state || "New York"}</span>
                        <p>New York is on track to contain COVID. Cases are steadily decreasing and New York’s COVID preparedness meets or exceeds international standards.</p>
                    </div>
                </div>
                <div className="risk-level">
                    <span className="top">{risk || "Low"}</span>
                    <div className="risk-level-color"></div>
                    <span className="">COVID Risk Level</span>
                </div>
            </div>
            <div className="indicator-container">
                <div className="indicator-card">
                    <div className="indicator-card-content">
                        <span className="title">Reproduction rate</span>
                        <span className="subtitle">The number of daily cases are decreasing</span>
                        <span className="data-value">{reproductionRate || "0.95"}%</span>
                        <span className="risk">Low</span>
                    </div>
                </div>
                <div className="indicator-card">
                    <div className="indicator-card-content">
                        <span className="title">Positive Test Rate</span>
                        <span className="subtitle">The number of daily cases is decreasing</span>
                        <span className="data-value">{positiveTestRate || "1.00"}%</span>
                        <span className="risk">Low</span>
                    </div>
                </div>
                <div className="indicator-card">
                    <div className="indicator-card-content">
                        <span className="title">Contact Trace Rate</span>
                        <span className="subtitle">The number of daily cases is decreasing</span>
                        <span className="data-value">{contactTraceRate || "100"}%</span>
                        <span className="risk">Low</span>
                    </div>
                </div>
                {/* <div className="indicator-card">Fourth data indicator</div> */}
            </div>
            <div className="last-updated">
                <span>{updated || "Updated June 27, 2020"}</span>
            </div>
        </div>
    )
}

export default Summary;