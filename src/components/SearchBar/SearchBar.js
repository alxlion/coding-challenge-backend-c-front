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
            lat: '43.70011',
            long: '-79.4163'
        };

        this.changeMarkerPosition = this.changeMarkerPosition.bind(this);
    }

    onChange(event) {
        this.setState({ term: event.target.value });

        var url = apiUrl + `/suggestions?q=${event.target.value}`;

        if (this.state.lat !== '' && this.state.long !== '') {
            url += `&latitude=${this.state.lat}&longitude=${this.state.long}`;
        }

        fetch(url)
        .then(response => response.json())
        .then(data => this.setState({ term: '', suggestions: data.suggestions, error: ''}))
        .catch(e => this.setState({error: 'Cannot request API, please retry.'}));
    }

    toggleMap(event) {
        this.setState(prevState => ({ showMap: !prevState.showMap}));
    }

    changeMarkerPosition(lat, long) {
        this.setState(prevState => ({ lat: lat, long: long, showMap: !prevState.showMap}) );
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

                {
                    !this.state.showMap ? null : (
                        <div id="mapPopup">
                            <BMap markerHandler={this.changeMarkerPosition} lat={this.state.lat} long={this.state.long} />
                        </div>
                    )
                }
                
                <input type="text" onChange={(e) => this.onChange(e)} placeholder="Search for a city (eg. London, Washington...)"/>
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