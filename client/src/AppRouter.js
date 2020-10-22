import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';

import Navbar from './Navbar';
import Hero from './components/Hero';
import Indicators from './components/Indicators';
import USMap from './components/USMap';
import Dashboard from './components/Dashboard';
import About from './components/About';
import data from './json/join.json';

class AppRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentState: '',
      data: ''
      // summary: '',
      // dailyCases: '',
      // dailyCasesMA: '',
      // dailyDeaths: '',
      // dailyDeathsMA: '',
      // reproductionRate: '',
      // positiveTestRate: '',
      // contactTraceRate: '',
    };
  }

  navToState = (state) => {
    this.setState({ currentState: state });
  };

  // Fetch Data for the application
  // This is a temporary solution. This will be one fetch, one setState in the future.
  fetchData = () => {
    // const summary = await axios.get('/api/v1/summary');
    // const dailyCases = await axios.get(
    //   '/api/v1/daily_cases'
    // );
    // const dailyCasesMA = await axios.get(
    //   '/api/v1/daily_cases_moving_average'
    // );
    // const dailyDeaths = await axios.get(
    //   '/api/v1/daily_deaths'
    // );
    // const dailyDeathsMA = await axios.get(
    //   '/api/v1/daily_deaths_moving_average'
    // );
    // const positiveTestRate = await axios.get(
    //   '/api/v1/positive_test_rate'
    // );
    // const reproductionRate = await axios.get(
    //   '/api/v1/reproduction_rate'
    // );
    // const contactTraceRate = await axios.get(
    //   '/api/v1/contact_trace_rate'
    // );
    // const riskLevel = await axios.get(
    //   '/api/v1/risk_level'
    // );

    // this.setState({ summary: summary.data });
    // this.setState({ dailyCases: dailyCases.data });
    // this.setState({ dailyCasesMA: dailyCasesMA.data });
    // this.setState({ dailyDeaths: dailyDeaths.data });
    // this.setState({ dailyDeathsMA: dailyDeathsMA.data });
    // this.setState({ positiveTestRate: positiveTestRate.data });
    // this.setState({ reproductionRate: reproductionRate.data });
    // this.setState({ contactTraceRate: contactTraceRate.data });
    // this.setState({ riskLevel: riskLevel.data });
    this.setState({ data: data });
  };

  componentDidMount() {
    this.fetchData();
  }

  render() {
    // Wait for the data to be fetched...
    if (this.state.data === '') return null;
    console.log(this.state);
    return (
      <div>
        <Router>
          <Navbar />
          <Route exact path='/'>
            <Hero
              height={'300px'}
              nav={this.navToState}
              title={'Visualize United States COVID-19 Data'}
              subtitle={'See COVID data and risk level for your community'}
              style={{ marginTop: '56px' }}
            />
            <Indicators style={{ marginTop: '56px' }} />
            <USMap nav={this.navToState} data={this.state.data} />
          </Route>
          <Route path='/detail'>
            <Dashboard state={this.state.currentState} data={this.state.data[this.state.currentState]} />
          </Route>
          <Route path='/about'>
            <About />
          </Route>
        </Router>
      </div>
    );
  }
}

export default AppRouter;
