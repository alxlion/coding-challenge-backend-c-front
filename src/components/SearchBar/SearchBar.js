import BMap from '../BMap/BMap';
import FontAwesome from 'react-fontawesome';
import React, { Component } from 'react';
import './SearchBar.css';

const apiUrl = process.env.apiUrl || 'https://busbud-search.herokuapp.com';

class SearchBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            term: '',
            suggestions: {},
            error: '',
            showMap: false,
            enabledMap: true,
            lat: '43.70011',
            long: '-79.4163'
        };

        this.changeMarkerPosition = this.changeMarkerPosition.bind(this);
    }

    searchCity(term) {

        var url = apiUrl + `/suggestions?q=${term}`;

        if ((this.state.lat !== '' && this.state.long !== '') && this.state.enabledMap) {
            url += `&latitude=${this.state.lat}&longitude=${this.state.long}`;
        }

        fetch(url)
        .then(response => response.json())
        .then(data => this.setState({ suggestions: data.suggestions, error: ''}))
        .catch(e => this.setState({error: 'Cannot request API, please retry.'}));
    }

    onChange(event) {
        this.setState({ term: event.target.value });
        this.searchCity(event.target.value);
    }

    toggleMap(event) {
        this.setState(prevState => ({ showMap: !prevState.showMap}));
    }

    toggleMapFunction(event) {
        this.setState(prevState => ({ enabledMap: !prevState.enabledMap}), () => {
            this.searchCity(this.state.term);
        });
    }

    changeMarkerPosition(lat, long) {
        this.setState(prevState => ({ lat: lat, long: long, showMap: !prevState.showMap}), () => this.searchCity(this.state.term));
    }

    render() {


        const results = Object.keys(this.state.suggestions).map(key => {

                if (key in this.state.suggestions && this.state.suggestions[key] !== null) {
                    return <li>{this.state.suggestions[key].name}</li>
                }

                return [];
                
                }
            );

        return (
            <div className="SearchBar">

                {
                    !this.state.showMap ? null : (
                        <div id="mapPopup">
                            <label>
                                <span>Enable location </span>
                                <input type="checkbox" checked={this.state.enabledMap} onChange={(e) => this.toggleMapFunction(e)} />
                            </label>
                            {
                                this.state.enabledMap ? null : (
                                <div id="overlay">
                                Map disabled
                                </div>
                                )
                            }
                            
                            <BMap markerHandler={this.changeMarkerPosition} lat={this.state.lat} long={this.state.long} />
                        </div>
                    )
                }
                
                <input type="text" onChange={(e) => this.onChange(e)} placeholder="Search for a city (eg. Montreal, Washington...)"/>
                <a href="#/" className="toggleMap" onClick={(e) => this.toggleMap(e)}><FontAwesome name="map-marker" size="2x"/></a>
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
