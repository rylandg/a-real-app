import '@reshuffle/code-transform/macro';
import React from 'react';

import { Route, Switch } from 'react-router-dom';

import { HomePage } from './HomePage';

const Router: React.FC = () => {
  return (
    <Switch>
      <Route component={HomePage} />
    </Switch>
  );
}

export default Router;
