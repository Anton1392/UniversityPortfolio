import React, { Component } from 'react';
import logo from './logo.svg';
import Login from './Login/Login.js'
import ChartMain from './Chart/ChartMain.js'
import TableMain from './Table/TableMain.js'
import AdminMain from './Admin/AdminMain.js'
import ErrorBoundry from './ErrorBoundry.js'
import TopMenu from './TopMenu.js';
import TopMenuItem from './TopMenuItem.js';
import SideMenu from './SideMenu.js';
import './App.css';
import './Style.css';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      sideMenuSelect: "Tables",
      loggedIn: false,
      loggedInAs: ''
    }

    this.onSideMenuSelect = this.onSideMenuSelect.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  componentDidMount() {
    let lsLoggedIn = localStorage.getItem('loggedIn');
    let lsLoggedInAs = localStorage.getItem('loggedInAs');
    if (lsLoggedIn === "true") {
      this.setState({
        loggedIn: lsLoggedIn
      });
    }
    this.setState({
      loggedInAs: lsLoggedInAs
    });

  }

  onSideMenuSelect = (idx) => {
    this.setState({
      sideMenuSelect: idx,
    });
  }

  // Use this to handle logging in/out
  onLogin = (bRes, admin = 'Default User') => {
    this.setState({
      loggedIn: bRes,
      loggedInAs: admin
    });
    localStorage.setItem('loggedIn', bRes);
    localStorage.setItem('loggedInAs', admin);
  }

  onLogout = () => {
    this.setState({
      loggedIn: false,
      loggedInAs: ''
    });
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('loggedInAs');
    localStorage.removeItem('jwt');
  }

  render() {
    return (
      (() => {
        if (!this.state.loggedIn) {
          return (
            <div className="App App-Style">
              <Login submit={this.onLogin} className="App-Login"> </Login>
            </div>
          )
        } else {
          return (
            <div className="App App-Style">
              <div className="App-SideMenu">
                <SideMenu submit={this.onSideMenuSelect} loggedIn={this.onLogin} className="App-Menu">
                </SideMenu>
              </div>
              <div className="App-Content">
                <div className="App-TopMenu App-Menu">
                  <TopMenu className="App-Menu">
                    <TopMenuItem>
                      <button name="logout" onClick={this.onLogout}>Log out</button>
                    </TopMenuItem>
                    <TopMenuItem>
                      <p>{this.state.loggedInAs}</p>
                    </TopMenuItem>
                  </TopMenu>
                </div>

                <div className="App-Fragment App-Fragment-Style">

              {(() => {
                if (this.state.sideMenuSelect === "Tables") {
                  return (
                      <ErrorBoundry>
                          <TableMain className="App-Table"></TableMain>
                      </ErrorBoundry>
                  )
                } else if (this.state.sideMenuSelect === "Graphs") {
                  return (
                      <ErrorBoundry>
                         <ChartMain className="App-Chart"></ChartMain>
                      </ErrorBoundry>
                  )
                } else if (this.state.sideMenuSelect === "Users") {
                  return (
                      <ErrorBoundry>
                           <AdminMain className="App-Admin"></AdminMain>
                      </ErrorBoundry>
                  )
                }
              })()}

                </div>
              </div>
            </div>
          )
        }
      })()
    );
  }
}

export default App;
