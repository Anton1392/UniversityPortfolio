import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { TextField, Button, Paper } from '@material-ui/core';

const styles = theme => ({
  paper: {
    padding: 20,
  },
  textField: {
    [`& fieldset`]: {
      borderRadius: 0,
    },
  },
  button: {
    borderRadius: 0,
  }
});
class LoginForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      username: '',
      password: '',
      errors: {},
      error: '',
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
      errors['username'] = "Skriv in ditt användarnamn.";
    }
    if(!this.state.password){
      validForm = false;
      errors['password'] = "Skriv in ditt lösenord.";
    }
    this.setState({
      errors: errors,
    });
    return validForm;
  }

  handleSubmit(event){
    event.preventDefault();
    let { username, password } = this.state;
    let validForm = this.handleValidation();

    if(validForm) {
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
      <form onSubmit={this.handleSubmit}>
      <Paper className={classes.paper}>
        <TextField className={classes.textField} type="text" name="username" label="Användarnamn" onChange={this.handleChange} variant='outlined'/>
        <br />
        <span style={{color: "red"}}>{this.state.errors["username"]}</span>
        <br />
        <TextField className={classes.textField} type="password" name="password" label="Lösenord" onChange={this.handleChange} variant='outlined'/>
        <br />
        <span style={{color: "red"}}>{this.state.errors["password"]}</span>
        <span style={{color: "red"}}>{this.props.error}</span>
        <br />
        <Button className={classes.button} type="submit" variant='contained' color='primary' fullWidth onClick={this.handleSubmit}>Logga in</Button>
      </Paper>
      </form>
    );
  }
}
export default withStyles(styles)(LoginForm);
