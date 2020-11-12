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
    };
  }

  navToState = (state) => {
    this.setState({ currentState: state });
  };

  fetchData = async () => {
    const response = await axios.get('/api/v1/data');
    this.setState({ data: response.data });
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
