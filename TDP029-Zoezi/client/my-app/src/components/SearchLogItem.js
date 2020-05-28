import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Paper,
  Grid,
  ListItem,
} from '@material-ui/core';

const styles = theme => ({
  paper: {
    padding: 20,
    width: '80%',
    margin: 'auto'
  },
  textField: {
    [`& fieldset`]: {
      borderRadius: 0,
    },
  },
  button: {
    borderRadius: 0,
  }
});

class SearchLogItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      values: [],
    }
    this.handleRemove = this.handleRemove.bind(this);
    this.handleAddSyn = this.handleAddSyn.bind(this);
    this.handleAddCat = this.handleAddCat.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.setState({
      isLoading: false,
    });
  }

  handleRemove(term){
    this.props.remove(term);
    this.props.remLog(term);
  }

  handleAddSyn(term){
    this.props.addSyn(term, this.state.values);
  }

  handleAddCat(term){
    this.props.addCat(term);
    this.props.newCat(term);
  }

  handleCheck(e){
    var options = e.target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    this.setState({
      values: value,
    });
  }

  render(){
    const { classes } = this.props;
    var skeys = Object.keys(this.props.synonyms);
    return(
      <ListItem>
        <Paper className={classes.paper}>

          <Grid container spacing={8}>
            <Grid item xs={12}>
              Sökterm: {this.props.term["term"]}
              <br/>
              Antal: {this.props.term["count"]}
            </Grid>

            <Grid item xs={12}>
              <Button className={classes.button} variant="contained" color="primary" onClick={() => this.handleRemove(this.props.term["term"])}>
                Rensa sökning
              </Button>
            </Grid>

            <Grid item xs={12}>
              Synonymkategorier
              <br/>
              <select multiple={true} value={this.props.arrayOfOptionValues} onChange={this.handleCheck}>
              {skeys.map(sitem => (
                <option key={sitem} value={sitem}>{sitem}</option>
              ))}
              </select>
            </Grid>

            <Grid item xs={12}>
              <Button className={classes.button} variant="contained" color="primary" onClick={() => this.handleAddSyn(this.props.term["term"])}>
                Lägg till som synonym
              </Button>

              <Button className={classes.button} variant="contained" color="primary" onClick={() => this.handleAddCat(this.props.term["term"])}>
                Lägg till som kategori
              </Button>
            </Grid>

          </Grid>

        </Paper>
      </ListItem>
    );
  }
}
export default withStyles(styles)(SearchLogItem);
