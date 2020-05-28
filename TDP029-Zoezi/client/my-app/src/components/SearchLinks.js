// Quick links to specific searches
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import SearchLinksItem from './SearchLinksItem';

const styles = theme => ({
  searchLinksContainer: {
    flexGrow: 1,
    position: 'relative',
  },
  searchLinksItemContainer: {
  },
});

class SearchLinks extends Component {
  constructor(props){
    super(props)
    this.state = {
      isLoading: true,
      links: [
        ["Löpning", "Spring med andra."],
        ["Core", "Träning på låtsas."],
        ["Gympa", "Klassiskt, okomplicerat."],
        ["Spinning", "Svettigt!"],
        ["Zumba", "Dansa!"],
        ["Cirkelträning", "Bygg muskler på gymmet."],
      ]
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
      <Grid container spacing={16} className={classes.searchLinksContainer}>
        <Grid item xs={12}>
          <Typography variant="h4">
            {this.props.title}
          </Typography>
        </Grid>
        { this.state.links.map(item => (
          <Grid item xs={12} sm={6} lg={6} xl={4} key={item} className={classes.searchLinksItemContainer}>
            <SearchLinksItem data={item}/>
          </Grid>
        ))}
      </Grid>
    );
  }
}

export default withStyles(styles)(SearchLinks);
