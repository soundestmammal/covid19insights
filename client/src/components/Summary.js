import React from 'react';

const Summary = (props) => {
    console.log(props.data);
    const { state } = props;
    let { riskLevel, reproductionRate, positiveTestRate, contactTraceRate } = props.data;
    reproductionRate = reproductionRate.y;
    positiveTestRate = Math.round(positiveTestRate.y*100);
    contactTraceRate = Math.round(contactTraceRate.y*100);

    function renderPositiveTestRateContent() {
        console.log("This is from within the positive test rate content", positiveTestRate);
        let subtitle;
        let riskLevel;
        if(positiveTestRate < 3) {
            subtitle = "Indicates widespread testing";
            riskLevel = "Low";
        } else if (positiveTestRate >= 3 && positiveTestRate < 10) {
            subtitle = "Indicates adequate testing";
            riskLevel = "Medium";
        } else if(positiveTestRate >= 10 && positiveTestRate < 20) {
            subtitle = "Indicates insufficent testing";
            riskLevel = "High";
        } else if(positiveTestRate >= 20 && positiveTestRate <= 100) {
            subtitle = "Indicates dangerously little testing";
            riskLevel = "Critical";
        } else {
            throw new Error("Positive test rate was not calculated right");
        }

        return(
            <div className="indicator-card-content">
                <span className="title">Positive Test Rate</span>
                <span className="subtitle">{subtitle}</span>
                <span className="data-value">{positiveTestRate}%</span>
                <span className="risk">{riskLevel}</span>
            </div>
        );
    }

    function renderStateStatus() {
        return(
            <div className="state-status-container">
                <span className="state-name">{state}</span>
                <p>{state} is on track to contain COVID. Cases are steadily decreasing and {state}’s COVID preparedness meets or exceeds international standards.</p>
            </div>
        );
    }

    function renderRiskLevel() {
        console.log(riskLevel);
        return (
            <div className="risk-level">
                <span className="top">{riskLevel}</span>
                <div className={`risk-level-color-${riskLevel}`}></div>
                <span className="">COVID Risk Level</span>
            </div>
        );
    }

    function renderReproductionRateContent() {

        // if(reproductionRate > )

        return(
            <div className="indicator-card-content">
                <span className="title">Reproduction rate</span>
                <span className="subtitle">The number of daily cases are decreasing</span>
                <span className="data-value">{reproductionRate}</span>
                <span className="risk">Low</span>
            </div>
        );
    }

    return (
        <div className="summary-container">
            <div className="overview-container">
                <div className="state-status">
                    {renderStateStatus()}
                </div>
                {renderRiskLevel()}
            </div>
            <div className="indicator-container">
                <div className="indicator-card">
                    <div className="indicator-card-content">
                        <span className="title">Reproduction rate</span>
                        <span className="subtitle">The number of daily cases are decreasing</span>
                        <span className="data-value">{reproductionRate}</span>
                        <span className="risk">Low</span>
                    </div>
                </div>
                <div className="indicator-card">
                    {renderPositiveTestRateContent()}
                </div>
                <div className="indicator-card">
                    <div className="indicator-card-content">
                        <span className="title">Contact Trace Rate</span>
                        <span className="subtitle">The number of daily cases is decreasing</span>
                        <span className="data-value">{contactTraceRate}%</span>
                        <span className="risk">Low</span>
                    </div>
                </div>
            </div>
            <div className="last-updated">
                <span>{"Updated June 27, 2020"}</span>
            </div>
        </div>
    )
}

export default Summary;