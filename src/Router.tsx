import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';

import { Route, Switch } from 'react-router-dom';
import { useAuth } from '@reshuffle/react-auth';

import { createOrGetUser } from '../backend/user';

import { User } from './models/User';

import {
  PropsRoute,
  PrivateRoute,
} from './components/CustomRoutes';

import { UserPage } from './containers/UserPage';
import { HomePage } from './HomePage';

const Router: React.FC = () => {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    async function load() {
      const user = await createOrGetUser();
      console.log(user);
      setUser(user);
    }
    load();
  }, []);

  return (
    <Switch>
      <PrivateRoute
        exact path='/user-page'
        component={UserPage}
        user={user}
      />
      <PropsRoute component={HomePage} user={user}/>
    </Switch>
  );
}

export default Router;
