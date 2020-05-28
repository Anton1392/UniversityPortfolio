// Formatting of individual search links
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography
} from '@material-ui/core';

const styles = theme => ({
  card: {
    backgroundColor: theme.palette.tertiary.main,
    borderRadius: 0,
  },
  textPrimary: {
    color: theme.palette.tertiary.contrastText,
  }
});

class SearchLinksItem extends Component {
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
    const { classes } = this.props;
    return(
      <Card className={classes.card}>
        <CardActionArea href={"/" + this.props.data[0] + "/Var"}>
          <CardContent>
            <Typography className={classes.textPrimary} gutterBottom variant="h5" component="h2">
              {this.props.data[0]}
            </Typography>
            <Typography className={classes.textPrimary} component="p">
              {this.props.data[1]}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
}

export default withStyles(styles)(SearchLinksItem);
