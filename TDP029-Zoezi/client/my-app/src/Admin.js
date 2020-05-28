import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import LoginForm from './components/LoginForm';
import ActivityForm from './components/ActivityForm';
import SourceURLForm from './components/SourceURLForm';
import ImportForm from './components/ImportForm';
import AddUserForm from './components/AddUserForm';
import SearchLogForm from './components/SearchLogForm';
import ManageSynonymsForm from './components/ManageSynonymsForm';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Tabs,
  Tab,
  AppBar,
  Link,
  Toolbar,
  Dialog,
  DialogContent,
  DialogContentText
} from '@material-ui/core';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.tertiary.light,
    flexGrow: 1,
    position: 'relative',
    minHeight: 'calc(100vh - 60px)',
    paddingTop: 60,
  },
  header: {
    backgroundColor: theme.palette.primary.main,
    position: 'absolute',
    textAlign: 'left',
    left: 0,
    right: 0,
    top: 0,
    height: 60,
    paddingLeft: theme.spacing.unit*2,
  },
  loginForm: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  tabContent: {
    position: 'relative',
    margin: 'auto',
    width: '50%',
  },
  colorTextPrimary: {
    color: 'white'
  },
});

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

class Admin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      signedIn: false,
      token: '',
      user: '',
      accessLevel: 0,
      error: '',
      submitMessage: '',
      value: 0,
      open: false,
    }
  }

  componentWillMount() {
    //Check if session token exists
    let jwt = localStorage.getItem("jwt");
    let token = null;
    if (jwt) {
      this.setState({
        accessLevel: JSON.parse(jwt)['permission'],
      });
      //Check if session token valid
      token = JSON.parse(jwt)['token']
      fetch(process.env.REACT_APP_API_PATH + '/validateUser/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token
        })
      })
      .then(res => res.json())
      .then(json => {
        if(json.success) {
          //Allow access
          this.setState({
            accessLevel: JSON.parse(jwt)['permission'],
            user: localStorage.getItem("user"),
          });
        }
        else {
          //Remove session token, deny access
          localStorage.removeItem("jwt");
          this.setState({
            accessLevel: 0,
          });
        }
      });
    }
  }

  componentDidMount() {
    this.setState({
      isLoading: false,
    });
  }

  onLogin = (username, password) => {
    fetch(process.env.REACT_APP_API_PATH + '/auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
    .then(res => res.json())
    .then(json => {
      console.log(json);
      if(json.success){
        this.setState({
          accessLevel: json.permission,
          user: username
        });
        localStorage.setItem("jwt", JSON.stringify(json));
        localStorage.setItem("user", username);
      } else {
        this.setState({
          error: json.error,
        });
      }
    });
  }

  onLogout = () => {
    let jwt = localStorage.getItem("jwt");
    var token = null;
    if (jwt) {
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      token = JSON.parse(jwt)['token'];
      fetch(process.env.REACT_APP_API_PATH + '/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token
        }),
      })
      .then(res => res.json())
      .then(json => {
        console.log(json);
      });
    }
    this.setState({
      accessLevel: 0,
    });
  }

  validateActivityData(activity){
    //Important question, how much validation should be done
    let validForm = true;
    //Check for null/empty strings
    for (let key in activity ) {
      if ( (activity[key] == null || activity[key].length === 0 ) &&
            key !== "id" && key !== "duration") {
        validForm = false;
        this.setState({
          submitMessage: "Fel! Saknas data för aktivitet.",
          open: true,
        });
        return validForm;
      }
    }
    //Check for null/empty strings in the site subfield
    for (let key in activity["site"] ) {
      if (activity["site"][key] == null ||
          activity["site"][key].length === 0 ) {
        validForm = false;
        this.setState({
          submitMessage: "Fel! Saknas data för aktivitet.",
          open: true,
        });
        return validForm;
      }
    }
    //Checks for timetravel errors
    if (activity["startTime"] >= activity["endTime"]) {
      validForm = false;
      this.setState({
        submitMessage: "Fel! Startiden senare än sluttiden.",
        open: true,
      });
    }
    return validForm;
  }

  onSubmitActivity = (activity) => {
    let jsonActivity = JSON.stringify(activity);
    if(!this.validateActivityData(activity)){
      return;
    }
    let jwt = localStorage.getItem("jwt");
    let token = null
    if (jwt) {
      token = JSON.parse(jwt)['token']
    }
    console.log(activity);
    fetch(process.env.REACT_APP_API_PATH + '/addActivity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token,
        user: this.state.user,
        activity: jsonActivity,
      }),
    })
    .then(res => res.json())
    .then(json => {
      if(json.success){
        console.log("activity added")
        this.setState({
          submitMessage: "Aktivitet registrerad",
          open: true,
        });
      } else {
        console.log("something went wrong")
        this.setState({
          submitMessage: "Fel! Aktivitet kunde inte registreras",
          open: true,
        });
      }
    });
  }

  onSubmitUser = (username, password) => {
    let jwt = localStorage.getItem("jwt");
    let token = null;
    if (jwt) {
      token = JSON.parse(jwt)['token']
      fetch(process.env.REACT_APP_API_PATH + '/addAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token,
          username: username,
          password: password,
        }),
      })
      .then(res => res.json())
      .then(json => {
        console.log(json);
        if (json[1] === 200) {
          this.setState({
            submitMessage: "Ny användare registrerad",
            open: true,
          });
        } else if (json[1] === 409) {
          this.setState({
            submitMessage: "Användarnamn redan taget",
            open: true,
          });
        } else if (json[1] === 500) {
          this.setState({
            submitMessage: "Användare kunde ej registreras",
            open: true,
          });
        } else {
          this.setState({
            submitMessage: "Fel: " + json[0] + ", " + json[1],
            open: true,
          });
        }
      });
    }
  };
  validateURL(url){
    let validURL = true;
    //Check that the URL is valid

    return validURL;
  }

  onSubmitURL = (url) => {
    if(!this.validateURL(url)){
      return;
    }
    console.log(this.state.user)
    let jwt = localStorage.getItem("jwt");
    var token = null
    if (jwt) {
      token = JSON.parse(jwt)['token']
    }
    fetch(process.env.REACT_APP_API_PATH + '/addEndpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token,
        user: this.state.user,
        url: url,
      }),
    })
    .then(res => res.json())
    .then(json => {
      console.log(json);
      if(json.success){
        console.log("url endpoint added")
        this.setState({
          submitMessage: "Ny URL registrerad",
          open: true,
        });
      } else {
        console.log("something went wrong")
        this.setState({
          submitMessage: "Fel! URL kunde inte registreras",
          open: true,
        });
      }
    });
  }

  validateSynonyms(synonyms) {
    //Test if the synonym data is in proper JSON format.
    let validSynonyms = true;
    try {
      JSON.parse(synonyms);
    }
    catch(err) {
      this.setState({
        submitMessage: "Fel i JSON syntaxen!",
        open: true,
      });
      validSynonyms = false;
    }

    return validSynonyms;
  }

  onSubmitSynonyms = (synonyms) => {
    if(!this.validateSynonyms(synonyms)){
      return;
    }
    let jwt = localStorage.getItem("jwt");
    let token = null;
    if (jwt) {
      token = JSON.parse(jwt)['token']
      fetch(process.env.REACT_APP_API_PATH + '/nukeReplaceSynonyms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token,
          synonyms: synonyms,
        }),
      })
      .then(res => res.json())
      .then(json => {
        console.log(json);
        if (json) {
          this.setState({
            submitMessage: "Synonymer uppdaterade",
            open: true,
          });
        } else if (json[1] === 409) {
          this.setState({
            submitMessage: "Fel",
            open: true,
          });
        } else if (json[1] === 500) {
          this.setState({
            submitMessage: "Fel",
            open: true,
          });
        } else {
          this.setState({
            submitMessage: "Fel",
            open: true,
          });
        }
      });
    }
  };

  onAddSynonym = (term, categories) => {
    if (categories.length === 0) {
      this.setState({
        submitMessage: "Inga kategorier valda.",
        open: true,
      });
      return;
    }

    let jwt = localStorage.getItem("jwt");
    let token = null;
    if (jwt) {
      for (var cat in categories) {
        token = JSON.parse(jwt)['token']
        fetch(process.env.REACT_APP_API_PATH + '/addToCategory', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: token,
            cat: categories[cat],
            term: term,
          }),
        })
        .then(res => res.json())
        .then(json => {
          console.log(json);
          if (json["success"]) {
            this.setState({
              submitMessage: "Synonym tillagd.",
              open: true,
            });
          } else {
            this.setState({
              submitMessage: "Fel!",
              open: true,
            });
          }
        });
      }
    }
  };

  onAddCategory = (term) => {
    console.log(term)
    let jwt = localStorage.getItem("jwt");
    let token = null;
    if (jwt) {
      token = JSON.parse(jwt)['token']
      fetch(process.env.REACT_APP_API_PATH + '/addCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token,
          cat: term,
        }),
      })
      .then(res => res.json())
      .then(json => {
        console.log(json);
        if (json) {
          this.setState({
            submitMessage: "Kategori tillagd.",
            open: true,
          });
        } else {
          this.setState({
            submitMessage: "Fel!",
            open: true,
          });
        }
      });
    }
  };

  onRemoveSearch = (term) => {
    let jwt = localStorage.getItem("jwt");
    let token = null;
    if (jwt) {
      token = JSON.parse(jwt)['token']
      fetch(process.env.REACT_APP_API_PATH + '/removeSearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token,
          term: term,
        }),
      })
      .then(res => res.json())
      .then(json => {
        if (json) {
          this.setState({
            submitMessage: term + " togs bort.",
            open: true,
          });
        } else {
          this.setState({
            submitMessage: "Fel!",
            open: true,
          });
        }
      });
    }
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render(){
    const { classes } = this.props;
    let { accessLevel, error, value, submitMessage } = this.state;
    if(accessLevel <= 0 || accessLevel >= 3) {
      return(
        <div className={classes.root}>
          <header className={classes.header}>
            <Link href="/" variant="h3" className={classes.colorTextPrimary}>
              hittaträning.se
            </Link>
          </header>
          <div className={classes.loginForm}>
            <LoginForm submit={this.onLogin} error={error}/>
          </div>
        </div>
      );
    } else if(accessLevel === 1) {
      return(
        <div className={classes.root}>
          <header className={classes.header}>
            <Link href="/" variant="h3" className={classes.colorTextPrimary}>
              hittaträning.se
            </Link>
          </header>

          <AppBar position="static">
            <Toolbar>
              <Tabs value={value} onChange={this.handleChange}>
                <Tab label="Skapa aktivitet" />
                <Tab label="Lägg till källa" />
                <Tab label="Importera aktivitet" />
              </Tabs>
              <Button color="inherit" onClick={this.onLogout}>
              Logga ut
              </Button>
            </Toolbar>
          </AppBar>
          <div className={classes.tabContent}>
          {value === 0 && <TabContainer><ActivityForm submit={this.onSubmitActivity}/></TabContainer>}
          {value === 1 && <TabContainer><SourceURLForm
          submit={this.onSubmitURL}/></TabContainer>}
          {value === 2 && <TabContainer><ImportForm submit={this.onSubmit}/></TabContainer>}
          <Dialog open={this.state.open} onClose={this.handleClose}>
            <DialogContent>
              <DialogContentText>
                {submitMessage}
              </DialogContentText>
            </DialogContent>
          </Dialog>
         </div>
        </div>
      );
    } else if(accessLevel === 2) {
      return(
        <div className={classes.root}>
          <header className={classes.header}>
            <Link href="/" variant="h3" className={classes.colorTextPrimary}>
              hittaträning.se
            </Link>
          </header>
          <AppBar position="static">
            <Toolbar>
              <Tabs value={value} onChange={this.handleChange}>
                <Tab label="Registrera ny användare" />
                <Tab label="Titta på loggar" />
                <Tab label="Lägg till synonym" />
              </Tabs>
              <Button color="inherit" onClick={this.onLogout}>
              Logga ut
              </Button>
            </Toolbar>
          </AppBar>
          {value === 0 && <TabContainer><AddUserForm submit={this.onSubmitUser}/></TabContainer>}
          {value === 1 && <TabContainer><SearchLogForm
          addSyn={this.onAddSynonym}
          addCat={this.onAddCategory}
          remove={this.onRemoveSearch}/></TabContainer>}
          {value === 2 && <TabContainer><ManageSynonymsForm
          submit={this.onSubmitSynonyms}/></TabContainer>}

          <Dialog open={this.state.open} onClose={this.handleClose}>
            <DialogContent>
              <DialogContentText>
                {submitMessage}
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </div>
      );
    }
  }
}
export default withStyles(styles)(Admin);
