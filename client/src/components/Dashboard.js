import React, { Component } from 'react';
import '../App.css';

// Components
import Summary from './Summary';
import PositiveTestRate from './charts/PositiveTestRate';
import DailyCases from './charts/DailyCases';
import DailyDeaths from './charts/DailyDeaths';
import ContactTraceRate from './charts/ContactTraceRate';
import ReproductionRate from './charts/ReproductionRate';

class Dashboard extends Component {

    // Conditional data color of the background
    getRiskLevelColor = (riskLevel) => {
        const riskLevelColorMap = {
            low: "rgb(0, 212, 116)",
            medium: "rgb(255, 201, 0)",
            high: "rgb(255, 150, 0)",
            critical: "rgb(255, 0, 52)",
        }
        return riskLevelColorMap[riskLevel];
    }

    // This actually returns the div...
    riskLevelColorBackground = (riskLevel) => {
        let thisColor = this.getRiskLevelColor(riskLevel);
        return <div style={{height: '440px', backgroundColor: `${thisColor}` , zIndex: '1'}}></div>
    }

    getContactTraceRate = (state) => {
        const riskLevelData = this.props.data.riskLevel;
        let num = riskLevelData[state];
        num = num * 100;
        num = Math.round(num);
        return num;
    }

    render(){
        const { reproduction_rate, positive_test_rate, contact_trace_rate, daily_cases, daily_cases_moving_average, daily_deaths, daily_deaths_moving_average, summary } = this.props.data;
        const { state } = this.props;
        return(
            <div>
                {this.riskLevelColorBackground(summary.risk_level)}
                <Summary state={state} data={summary} />
                <div className="charts-container">
                    <ReproductionRate state={state} data={reproduction_rate} summary={summary} />
                    <PositiveTestRate state={state} data={positive_test_rate} summary={summary} />
                    <ContactTraceRate state={state} data={contact_trace_rate} summary={summary} />
                    <DailyCases state={state} barData={daily_cases} movingData={daily_cases_moving_average} />
                    <DailyDeaths state={state} barData={daily_deaths} movingData={daily_deaths_moving_average} />
                </div>
            </div>
        );
    }
}

export default Dashboard;