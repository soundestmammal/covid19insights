import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './App';
import Navbar from './Navbar';
import Hero from './components/Hero';
import Indicators from './components/Indicators';
import USMap from './components/USMap';


class AppRouter extends Component {

    constructor(props) {
      super(props);
      this.state = {
        currentState: "",
      }
    }

    navToState = (state) => {
      this.setState({ currentState: state });
    }

    render() {
        return(
            <div>
                <Router>
                    <Navbar />
                    <Route exact path="/">
                        <Hero  height={'300px'} nav={this.navToState}  title={"Visualize United States COVID-19 Data"} subtitle={"See COVID data and risk level for your community"} style={{marginTop: '56px'}}/>
                        <Indicators style={{marginTop: '56px'}}/>
                        <USMap nav={this.navToState} /> 
                    </Route>
                    <Route path="/detail">
                        <App state={this.state.currentState} />
                    </Route>
                </Router>
            </div>
        );
    }
}

export default AppRouter;