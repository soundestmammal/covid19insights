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
import summaryData from '../json/summary.json';

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
        console.log(thisColor);
        return <div style={{height: '380px', backgroundColor: `${thisColor}` , zIndex: '1'}}></div>
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
        // const summaryProps = {
        //     state: this.props.state,
        //     risk: "Critical",
        //     reproductionRate: "1.38",
        //     positiveTestRate: currentPositiveTestRate,
        //     contactTraceRate: this.getContactTraceRate(this.props.state),
        //     updated: "June 27, 2020"
        // }
        return(
            <div>
                <div className="dashboard-risk-level-background">
                    <Searchbar />
                </div>
                {this.riskLevelColorBackground(summaryData[this.props.state].riskLevel)}
                <Summary state={this.props.state} data={summaryData[this.props.state]} />
                <div className="charts-container">
                    <ReproductionRate state={this.props.state} data={reproductionRateData[this.props.state]} />
                    <PositiveTestRate state={this.props.state} positiveTestRateData={positiveTestRateData} />
                    <ContactTraceRate state={this.props.state} data={contactTraceRateData[this.props.state]} />
                    <DailyCases state={this.props.state} barData={dailyCaseData[this.props.state]} movingData={dailyCaseDataMovingAverage[this.props.state]} />
                    <DailyDeaths state={this.props.state} barData={dailyDeathData[this.props.state]} movingData={dailyDeathDataMovingAverage[this.props.state]} />
                </div>
            </div>
        );
    }
}

export default Dashboard;