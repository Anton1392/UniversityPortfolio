import { Component } from 'react';
import socketIOClient from "socket.io-client";

class IOsocket extends Component {
  constructor(props) {
    super(props)
    this.state = {
      endpoint: "http://127.0.0.1:5000"

    }
 
  }

  componentDidMount() {
    const {endpoint} = this.state;
    //Very simply connect to the socket
    const socket = socketIOClient(endpoint);
    //Listen for data on the "outgoing data" namespace and supply a callback for what to do when we get one. In this case, we set a state variable
    socket.on("broad", data => this.props.update(data['data']['id'], data['data']['available']));
  }
  render(){
    return null;
  }
}
export default IOsocket;
