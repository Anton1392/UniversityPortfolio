// Formatting of individual search results
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Card,
  CardActionArea,
  CardContent
} from '@material-ui/core';

const styles = theme => ({
  card: {
    width: '100%',
    borderRadius: 0,
  },
  textPrimary: {
    color: theme.palette.tertiary.contrastText,
  },
});
class SearchResultItem extends Component {
  constructor(props){
    super(props)
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: false,
    });
  }

  render(){
    const {classes} = this.props;
    return(
      <Card className={classes.card}>
        <CardActionArea href={"/product/" + this.props.data["id"]}>
          <CardContent>
            <Typography className={classes.textPrimary} gutterBottom variant="h6">
              {this.props.data["name"]}
            </Typography>
            <Typography className={classes.textPrimary} component="p">
              {this.props.data["startTime"]}
            </Typography>
            <Typography className={classes.textPrimary} component="p">
            {this.props.data["site"]["address"]}, {this.props.data["site"]["city"]}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
}

export default withStyles(styles)(SearchResultItem);
