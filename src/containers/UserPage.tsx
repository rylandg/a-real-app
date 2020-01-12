import '@reshuffle/code-transform/macro';
import React, { FC } from 'react';

import { useAuth } from '@reshuffle/react-auth';

import { User } from '../models/User';

import '../styles/UserPage.scss';

interface UserPageProps {
  user: User;
}

export const UserPage: FC<UserPageProps> = ({ user }) => {
  const { getLogoutURL } = useAuth();
  return (
    <div>
      Hello {user.displayName}
      <a href={getLogoutURL()}>
        Logout
      </a>
    </div>
  );
}
