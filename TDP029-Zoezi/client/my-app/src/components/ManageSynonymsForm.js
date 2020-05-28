import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  TextField,
  Button,
  Paper,
  Typography,
} from '@material-ui/core';

const styles = theme => ({
  paper: {
    padding: 20,
    width: '60%',
    margin: 'auto',
  },
  textField: {
    [`& fieldset`]: {
      borderRadius: 0,
    },
    width: '100%',
  },
  button: {
    borderRadius: 0,
  }
});

class ManageSynonymsForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      value: "",
      tmp: 'test',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    fetch(process.env.REACT_APP_API_PATH + '/synonyms/')
    .then( res => res.json())
    .then( json => {
      let jstring = JSON.stringify(json);
      jstring = jstring.replace(/],/g, "],\n");
      jstring = jstring.replace(/{"/g, "{\n\"");
      jstring = jstring.replace(/]}/g, "]\n}");
      this.setState({
        value: jstring,
      });
    });
  }

  componentDidMount() {
    this.setState({
      isLoading: false,
    });
  }

  handleChange(event){
    this.setState({
      value: event.target.value
    })
  }

  handleSubmit(event){
    event.preventDefault();
    var submit = this.props.submit;

    submit(this.state.value);
  }

  render(){
    const { classes } = this.props;

    return(
      <Paper className={classes.paper}>
        <Typography variant="h6">Synonymhantering</Typography>
        <br/>
        <TextField
          fullWidth
          className={classes.textField}
          variant="outlined"
          type="text"
          name="value"
          label="Synonymer"
          multiline
          rows="30"
          value={this.state.value}
          onChange={this.handleChange}/>
        <Button className={classes.button} variant="contained" color="primary" onClick={this.handleSubmit}>
          Uppdatera
        </Button>
      </Paper>
    );
  }
}
export default withStyles(styles)(ManageSynonymsForm);
