// Component showing information about an individual product

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MapView from './components/MapView';
import ProductInfo from './components/ProductInfo';
import ProductDesc from './components/ProductDesc';
import IOsocket from './components/socket';
import { Grid, Link } from '@material-ui/core';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.tertiary.main,
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
    backgroundColor: theme.palette.tertiary.main,
    minHeight: 'calc(100vh - 60px)',
    height: '100%',
    width: '80%',
    margin: 'auto',
    padding: theme.spacing.unit,
  },
  topPanel: {
    backgroundColor: theme.palette.tertiary.main,
    padding: theme.spacing.unit,
    paddingBottom: 0,
  },
  bottomContainer: {
    backgroundColor: theme.palette.tertiary.main,
    padding: theme.spacing.unit,
    paddingTop: 0,
  },
  leftPanel: {
    backgroundColor: theme.palette.tertiary.main,
  },
  mapContainer: {
    backgroundColor: theme.palette.tertiary.main,
    padding: theme.spacing.unit,
    paddingLeft: 0,
    height: '100%',
    top: 0,
  },
  colorTextPrimary: {
    color: theme.palette.primary.contrastText,
  },

});

class Product extends Component {
  constructor(props){
    super(props)

    this.updateAvailable = this.updateAvailable.bind(this)

    this.state = {
      isLoading: true,
      productInfo: null,
      siteInfo: null
    };

  }

  componentDidMount() {
    fetch(process.env.REACT_APP_API_PATH + '/getWorkout/?id=' + this.props.match.params.id)
        .then(res => res.json())
        .then(json => {
          this.setState({
            productInfo: json,
            siteInfo: json.site,
            isLoading: false,
          })
        });
  }

  updateAvailable(id, available_n){
    if(this.state.productInfo['id'] === id){
      this.setState({
          productInfo:{
            ...this.state.productInfo,
            available: available_n,
          }
      });
    }
  }

  render(){
    const { classes } = this.props;
    //Protection to make sure props are loaded.
    if ( this.state.isLoading ) {
      return null;
    }

    return(
      <div className={classes.root}>
        <header className={classes.header}>
          <Link href="/" variant="h3" className={classes.colorTextPrimary}>
            hittaträning.se
          </Link>
        </header>
        <IOsocket update = {this.updateAvailable}> </IOsocket>
        <Grid container className={classes.mainGrid}>
          <Grid item className={classes.topPanel} xs={12}>
            <ProductDesc data={this.state.productInfo} />
          </Grid>
          <Grid container spacing={0} item className={classes.bottomContainer} xs={12}>
            <Grid item className={classes.leftPanel} xs={4}>
              <ProductInfo data={this.state.productInfo} />
            </Grid>
            <Grid item className={classes.mapContainer} xs={8}>
                <MapView
                  data={[this.state.productInfo]}
                  location={this.state.siteInfo["address"]  + ", " +  this.state.siteInfo["city"]}
                  />
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Product);
