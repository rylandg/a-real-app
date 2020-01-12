import '@reshuffle/code-transform/macro';
import React, { FC } from 'react';

import {
  RouteComponentProps,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '@reshuffle/react-auth';

import { User } from './models/User';

import './styles/HomePage.scss';

interface HomePageProps {
  user?: User;
}

export const HomePage: FC<HomePageProps> = ({ user }) => {
  const { getLoginURL } = useAuth();
  if (user) {
    return <Redirect to='/user-page'/>;
  }
  return (
    <a href={getLoginURL()}>
      Login
    </a>
  );
}
