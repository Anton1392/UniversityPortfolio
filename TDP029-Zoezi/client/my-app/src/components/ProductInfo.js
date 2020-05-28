// Component showing information about an individual product

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  Divider
} from '@material-ui/core';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.tertiary.main,
    flexGrow: 1,
    position: 'relative',
    minHeight: 'calc(100vh - 60px)',
    paddingTop: 60,
  },
  mainGrid: {
    padding: theme.spacing.unit,
  },
  infoItemLeft: {
    textAlign: 'center',
  },
  infoItemCard: {
    backgroundColor: theme.palette.tertiary.light,
    textAlign: 'left',
    borderRadius: 0,
  },
  bookingButton: {
    width: '100%',
    borderRadius: 0,
  },
  cardTitle: {
    fontSize: 14,
  },
});

function getActivityTime(start, end) {
  start = start.split(" ")[1].split(":");
  end = end.split(" ")[1].split(":");
  return start[0] +":"+ start[1] + " - " + end[0] +":"+ end[1];
}

function getDate(datetime) {
  return datetime.split(" ")[0];
}

class ProductInfo extends Component {
  constructor(props){
    super(props)
    this.state = {
      isLoading: true,
      productInfo: null,
      siteInfo: null
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: false,
      productInfo: this.props.data,
    });
  }

  getPrice(){
    let price = this.props.data.price;
    if(price == null) return "Prisinformation ej tillgänglig.";
    else return price + ":-";
  }

  getLocation(){
    let address = this.props.data.site["address"];
    let zip = this.props.data.site["zipCode"];
    let city = this.props.data.site["city"];
    return address + ", " + zip + " " + city;
  }

  availableSpots(){
    return this.props.data.available;
  }
  render(){
    const { classes, data } = this.props;
    //Protection to make sure props are loaded.
    if ( !this.state.productInfo ) {
      return (<div/>);
    }

    return(
      <Grid container className={classes.mainGrid} justify="center" spacing={16}>
        <Grid item xs={12} className={classes.infoItemLeft}>
          <Card className={classes.infoItemCard}>
            <CardContent>
              <Typography className={classes.cardTitle}>
                Plats
              </Typography>
              <Typography variant="h5">
                {this.getLocation()}
              </Typography>
            </CardContent>
            <Divider/>
            <CardContent>
              <Typography className={classes.cardTitle}>
                Pris
              </Typography>
              <Typography variant="h5">
                {this.getPrice()}
              </Typography>
            </CardContent>
            <Divider/>
            <CardContent>
              <Typography className={classes.cardTitle}>
                Lediga platser
              </Typography>
              <Typography variant="h5">
                {this.availableSpots()}
              </Typography>
            </CardContent>
            <Divider/>
            <CardContent>
              <Typography className={classes.cardTitle}>
                Tid
              </Typography>
              <Typography variant="h5">
                {getActivityTime(data.startTime, data.endTime)}
              </Typography>
            </CardContent>
            <Divider/>
            <CardContent>
              <Typography className={classes.cardTitle}>
                Datum
              </Typography>
              <Typography variant="h5">
                {getDate(data.startTime)}
              </Typography>
            </CardContent>
            <Divider/>
            <CardContent>
              <Button
                variant="contained"
                color="primary"
                href={data.url}
                className={classes.bookingButton}
                >
                Gå till bokning
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(ProductInfo);
