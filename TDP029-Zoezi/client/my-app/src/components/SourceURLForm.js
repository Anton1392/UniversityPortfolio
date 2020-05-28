import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  TextField,
  Button,
  Paper,
  Grid,
  Typography,
} from '@material-ui/core';

const styles = theme => ({
  paper: {
    padding: 20,
    width: '100%',
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

class SourceURLForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      url: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({
      isLoading: false,
    });
  }

  handleSubmit(event){
    event.preventDefault();
    let { url } = this.state;
    console.log(url);
    this.props.submit(url);
  }

  handleChange(event){
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render(){
    const { classes } = this.props;
    return(
      <Paper className={classes.paper}>
        <form onSubmit={this.handleSubmit}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Typography variant="h6">Lägg till URL</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth className={classes.textField} variant="outlined" type="text" name="url" label="Länk" onChange={this.handleChange}/>
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth className={classes.button} variant="contained" color="primary" onClick={this.handleSubmit}>Lägg till</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    );
  }
}
export default withStyles(styles)(SourceURLForm);
