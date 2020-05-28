// Component that displays links to search results

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  List,
  ListItem,
  Typography,
  Divider
} from '@material-ui/core';
import SearchResultItem from './SearchResultItem';

const styles = theme => ({
  results: {
  },
  resultList: {
    marginTop: theme.spacing.unit,
    maxHeight: 'calc(100vh * 0.71)',
    overflow: 'auto',
  },
  searchHits: {
    textAlign: 'left',
    paddingLeft: theme.spacing.unit,
  }
});
class SearchResults extends Component {
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
    var data = [];
    if(this.props.data.length > 0 ){
      data = this.props.data;
    }
    return(
      <div className={classes.results}>
        <Typography variant="body1" className={classes.searchHits}>
          Sökningen gav {data.length} träffar
        </Typography>
        <Divider/>
        <List disablePadding={true} dense={true} className={classes.resultList}>
          {data.map((item) =>
            <ListItem key={item["id"]}>
              <SearchResultItem data={item}/>
            </ListItem>
          )}
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(SearchResults);
