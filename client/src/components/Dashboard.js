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
        return <div style={{height: '380px', backgroundColor: `${thisColor}` , zIndex: '1'}}></div>
    }

    getContactTraceRate = (state) => {
        const riskLevelData = this.props.data.riskLevel;
        let num = riskLevelData[state];
        num = num * 100;
        num = Math.round(num);
        return num;
    }

    render(){
        const { reproductionRate, positiveTestRate, contactTraceRate, dailyCases, dailyCasesMA, dailyDeaths, dailyDeathsMA, summary } = this.props.data;
        const { state } = this.props;
        return(
            <div>
                <div className="dashboard-risk-level-background">
                    
                </div>
                {this.riskLevelColorBackground(summary[state].riskLevel)}
                <Summary state={state} data={summary[state]} />
                <div className="charts-container">
                    <ReproductionRate state={state} data={reproductionRate[state]} summary={summary[state]} />
                    <PositiveTestRate state={state} positiveTestRateData={positiveTestRate} summary={summary[state]} />
                    <ContactTraceRate state={state} data={contactTraceRate[state]} summary={summary[state]} />
                    <DailyCases state={state} barData={dailyCases[state]} movingData={dailyCasesMA[state]} />
                    <DailyDeaths state={state} barData={dailyDeaths[state]} movingData={dailyDeathsMA[state]} />
                </div>
            </div>
        );
    }
}

export default Dashboard;