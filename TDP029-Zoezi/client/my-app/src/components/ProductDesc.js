// Component showing product description

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Card,
  CardContent
} from '@material-ui/core';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.tertiary.main,
    padding: theme.spacing.unit,
  },
  infoItemLeft: {
    textAlign: 'left',
    width: '100%',
    backgroundColor: theme.palette.tertiary.main,
  },
  card: {
    borderRadius: 0,
    minHeight: '34vh',
  },
});

class ProductDesc extends Component {
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

  render(){
    const { classes, data } = this.props;
    //Protection to make sure props are loaded.
    if ( !this.state.productInfo ) {
      return (<div/>);
    }

    return(
      <div className={classes.root}>
        <Typography variant="h2" className={classes.infoItemLeft}>
        {data.name}
        </Typography>

        <Card className={classes.card}>
          <CardContent>
            <Typography variant="body1">
              {data.pdescription}
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(ProductDesc);
