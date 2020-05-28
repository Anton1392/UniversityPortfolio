import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { DateTimePicker } from "material-ui-pickers";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography
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

class ActivityForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      sDate: new Date(),
      eDate: new Date(),
      startTime: null,
      endTime: null,
      activity: {
        available: null,
        description: null,
        url: null,
        price: null,
        site: {
          city: null,
          address: null,
          zipCode: null,
          name: null,
        },
        ptype: null,
        pdescription: null,
        startTime: null,
        duration: null,
        endTime: null,
        type: null,
        name: null,
      },
      fields: {
        location: [
          ["Anläggning", "siteName"],
          ["Adress", "address"],
          ["Stad", "city"],
          ["Postnummer", "zipCode" ],
        ],
        activity: [
          ["Namn", "name"],
          ["Typ", "type"],
          ["Produkttyp", "ptype"],
          ["Antal platser", "available"],
          ["Pris", "price"],
          ["Bokningslänk", "url"],
        ],
      }
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
    let { date, activity, sDate, eDate } = this.state;
    let { startTime, endTime } = this.state.activity;

    sDate.setSeconds(0);
    eDate.setSeconds(0);

    startTime = sDate.toISOString();
    endTime = eDate.toISOString();

    if (date !== null) {
      if (startTime !== null) {
        activity.startTime = startTime.substr(0,10) + " " + startTime.substr(11,8);
      }
      if (endTime !== null) {
        activity.endTime = endTime.substr(0,10) + " " + endTime.substr(11,8);
      }
    }

    //Clean seconds/milliseconds
    sDate.setMilliseconds(0);
    eDate.setMilliseconds(0);
    sDate.setSeconds(0);
    eDate.setSeconds(0);

    this.props.submit(activity);
  }

  // keeps the activity up to date
  // a few special cases so we can make the UI more user friendly
  handleChange(event){
    if(event.target.name === "siteName" ) {
      this.setState({
        activity: {
          ...this.state.activity,
          site: {
            ...this.state.activity.site,
            name: event.target.value,
          },
        },
      });
    } else if(event.target.name === "city" ||
              event.target.name === "zipCode" ||
              event.target.name === "address") {
      this.setState({
        activity: {
          ...this.state.activity,
          site: {
            ...this.state.activity.site,
            [event.target.name]: event.target.value,
          },
        },
      });
    } else {
      this.setState({
        activity: {
          ...this.state.activity,
          [event.target.name]: event.target.value,
        }
      });
    }
  }

  onStartChange = sDate => this.setState({ sDate });
  onEndChange = eDate => this.setState({ eDate });

  render(){
    const { classes } = this.props;
    return(
      <Paper className={classes.paper}>
        <Grid container spacing={16}>
          <Grid item xs={12} container spacing={16}>
            <Grid item xs={12}>
              <Typography variant="h6">Tid och plats</Typography>
            </Grid>
            { this.state.fields.location.map(item => (
              <Grid item xs={3} key={item}>
                <TextField className={classes.textField} variant="outlined" label={item[0]} name={item[1]} onChange={this.handleChange}/>
              </Grid>
            ))}
            <Grid item xs={3}>
              <DateTimePicker
                className={classes.textField}
                variant="outlined"
                label="Från"
                ampm={false}
                onChange={this.onStartChange}
                value={this.state.sDate}
              />
            </Grid>
            <Grid item xs={3}>
              <DateTimePicker
                className={classes.textField}
                variant="outlined"
                label="Till"
                ampm={false}
                onChange={this.onEndChange}
                value={this.state.eDate}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} container spacing={16}>
            <Grid item xs={12}>
              <Typography variant="h6">Aktivitet</Typography>
            </Grid>
            { this.state.fields.activity.map(item => (
              <Grid item xs={3} key={item}>
                <TextField className={classes.textField} variant="outlined" label={item[0]} name={item[1]} onChange={this.handleChange}/>
              </Grid>
            ))}
            <Grid item xs={12}>
              <TextField
                multiline
                className={classes.textField}
                variant="outlined"
                label="Beskrivning"
                name="description"
                onChange={this.handleChange}
                rows="2"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                className={classes.textField}
                variant="outlined"
                label="Produktbeskrivning"
                name="pdescription"
                onChange={this.handleChange}
                rows="4"
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button className={classes.button} fullWidth variant="contained" color="primary" onClick={this.handleSubmit}>Skapa aktivitet</Button>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}
export default withStyles(styles)(ActivityForm);
