import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ContainerDimensions from 'react-container-dimensions';
import { Grid, Link } from '@material-ui/core';
import SearchResults from './components/SearchResults';
import Search from './components/Search';
import MapView from './components/MapView';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.tertiary.main,
    flexGrow: 1,
    position: 'relative',
    minHeight: 'calc(100vh - 60px)',
    paddingTop: 60,
    paddingBottom: 0,
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
  mainGrid: {
    minWidth: '400px',
    minHeight: 'calc(100vh - 60px)',
    maxHeight: 'calc(100vh - 60px)',
    width: '100%',
    marginTop: 0,
  },
  searchAndResults: {
    backgroundColor: theme.palette.tertiary.main,
    padding: theme.spacing.unit,
    paddingBottom: 0,
    height: '100%',
    minHeight: 'calc(100vh - 60px)',
  },
  searchContainer: {
    backgroundColor: theme.palette.tertiary.main,
    padding: theme.spacing.unit,
    paddingBottom: 0,
    height: '100%'
  },
  resultsContainer: {
    backgroundColor: theme.palette.tertiary.main,
    padding: theme.spacing.unit,
    paddingBottom: 0,
    height: '100%',
  },
  mapContainer: {
    backgroundColor: theme.palette.tertiary.main,
    minHeight: 'calc(100vh - 60px)',
    flexGrow: '1',
  },
  colorTextPrimary: {
    color: theme.palette.primary.contrastText,
  },
});

class Results extends Component {
  constructor(props){
    super(props)
    this.state = {
      isLoading: true,
      searchResult: [],
      title: "Sökresultat",
      location: null,
      activity: null,
    }
  }
  componentDidMount(){
    this.doSearch();
    this.setState({
      location: this.props.match.params.stad,
      activity: this.props.match.params.aktivitet,
      isLoading: false
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
   if (nextProps.match.params.stad !== prevState.city || nextProps.match.params.aktivitet !== prevState.activity){
      const currentActivity = nextProps.match.params.aktivitet
      const currentLocation = nextProps.match.params.stad
      return {
        activity: currentActivity,
        city: currentLocation,
      }
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.location.pathname !== this.props.location.pathname){
      this.doSearch();
      return;
    }
  }

  doSearch() {
    let activity = this.props.match.params.aktivitet;
    let location = this.props.match.params.stad;
    let request = '?search='
    if (activity !== 'Vad') {
      request += activity;
    };
    request += '&city=';
    if (location !== 'Var') {
      request += location;
    };
    fetch(
      process.env.REACT_APP_API_PATH + '/search/' + request)
      .then(res => res.json())
      .then(json => {
        this.setState({
          searchResult: json
        });
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <header className={classes.header}>
          <Link href="/" variant="h3" className={classes.colorTextPrimary}>
            hittaträning.se
          </Link>
        </header>
        <Grid container spacing={24} className={classes.mainGrid}>
          <Grid container direction="column" item className={classes.searchAndResults} xs={3}>
            <Grid item className={classes.searchContainer} xs={12}>
              <Search type='results'/>
            </Grid>
            <Grid item className={classes.resultsContainer} xs={12}>
              <SearchResults data={this.state.searchResult}/>
            </Grid>
          </Grid>
          <Grid item className={classes.mapContainer} xs={9}>
            <ContainerDimensions>
              <MapView data={this.state.searchResult} location={this.props.match.params.stad}/>
            </ContainerDimensions>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Results);
