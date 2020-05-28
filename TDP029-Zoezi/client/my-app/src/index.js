import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Results from './Results';
import Product from './Product';
import Admin from './Admin';
import NotFound from './NotFound';
import * as serviceWorker from './serviceWorker';
import {
  createMuiTheme,
  MuiThemeProvider,
  createGenerateClassName
} from '@material-ui/core/styles';
import {Switch, BrowserRouter, Route} from 'react-router-dom';
import { red } from '@material-ui/core/colors';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import DateFnsUtils from '@date-io/date-fns';
import JssProvider from 'react-jss/lib/JssProvider';

const generateClassName = createGenerateClassName({
      dangerouslyUseGlobalCSS: false,
      productionPrefix: 'c',
});

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      light: '#a257b1',
      main: '#712981',
      dark: '#420054',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#5895e3',
      main: '#0d68b1',
      dark: '#003e81',
      contrastText: '#ffffff',
    },
    tertiary: {
      light: '#ffffff',
      main: '#f0f0f0',
      dark: '#bebebe',
      contrastText: '#000000',
    },
    error: red,
  },
});

ReactDOM.render(
  <JssProvider generateClassName={generateClassName}>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/product/:id" component={Product}/>
            <Route exact path="/:aktivitet/:stad" component={Results}/>
            <Route exact path="/admin" component={Admin}/>
            <Route exact path="/" component={App}/>
            <Route path="/" component={NotFound}/>
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    </MuiPickersUtilsProvider>
  </JssProvider>,
  document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
