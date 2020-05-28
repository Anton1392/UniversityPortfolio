// A map view
// Make sure to send the data prop as a list Object when using this component
// or the mapmarkers wont work.

import React, { Component } from 'react';
import '../../node_modules/leaflet/dist/leaflet.css';
import '../../node_modules/leaflet/dist/leaflet.js';
import { Map, TileLayer } from 'react-leaflet';
import MapMarker from './MapMarker';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
});
class MapView extends Component {
  constructor(props){
    super(props)
    this.state = {
      isLoading: true,
      zoom: 13,
      position: [59.7, 14.5]
    };
  }

  async componentDidMount() {
    const provider = new OpenStreetMapProvider();
    var mapLocation = "";
    var results = [];

    if(this.props.location !== "Var"){
      mapLocation = this.props.location;
    }
    else {
      mapLocation = "Sweden";
      this.setState({
        zoom: 5
      });
    }
    console.log(mapLocation);
    try {
      results = await provider.search({ query: mapLocation });
      console.log(results);
      this.setState({
        position: [results[0]["y"], results[0]["x"]]
      });
    }
    catch(err) {
      console.log("MapView: Error with map provider");
    }

    this.setState({
      isLoading: false,
    });
  }

  //DEBUG function
  handleClick(e) {
    console.log("You clicked the map: " + e.latlng.toString())
  }

  render() {
    const position = this.state.position;
    var data = [];
    if(this.state.isLoading){
      return null;
    }
    else {
      data = this.props.data;
    }

    return (
      <Map
        center={position}
        zoom={this.state.zoom}
        onClick={this.handleClick}
        >
        <TileLayer
          attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        { data.map((item) =>
          <MapMarker data={item} key={item["id"]}/>
        )}
      </Map>
    );
  }
}

export default withStyles(styles)(MapView);
