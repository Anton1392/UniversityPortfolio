import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  List,
} from '@material-ui/core';
import SearchLogItem from './SearchLogItem';

const styles = theme => ({
  button: {
    borderRadius: 0,
    margin: 10,
  }
});

class SearchLogForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      synonyms: [],
      logs: [],
    }
    this.removeLog = this.removeLog.bind(this);
    this.newCat = this.newCat.bind(this);
  }

  componentWillMount() {
    fetch(process.env.REACT_APP_API_PATH + '/synonyms/')
    .then( res => res.json())
    .then( json => {
      this.setState({
        synonyms: json,
      });
    });

    fetch(process.env.REACT_APP_API_PATH + '/getSearches')
    .then( res => res.json())
    .then( json => {
      this.setState({
        logs: json,
      });
    });
  }

  componentDidMount() {
    this.setState({
      isLoading: false,
    });
  }

  removeLog(term) {
    var { logs } = this.state;
    logs = logs.filter( el => el.term !== term);
    this.setState({
      logs: logs,
    });
  }

  newCat(term) {
    var { synonyms } = this.state;
    synonyms[term] = [term];
    this.setState({
      synonyms: synonyms,
    });
  }

  render(){
    var { synonyms, logs } = this.state;
    var lkeys = Object.keys(logs);
    return(
      <div>
        <Typography variant="h6">Okategoriserade sökningar</Typography>
        <List>
          {lkeys.map(item => (
            <SearchLogItem key={item}
              term={logs[item]}
              synonyms={synonyms}
              addSyn={this.props.addSyn}
              addCat={this.props.addCat}
              remove={this.props.remove}
              newCat={this.newCat}
              remLog={this.removeLog}/>
          ))}
        </List>
      </div>
    );
  }
}
export default withStyles(styles)(SearchLogForm);
