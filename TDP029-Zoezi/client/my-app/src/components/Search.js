// Component that displays two search fields and handles suggestion logic

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Button, Grid, Typography } from '@material-ui/core';
import SearchBar from './SearchBar.js';

var suggestions = {
  activities: [],
  cities: [],
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    position: 'relative',
  },
  container: {
    position: 'relative',
  },
  searchButtonContainer: {
    maxWidth: '100%',
  },
  searchButton: {
    borderRadius: 0,
    backgroundColor: theme.palette.primary.main,
  },
  searchBarContainer: {
    width: '30%',
  },
});

class Search extends Component {
  constructor(props){
    super(props)

    this.state = {
      isLoading: true,
      value: '',
      city: '',
      options: {
        activityLabel: 'Vad vill du boka?',
        cityLabel: 'Var?',
      },
      barWidth: 12,
    };
    this.routeChange = this.routeChange.bind(this);
  }

  componentWillMount() {
    if (this.props.type === 'main') {
      this.setState({
        barWidth: 6,
      });
    }
  }

  componentDidMount() {
    //Hämta suggestions om de inte redan är laddade
    if (suggestions.activities.length === 0) {
      fetch(process.env.REACT_APP_API_PATH + '/synonyms/')
      .then( res => res.json())
      .then( json => {
        suggestions.activities = json;
      });
    }

    if (suggestions.cities.length === 0) {
      fetch(process.env.REACT_APP_API_PATH + '/getCities/')
      .then( res => res.json())
      .then( json => {
        for(var i=0; i < json["label"].length; i++) {
          suggestions.cities.push(json["label"][i]);
        };
      });
      this.setState({
        isLoading: false,
      });
    }
  }

  routeChange = e => {
    e.preventDefault();
    let { value, city } = this.state;
    if(!value){ value = "Vad" };
    if(!city){ city = "Var" };
    let path = "/" + value + "/" + city;
    this.props.history.push(path);
  }

  handleChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  }
  render() {
    const {classes} = this.props;

    return(
      <div className={classes.root}>
        <form onSubmit={this.routeChange}>
          <Grid
            container
            className={classes.container}
            direction={'row'}
            justify={'center'}
            alignItems={'baseline'}
            spacing={8}
            >
            <Grid item xs={12}>
              <Typography variant="h4">
                {this.props.title}
              </Typography>
            </Grid>
            <Grid item className={classes.searchBarContainer} xs={12} md={this.state.barWidth}>
              <SearchBar
                label={this.state.options.activityLabel}
                name="value"
                suggestions={suggestions}
                suggestionKey="activities"
                submit={this.handleChange}
              />
            </Grid>
            <Grid item className={classes.searchBarContainer} xs={12} md={this.state.barWidth}>
              <SearchBar
                label={this.state.options.cityLabel}
                name="city"
                suggestions={suggestions}
                suggestionKey="cities"
                submit={this.handleChange}
              />
            </Grid>
            <Grid item className={classes.searchButtonContainer} xs={12}>
              <Button
                size="large"
                variant="contained"
                color="primary"
                fullWidth
                className={classes.searchButton}
                type="submit"
              >
                Sök
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    );
  }
}
export default withStyles(styles)(withRouter(Search));
