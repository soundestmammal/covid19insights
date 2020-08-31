import React from 'react';

const Indicators = () => {
    return(
        <div className="questions-container">
            <div className="question-cards-wrapper">
                <div className="question-card">
                    <div className="question-card-content">
                        <span className="question-card-title">How fast is COVID-19 spreading?</span>
                        <span className="question-card-text">How many cases can be expected from a single case?</span>
                    </div>
                </div>
                <div className="question-card">
                    <div className="question-card-content">
                        <span className="question-card-title">Is there widespread testing?</span>
                        <span className="question-card-text">Is a community only testing their sickest patients?</span>
                    </div>
                </div>
                <div className="question-card">
                    <div className="question-card-content">
                        <span className="question-card-title">Can contact tracing meet demand?</span>
                        <span className="question-card-text">What percentage of cases can be traced within 24 hours?</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Indicators;