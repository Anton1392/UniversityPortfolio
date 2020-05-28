import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  TextField,
  Button,
  Paper
} from '@material-ui/core';

const styles = theme => ({
  paper: {
    padding: 20,
    width: '25%',
    margin: 'auto',
  },
  textField: {
    [`& fieldset`]: {
      borderRadius: 0,
    },
  },
  button: {
    borderRadius: 0,
    margin: 0,
  }
});

class AddUserForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      username: '',
      password: '',
      errors: {},
      submitMessage: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
  }

  componentDidMount() {
    this.setState({
      isLoading: false,
    });
  }

  handleValidation() {
    let validForm = true;
    let errors = {};
    if(!this.state.username){
      validForm = false;
      errors['username'] = "Skriv in ett användarnamn.";
    }
    if(!this.state.password){
      validForm = false;
      errors['password'] = "Skriv in ett lösenord.";
    }
    this.setState({
      errors: errors,
    });
    return validForm;
  }

  handleSubmit(event){
    event.preventDefault();
    let { username, password } = this.state;
    if(this.handleValidation()) {
      this.props.submit(username, password);
    }
  }

  handleChange(event){
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render(){
    const { classes } = this.props;
    return(
      <Paper className={classes.paper}>
        <form onSubmit={this.handleSubmit}>
          <TextField className={classes.textField} fullWidth type="text" name="username" label="Användarnamn" onChange={this.handleChange} variant='outlined'/>
          <br />
          <span style={{color: "red"}}>{this.state.errors["username"]}</span>
          <br />
          <TextField className={classes.textField} fullWidth type="password" name="password" label="Lösenord" onChange={this.handleChange} variant='outlined'/>
          <br />
          <span style={{color: "red"}}>{this.state.errors["password"]}</span>
          <br />
          <Button className={classes.button} fullWidth type="submit" variant='contained' color='primary' onClick={this.handleSubmit}>Registrera användare</Button>
        </form>
        {this.submitMessage}
      </Paper>
    );
  }
}

export default withStyles(styles)(AddUserForm);
