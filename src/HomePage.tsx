import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';

import { useAuth } from '@reshuffle/react-auth';

import { isLoggedIn } from '../backend/user';

import './styles/HomePage.scss';

export const HomePage: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<any>(false);
  const { getLoginURL, getLogoutURL } = useAuth();

  useEffect(() => {
    async function load() {
      const lI = await isLoggedIn();
      console.log(lI);
      setLoggedIn(lI);
    }
    load();
  }, []);

  // console.log(loading);

  if (loggedIn) {
    return <div>
      <a href={getLogoutURL()}>
        Logout
      </a>
      {loggedIn.displayName}

    </div>;
  }


  return (
    <a href={getLoginURL()}>
      Login
    </a>
  );
}
