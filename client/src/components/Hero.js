import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import "../App.css";

class Hero extends Component {
    constructor(props){
        super(props);
        this.state = {
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            textInput: "",
            toDetail: false,
        }
    }

    onChangeText = (e) => {
        const userInput = e.target.value;
        let places = ["New York", "Florida", "Massachusetts", "Texas", "California", "New Jersey", "Arizona", "Montana", "Rhode Island", "Kansas", "Louisiana"];
        const filteredSuggestions = places.filter(place => place.toLowerCase().indexOf(userInput.toLowerCase()) > -1);
        this.setState({ 
            filteredSuggestions,
            activeSuggestion: 0,
            textInput: e.target.value,
            showSuggestions: true,    
        });
    }

    onClick = (e) => {
        this.props.nav(e.target.innerText);
        this.setState({
            filteredSuggestions: [],
            activeSuggestion: 0,
            showSuggestions: false,
            textInput: e.target.innerText
        })
    }

    onKeyDown = (e) => {
        const { activeSuggestion, filteredSuggestions } = this.state;
        // Enter key
        if(e.keyCode === 13) {
            e.preventDefault();
            console.log(filteredSuggestions[activeSuggestion]);
            this.props.nav(filteredSuggestions[activeSuggestion]);
            this.setState({
                activeSuggestion: 0,
                showSuggestions: false,
                textInput: filteredSuggestions[activeSuggestion],
                toDetail: true,
            });
        }
        // If user presses up arraow
        else if(e.keyCode === 38) {
            if(activeSuggestion === 0) {
                return;
            }
            this.setState({ activeSuggestion: activeSuggestion - 1});
        }
        // If user presses down arrow, increment index 
        else if(e.keyCode === 40) {
            if(activeSuggestion -1 === filteredSuggestions.length) {
                return;
            }
            this.setState({ activeSuggestion: activeSuggestion+1 });
        } 
        // Tab key
        else if(e.keyCode === 9) {
            e.preventDefault();
            this.setState({
                activeSuggestion: 0,
                showSuggestions: false,
                textInput: filteredSuggestions[activeSuggestion]
            })
        }
    }

    renderText() {
        return(
            <div className={`container align-items-center d-flex flex-column mt-5`}>
                <h1>{this.props.title}</h1>
                <p>{this.props.subtitle}</p>
            </div>
        );
    }

    submitState = e => {
        e.preventDefault();
        this.setState({ toDetail: true });
    }

    render() {
        const { onChangeText,
                onClick,
                onKeyDown,
                state: {
                    activeSuggestion,
                    filteredSuggestions,
                    showSuggestions,
                    textInput,
                    toDetail
                }
        } = this;

        if(toDetail) {
            return <Redirect to="/detail" />
        }

        let suggestionsListComponent;
        if(showSuggestions && textInput) {
            if(filteredSuggestions.length) {
                suggestionsListComponent = (
                    <ul className="suggestions">
                        {filteredSuggestions.map((suggestion, index) => {
                            let className;

                            if (index === activeSuggestion) {
                                className = "suggestion-active"
                                console.log("CLASS NAME!", className);
                            }

                            return (
                                <Link to="/detail">
                                    <li
                                        className={className}
                                        key={suggestion}
                                        onClick={onClick}
                                    >
                                        {suggestion}
                                    </li>
                                </Link>
                            );
                        })}
                    </ul>
                );
            } else {
                suggestionsListComponent = (
                    <div class="no-suggestions">
                        <em>There are no suggestions, woops.</em>
                    </div>
                )
            }
        }
        return(
            <div>
                <div className="jumbotron" style={{ display: 'block', height: this.props.height}}>
                    {this.renderText()}
                    <div style={{width: '50%', margin: '0 auto'}}>
                    <form>
                        <InputGroup size="lg" className="mx-auto">
                            <FormControl value={textInput} onChange={onChangeText} onKeyDown={onKeyDown} placeholder="Search for your state or county" aria-label="Large" aria-describedby="inputGroup-sizing-sm" />
                        </InputGroup>
                    </form>
                    {suggestionsListComponent}
                    </div>
                </div>
            </div>
        );
    }
}

export default Hero;