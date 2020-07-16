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
            riskLevel = "low";
        } else if (positiveTestRate >= 3 && positiveTestRate < 10) {
            subtitle = "Indicates adequate testing";
            riskLevel = "medium";
        } else if(positiveTestRate >= 10 && positiveTestRate < 20) {
            subtitle = "Indicates insufficent testing";
            riskLevel = "high";
        } else if(positiveTestRate >= 20 && positiveTestRate <= 100) {
            subtitle = "Indicates dangerously little testing";
            riskLevel = "critical";
        } else {
            throw new Error("Positive test rate was not calculated right");
        }

        return(
            <div className="indicator-card-content">
                <span className="title">Positive Test Rate</span>
                <span className="subtitle">{subtitle}</span>
                <span className="data-value">{positiveTestRate}%</span>
                <span className={`risk ${riskLevel}`}>{riskLevel}</span>
            </div>
        );
    }

    function renderStateStatus() {
        let status;
        if(reproductionRate >= 1.2) {
            status = `${state} is either experiencing an outbreak or will be in the future.`;
        } else if (reproductionRate >= 1.1 && reproductionRate < 1.2) {
            status = `${state} is experiencing a rapid rise in cases.`;
        } else if (reproductionRate < 1.1 && reproductionRate >= 1) {
            status = `${state} is controlling the growth of cases.`;
        } else if (reproductionRate < 1) {
            status = `${state} is seeing a reduction in daily cases. The size of the outbreak is shrinking.`;
        } else {
            throw new Error("There was an error in rendering the State Status");
            // Have something handle a default case catch bugs.
        }

        return(
            <div className="state-status-container">
                <span className="state-name">{state}</span>
                <p>{status}</p>
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

        // I need to do a few things here

        // 1. I need to conditionally render the subtitle.
        let subtitle;
        if(reproductionRate < 1) {
            subtitle = "The number of daily cases is decreasing";
        } else {
            subtitle = "The number of daily cases is increasing";
        }
        console.log("Subtitle", subtitle);
        return(
            <div className="indicator-card-content">
                <span className="title">Reproduction rate</span>
                <span className="subtitle">{subtitle}</span>
                <span className="data-value">{reproductionRate}</span>
                <span className={`risk ${riskLevel}`} >{riskLevel}</span>
            </div>
        );
    }

    function renderContactTraceRateContent() {
        console.log("Contact Trace Rate", contactTraceRate);
        let subtitle;
        let riskLevel;
        if(contactTraceRate >= 90) {
            subtitle = "Contact tracing level is sufficient"
            riskLevel = "low";
        } else if(contactTraceRate < 90 && contactTraceRate >= 20) {
            subtitle = "Contact tracing level is fair";
            riskLevel = "medium";
        } else if (contactTraceRate >= 3 && contactTraceRate < 20) {
            subtitle = "Contact tracing level is failing";
            riskLevel = "high";
        } else if (contactTraceRate < 3) {
            subtitle = "Contact tracing has collapsed";
            riskLevel = "critical";
        }

        return(
            <div className="indicator-card-content">
                <span className="title">Contact Trace Rate</span>
                <span className="subtitle">{subtitle}</span>
                <span className="data-value">{contactTraceRate}%</span>
                <span className={`risk ${riskLevel}`}>{riskLevel}</span>
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
                    {renderReproductionRateContent()}
                </div>
                <div className="indicator-card">
                    {renderPositiveTestRateContent()}
                </div>
                <div className="indicator-card">
                    {renderContactTraceRateContent()}
                </div>
            </div>
            <div className="last-updated">
                <span>{"Updated June 27, 2020"}</span>
            </div>
        </div>
    )
}

export default Summary;