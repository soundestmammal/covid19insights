import React from 'react';

const Summary = (props) => {
    const { state } = props;
    let { risk_level, reproduction_rate, positive_test_rate, contact_trace_rate } = props.data;
    positive_test_rate = Math.round(positive_test_rate * 1000)/10;
    contact_trace_rate = Math.round(contact_trace_rate*100);

    function renderPositiveTestRateContent() {
        let subtitle;
        let riskLevel;
        if(positive_test_rate < 3) {
            subtitle = "Indicates widespread testing";
            riskLevel = "low";
        } else if (positive_test_rate >= 3 && positive_test_rate < 10) {
            subtitle = "Indicates adequate testing";
            riskLevel = "medium";
        } else if(positive_test_rate >= 10 && positive_test_rate < 20) {
            subtitle = "Indicates insufficent testing";
            riskLevel = "high";
        } else if(positive_test_rate >= 20 && positive_test_rate <= 100) {
            subtitle = "Indicates dangerously little testing";
            riskLevel = "critical";
        } else {
            throw new Error("Positive test rate was calculated incorrectly");
        }

        return(
            <div className="indicator-card-content">
                <span className="title">Positive Test Rate</span>
                <span className="subtitle">{subtitle}</span>
                <span className="data-value">{positive_test_rate}%</span>
                <span className={`risk ${riskLevel}`}>{riskLevel}</span>
            </div>
        );
    }

    function renderStateStatus() {
        let status;
        if(reproduction_rate >= 1.2) {
            status = `${state} is either experiencing an outbreak or will be in the future.`;
        } else if (reproduction_rate >= 1.1 && reproduction_rate < 1.2) {
            status = `${state} is experiencing a rapid rise in cases.`;
        } else if (reproduction_rate < 1.1 && reproduction_rate >= 1) {
            status = `${state} is controlling the growth of cases.`;
        } else if (reproduction_rate < 1) {
            status = `${state} is seeing a reduction in daily cases. The size of the outbreak is shrinking.`;
        }

        return(
            <div className="state-status-container">
                <span className="state-name">{state}</span>
                <span>{status}</span>
            </div>
        );
    }

    function renderRiskLevel() {
        return (
            <div className="risk-level">
                <span className="top">{risk_level}</span>
                <div className={`risk-level-color-${risk_level}`}></div>
                <span className="">COVID Risk Level</span>
            </div>
        );
    }

    function renderReproductionRateContent() {
        let subtitle;
        if(reproduction_rate < 1) {
            subtitle = "The number of daily cases is decreasing";
        } else {
            subtitle = "The number of daily cases is increasing";
        }
        return(
            <div className="indicator-card-content">
                <span className="title">Reproduction rate</span>
                <span className="subtitle">{subtitle}</span>
                <span className="data-value">{reproduction_rate}</span>
                <span className={`risk ${risk_level}`} >{risk_level}</span>
            </div>
        );
    }

    function renderContactTraceRateContent() {
        let subtitle;
        let riskLevelColor;
        let text;
        if(contact_trace_rate >= 90) {
            subtitle = "Contact tracing is slowing the spread"
            riskLevelColor = "low";
            text = "high";
        } else if(contact_trace_rate < 90 && contact_trace_rate >= 20) {
            subtitle = "Contact tracing is lacking";
            riskLevelColor = "medium";
            text = "medium";
        } else if (contact_trace_rate >= 3 && contact_trace_rate < 20) {
            subtitle = "Contact tracing is failing";
            riskLevelColor = "high";
            text = "low";
        } else if (contact_trace_rate < 3) {
            subtitle = "Contact tracing has collapsed";
            riskLevelColor = "critical";
            text = "critical"
        }

        return(
            <div className="indicator-card-content">
                <span className="title">Contact Trace Rate</span>
                <span className="subtitle">{subtitle}</span>
                <span className="data-value">{contact_trace_rate}%</span>
                <span className={`risk ${riskLevelColor}`}>{text}</span>
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
                <span>{"Updated October 21, 2020"}</span>
            </div>
        </div>
    )
}

export default Summary;