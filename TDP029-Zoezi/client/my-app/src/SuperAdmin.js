




//----- NOT USED AT THE MOMENT -----//





import React, { Component } from 'react';
import LoginForm from './components/LoginForm'

class SuperAdmin extends Component {
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
        <LoginForm />
      </div>
    );
  }
}
export default SuperAdmin;
