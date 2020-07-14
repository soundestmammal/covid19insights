import React, { Component } from 'react';
import '../App.css';

// Data
import riskData from '../json/risk-level-7-days.json';
import positiveTestRateData from '../json/positive-test-rates-for-ui.json';
import dailyCaseData from '../json/dailyCaseData.json';
import dailyCaseDataMovingAverage from '../json/daily-cases-moving-average.json';
import dailyDeathData from '../json/dailyDeathData.json';
import dailyDeathDataMovingAverage from '../json/daily-deaths-moving-average.json';
import contactTraceRateData from '../json/contact-trace-percent-by-state.json';
import reproductionRateData from '../json/reproduction-rates-for-ui.json';

// Components
import Searchbar from './Searchbar';
import Summary from './Summary';
import PositiveTestRate from './charts/PositiveTestRate';
import DailyCases from './charts/DailyCases';
import DailyDeaths from './charts/DailyDeaths';
import ContactTraceRate from './charts/ContactTraceRate';
import ReproductionRate from './charts/ReproductionRate';

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
        
        // const riskLevelColor = this.getRiskLevelColor(findMeColor);
        return <div style={{height: '380px', backgroundColor: `${findMeColor}`, zIndex: '1'}}></div>
    }

    getRiskLevelColor = (riskLevel) => {
        let key;
        if(riskLevel >= 0.9) {
            key = 'low';
        } else if(riskLevel >= 0.2 && riskLevel < 0.9) {
            key = 'medium';
        } else if(riskLevel >= 0.07 && riskLevel < 0.20) {
            key = 'high';
        } else {
            key = 'outbreak';
        }
        const riskLevelColorMap = {
            low: "rgb(0, 212, 116)",
            medium: "rgb(255, 201, 0)",
            high: "rgb(255, 150, 0)",
            outbreak: "rgb(255, 0, 52)",
        }
        return this.riskLevelColorBackground(riskLevelColorMap[key]);
    }

    getRiskLevel = (state) => {
        const riskLevelData = riskData;
        const thisRisk = riskLevelData[state];
        return this.getRiskLevelColor(thisRisk);
    }

    getContactTraceRate = (state) => {
        const riskLevelData = riskData;
        let num = riskLevelData[state];
        num = num * 100;
        num = Math.round(num);
        return num;
    }

    render(){
        let thisStateData = positiveTestRateData[this.props.state];
        let indexOfLastDay = thisStateData.length-1;
        let currentPositiveTestRate = (thisStateData[indexOfLastDay].y *100).toFixed(1);
        const summaryProps = {
            state: this.props.state,
            risk: "Outbreak",
            reproductionRate: "1.38",
            positiveTestRate: currentPositiveTestRate,
            contactTraceRate: this.getContactTraceRate(this.props.state),
            updated: "June 27, 2020"
        }
        return(
            <div>
                <div className="dashboard-risk-level-background">
                    <Searchbar />
                </div>
                {this.getRiskLevel(this.props.state)}
                <Summary {...summaryProps} />
                <div className="charts-container">
                    <ReproductionRate state={this.props.state} data={reproductionRateData[this.props.state]} />
                    <PositiveTestRate state={this.props.state} positiveTestRateData={positiveTestRateData} />
                    <DailyCases state={this.props.state} barData={dailyCaseData[this.props.state]} movingData={dailyCaseDataMovingAverage[this.props.state]} />
                    <DailyDeaths state={this.props.state} barData={dailyDeathData[this.props.state]} movingData={dailyDeathDataMovingAverage[this.props.state]} />
                    <ContactTraceRate state={this.props.state} data={contactTraceRateData[this.props.state]} />
                </div>
            </div>
        );
    }
}

export default Dashboard;