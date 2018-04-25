import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MainApp from './App';
import registerServiceWorker from './registerServiceWorker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as firebase from 'firebase';
import config from "./config.js"
const App = () =>(
  <MuiThemeProvider>
    <MainApp />
  </MuiThemeProvider>
);
firebase.initializeApp(config);
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
