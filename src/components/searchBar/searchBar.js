import React, { Component } from 'react';
import './searchBar.css'

class SearchBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            term: '',
            suggestions: {},
            error: ''
        };
    }

    onChange(event) {
        this.setState({ term: event.target.value });

        const apiUrl = process.env.apiUrl || 'https://busbud-search.herokuapp.com';

        const url = apiUrl + `/suggestions?q=${event.target.value}`;

        fetch(url)
        .then(response => response.json())
        .then(data => this.setState({ term: '', suggestions: data.suggestions, error: ''}))
        .catch(e => this.setState({error: 'Cannot request API, please retry.'}));
    }

    render() {
        const results = Object.keys(this.state.suggestions).map(key => {

            if (key in this.state.suggestions) {
                return <li>{this.state.suggestions[key].name} (lat: {this.state.suggestions[key].latitude}, long: {this.state.suggestions[key].longitude})</li>
            }

            return {};

            }
        );
        
        return (
            <div className="SearchBar">
                <input type="text" onChange={(e) => this.onChange(e)} placeholder="Search for a city (eg. London, Washington...)"/>
                {
                    results.length === 0 ? null : (
                    <div id="autocomplete">
                        <ul>
                            {results}
                        </ul>
                    </div>
                    )
                }
                
                {
                    this.state.error === '' ? null : (
                    <div id="error">
                        <p>{this.state.error}</p>
                    </div>
                    )
                }
                
                <div id="results">
                </div>
            </div>
        );
    }
}

export default SearchBar;