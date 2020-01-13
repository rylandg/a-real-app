import React from 'react';
import ReactDOM from 'react-dom';

import 'sanitize.css';
import 'sanitize.css/forms.css';
import 'sanitize.css/typography.css';

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@reshuffle/react-auth';

import * as serviceWorker from './serviceWorker';

import Router from './Router';

import './styles/index.scss';

ReactDOM.render((
  <AuthProvider>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </AuthProvider>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
