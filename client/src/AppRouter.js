import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';

import Navbar from './Navbar';
import Hero from './components/Hero';
import Indicators from './components/Indicators';
import USMap from './components/USMap';
import Dashboard from './components/Dashboard';

class AppRouter extends Component {

    constructor(props) {
      super(props);
      this.state = {
        currentState: "",
        summary: "",
      }
    }

    navToState = (state) => {
      this.setState({ currentState: state });
    }

    // Fetch Data for the application
    fetchData = async () => {  
        const response = await axios.get('https://api.c19insights.io/v1/summary');
        this.setState({ summary: response.data });
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        
        // Wait for the data to be fetched...
        if(this.state.summary === "") return null;

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
                        <Dashboard style={{marginTop: '56px', height: '380px',}} state={this.state.currentState} />
                    </Route>
                </Router>
            </div>
        );
    }
}

export default AppRouter;