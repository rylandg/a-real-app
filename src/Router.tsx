import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';

import { Switch } from 'react-router-dom';
import { useAuth } from '@reshuffle/react-auth';

import { createOrGetUser } from '../backend/user';

import { User } from './models/User';

import {
  PropsRoute,
  PrivateRoute,
} from './components/CustomRoutes';

import { Upload } from './containers/Upload';
import { UserPage } from './containers/UserPage';
import { HomePage } from './HomePage';

const Router: React.FC = () => {
  const { loading, authenticated } = useAuth();
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    async function load() {
      const user = await createOrGetUser();
      setUser(user);
    }
    load();
  }, []);

  if (
    loading ||
    authenticated === undefined ||
    (authenticated && !user)
  ) {
    return null;
  }

  return (
    <Switch>
      <PrivateRoute
        exact path='/upload'
        component={Upload}
        user={user}
      />
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
