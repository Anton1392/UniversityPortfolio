// Formatting of individual mapmarkers
import React, { Component } from 'react';
import Link from '@material-ui/core/Link';
import L from 'leaflet';
import '../../node_modules/leaflet/dist/leaflet.css';
import '../../node_modules/leaflet/dist/leaflet.js';
import { Marker, Popup } from 'react-leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

var SmallIcon = L.Icon.extend({
    options: {
       iconUrl: require('../icons/marker-icon.png'),
       iconSize: [28, 45],
       iconAnchor: [22, 44],
       popupAnchor: [-3, -76],
       shadowUrl: require('../icons/marker-shadow.png'),
       shadowSize: [48, 45],
       shadowAnchor: [22, 44]
    }
});

class MapMarker extends Component {
  constructor(props){
    super(props)
    this.state = {
      isLoading: true,
      position: []
    };
  }

  async componentDidMount() {
    const provider = new OpenStreetMapProvider();
    var address = "";
    var results = [];
    try {
      address = this.props.data.site["address"] + ", " + this.props.data.site["city"];
      results = await provider.search({ query: address });
      this.setState({
        position: [results[0]["y"], results[0]["x"]],
        isLoading: false
      });
    }
    catch(err) {
      console.log("MapMarker data error");
    }
  }

  render(){
    if ( this.state.position.length !== 2 ) {
      return (<div/>);
    }

    var position = this.state.position;
    var sIcon = new SmallIcon();

    return(
      <Marker position={position} icon={sIcon}>
        <Popup position={position}>
          <Link href={"/product/"+ this.props.data["id"]}>
            {this.props.data["name"]}, {this.props.data.site["address"]}
          </Link>
        </Popup>
      </Marker>
    );
  }
}

export default MapMarker;
