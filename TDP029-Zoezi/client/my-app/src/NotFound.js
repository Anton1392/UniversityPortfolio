import React, { Component } from 'react';

class NotFound extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
    }
  }

  componentDidMount() {
    this.setState({
      isLoading: false,
    });
  }

  render(){
    return(
      <div>
        404: Page does not exist
      </div>
    )
  }
}

export default NotFound;
