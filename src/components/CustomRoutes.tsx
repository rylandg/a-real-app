import React, {
  FC,
  createElement,
  ComponentType,
} from 'react';

import {
  Redirect,
  RouteProps,
  RouteComponentProps,
  Route,
} from 'react-router-dom';

import { User } from '../models/User';

type Comp = ComponentType<RouteComponentProps<any>> | ComponentType<any>;

const renderMergedProps = (component: Comp, ...rest: any) => {
  const finalProps = { ...rest };
  return (
    createElement(component, finalProps)
  );
}

interface PropsRouteProps extends RouteProps {
  component: Comp;
  user?: User;
}

export const PropsRoute: FC<PropsRouteProps> = ({ component: C, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return <C {...routeProps} {...rest}/>
    }}/>
  );
}

export const PrivateRoute: FC<PropsRouteProps> = ({
  component: C,
  user,
  ...rest
}) => {
  if (!user) {
    return <Redirect to='/'/>;
  }
  const merged = { ...rest, user };
  return (
    <Route {...rest} render={routeProps => {
      return <C {...routeProps} {...merged}/>
    }}/>
  );
}
