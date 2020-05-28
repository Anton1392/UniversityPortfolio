import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, CircularProgress, Typography } from '@material-ui/core';
import Search from './components/Search';
import SearchLinks from './components/SearchLinks';

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
  mainGrid: {
    backgroundColor: theme.palette.tertiary.light,
    minHeight: 'calc(100vh - 60px)',
    minWidth: '400px',
    height: '100%',
    width: '60%',
    margin: 'auto',
  },
  searchContainer: {
    backgroundColor: theme.palette.tertiary.light,
    marginTop: '10%',
    maxWidth: '80%',
  },
  linksContainer: {
    maxWidth: '80%'
  },
  colorTextPrimary: {
    color: theme.palette.primary.contrastText,
  },
});

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      isLoading: true,
      title: "hittaträning.se",
      searchTitle: "Hitta träningspass!",
      popularSearches: "Populära sökningar",
    }
  }
  componentDidMount(){
    this.setState({
      isLoading: false,
    });
  }


  render() {
    const { classes } = this.props;
    const { isLoading } = this.state;
    if(isLoading) {
      return (
        <Grid className={classes.root}>
          <CircularProgress />
        </Grid>
      );
    } else {
      return (
        <div className={classes.root}>
          <header className={classes.header}>
            <Typography className={classes.colorTextPrimary} variant="h3">
              {this.state.title}
            </Typography>
          </header>
          <Grid container spacing={24} className={classes.mainGrid} justify={'center'} alignItems={'baseline'}>
            <Grid item className={classes.searchContainer} xs={12}>
              <Search type='main' title={this.state.searchTitle}/>
            </Grid>
            <Grid item className={classes.linksContainer} xs={12}>
              <SearchLinks title={this.state.popularSearches}/>
            </Grid>
          </Grid>
        </div>
      );
    }
  }
}

export default withStyles(styles)(App);
