import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';

import Navbar from './Navbar';
import Hero from './components/Hero';
import Indicators from './components/Indicators';
import USMap from './components/USMap';
import Dashboard from './components/Dashboard';
import About from './components/About';

class AppRouter extends Component {

    constructor(props) {
      super(props);
      this.state = {
        currentState: "",
        summary: "",
        dailyCases: "",
        dailyCasesMA: "",
        dailyDeaths: "",
        dailyDeathsMA: "",
        reproductionRate: "",
        positiveTestRate: "",
        contactTraceRate: "",
      }
    }

    navToState = (state) => {
      this.setState({ currentState: state });
    }

    // Fetch Data for the application
    // This is a temporary solution. This will be one fetch, one setState in the future.
    fetchData = async () => {  
        const summary = await axios.get('https://api.c19insights.io/v1/summary');
        const dailyCases = await axios.get('https://api.c19insights.io/v1/daily_cases');
        const dailyCasesMA = await axios.get('https://api.c19insights.io/v1/daily_cases_moving_average');
        const dailyDeaths = await axios.get('https://api.c19insights.io/v1/daily_deaths');
        const dailyDeathsMA = await axios.get('https://api.c19insights.io/v1/daily_deaths_moving_average');
        const positiveTestRate = await axios.get('https://api.c19insights.io/v1/positive_test_rate');
        const reproductionRate = await axios.get('https://api.c19insights.io/v1/reproduction_rate');
        const contactTraceRate = await axios.get('https://api.c19insights.io/v1/contact_trace_rate');
        const riskLevel = await axios.get('https://api.c19insights.io/v1/risk_level');

        this.setState({ summary: summary.data });
        this.setState({ dailyCases: dailyCases.data })
        this.setState({ dailyCasesMA: dailyCasesMA.data });
        this.setState({ dailyDeaths: dailyDeaths.data});
        this.setState({ dailyDeathsMA: dailyDeathsMA.data });
        this.setState({ positiveTestRate: positiveTestRate.data });
        this.setState({ reproductionRate: reproductionRate.data });
        this.setState({ contactTraceRate: contactTraceRate.data });
        this.setState({ riskLevel: riskLevel.data });
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {

        // Wait for the data to be fetched...
        if(this.state.summary === "") return null;
        console.log(this.state);
        return(
            <div>
                <Router>
                    <Navbar />
                    <Route exact path="/">
                        <Hero  height={'300px'} nav={this.navToState}  title={"Visualize United States COVID-19 Data"} subtitle={"See COVID data and risk level for your community"} style={{marginTop: '56px'}}/>
                        <Indicators style={{marginTop: '56px'}}/>
                        <USMap nav={this.navToState} data={this.state.summary} /> 
                    </Route>
                    <Route path="/detail">
                        <Dashboard state={this.state.currentState} data={this.state} />
                    </Route>
                    <Route path="/about">
                        <About />
                    </Route>
                </Router>
            </div>
        );
    }
}

export default AppRouter;