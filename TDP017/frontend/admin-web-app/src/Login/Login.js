import React, { Component } from 'react';
import BackendData from '../BackendData.js';
import Strings from '../strings.js';

class Login extends Component {
  constructor(props){
    super(props)

    this.be = new BackendData();
    this.mounted = false;

    this.state = {
      userName: '',
      password: '',
      errorMsg: '',
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitLogin = this.handleSubmitLogin.bind(this);

  }

  componentDidMount() {
      this.mounted = true;

      let jwt = localStorage.getItem("jwt");
      if (jwt) {
        this.be.token = jwt;
      }
  }

  componentWillUnmount() {
      this.mounted = false;
      this.be.abort();
  }

  handleSubmitLogin(event) {
    console.log("Pressed login button");
    event.preventDefault();

    if (this.state.userName === '') {
      this.setState({
          errorMsg: "No username specified"
      });
    }
    else if (this.state.password === '') {
      this.setState({
          errorMsg: "No password specified"
      });
    }
    else {
      // Try to log in
      this.be.login(this.state.userName, this.state.password)
        .then(res => {
          if ( res !== undefined ) {
            localStorage.setItem("jwt", res);
            this.props.submit(true, this.state.userName);
          }
          else {
            this.setState({
                errorMsg: "Could not login. Check username and password!"
            });
          }

        })
    }
  }

  handleChange(event) {
      const target = event.target;
      const name = target.name;
      let value = '';
      switch(name) {
          case 'userName':
              value = target.value;
              break;
          case 'password':
              value = target.value;
              break;
          default:
              console.warn("Error handleChange got a default value")
              console.warn(target.value)
      }

      this.setState({
          [name]: value
      });
  }

  render() {
    return (
    <form className="App-LoginForm App-Form-Style" onSubmit={this.handleSubmitLogin}>
        <ul>
        <li>
          <label htmlFor="firstName">{Strings.LOGIN_USERNAME}</label>
          <input type="text"
                 name="userName"
                 value={this.state.userName}
                 onChange={this.handleChange} />
        </li>
        <li>
          <label htmlFor="password">{Strings.LOGIN_PASSWORD}</label>
          <input type="password"
                 name="password"
                 value={this.state.password}
                 onChange={this.handleChange}/>
        </li>
        <input type="submit" value="Logga in"/>
        </ul>
        <p>{this.state.errorMsg}</p>
    </form>
    );
  }
}

export default Login;
