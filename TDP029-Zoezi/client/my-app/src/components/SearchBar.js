// Component that handles search input and returns
// data to the parent component.

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import PropTypes from 'prop-types';
import { Paper, TextField, MenuItem } from '@material-ui/core';

var suggestions = [];

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      className={classes.textField}
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input,
        },
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion, query);
  const parts = parse(suggestion, matches);
  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) =>
          part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </strong>
          ),
        )}
      </div>
    </MenuItem>
  );
}

function getSuggestions(value, suggestionKey) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;
  if(inputLength === 0) return [];
  if(suggestionKey === 'activities'){
    let res = [];
    for(var group in suggestions.activities){
      // eslint-disable-next-line
      let temp = suggestions.activities[group].filter(suggestion => {
          const keep =
            count < 5 && suggestion.slice(0, inputLength).toLowerCase() === inputValue;
          if (keep) {
            count += 1;
          }
          return keep;
        });
      if(temp.length >= 1) res.push(group);
    }
    return res;
  }
  else if(suggestionKey === 'cities'){
    return suggestions.cities.filter(suggestion => {
      const keep =
        count < 5 && suggestion.slice(0, inputLength).toLowerCase() === inputValue;
      if (keep) {
        count += 1;
      }
      return keep;
    });
  }
}

function getSuggestionValue(suggestion) {
  return suggestion;
}

const styles = theme => ({
  container: {
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 10,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  textField: {
    [`& fieldset`]: {
      borderRadius: 0,
    },
    backgroundColor: 'white',
  }
});

class SearchBar extends Component {
  constructor(props){
    super(props)

    this.state = {
      isLoading: true,
      value: '',
      suggestions: [],
      result: [],
    };
    this.handleChange = this.handleChange.bind(this);


  }

  componentWillMount() {
    suggestions = this.props.suggestions;
    let path = this.props.location.pathname.split('/');
    if(path.length > 2){
      if(this.props.suggestionKey === 'activities' && path[1] !== "Vad"){
        this.setState({
          value: path[1],
        });
        this.props.submit(this.props.name, path[1]);
      }
      if(this.props.suggestionKey === 'cities' && path[2] !== "Var"){
        this.setState({
          value: path[2],
        });
        this.props.submit(this.props.name, path[2]);
      }
    }
  }

  componentDidMount() {
    this.setState({
      isLoading: false,
    });

  }

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value, this.props.suggestionKey),
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handleChange = name => (event, { newValue }) => {

    this.setState({
      [name]: newValue,
    });
    this.props.submit(this.props.name, newValue);
  };

	handleSuggestionsChange(suggestions) {
		if (suggestions.length) {
			this.setState({ suggestions });
		}
  }

  render() {
    const {classes} = this.props;
    const autosuggestProps = {
      renderInputComponent,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion,
    };

    return(
      <Autosuggest
        {...autosuggestProps}
        inputProps={{
          classes,
          name: this.props.name,
          value: this.state.value,
          onChange: this.handleChange('value'),
          placeholder: this.props.label,
          variant: 'outlined',
        }}
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderSuggestionsContainer={options => (
          <Paper {...options.containerProps} square>
            {options.children}
          </Paper>
        )}
      />
    );
  }
}

SearchBar.propTypes = {
  label: PropTypes.string,
  suggestions: PropTypes.object,
  suggestionKey: PropTypes.string.isRequired,
}
export default withStyles(styles)(withRouter(SearchBar));
