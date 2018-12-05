import React, { Component } from 'react';
import './BMap.css'
import { Map, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

class BMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
        lat: this.props.lat,
        long: this.props.long
    };

  }

  onClickMap(event) {
    this.props.markerHandler(event.latlng.lat, event.latlng.lng);
  }

  render() {
    
    const position = [this.state.lat, this.state.long];

    return (
        <Map center={position} zoom={5} onClick={(e) => this.onClickMap(e)}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        <Marker position={position}>
        </Marker>
        </Map>
    );
  }
}

export default BMap;