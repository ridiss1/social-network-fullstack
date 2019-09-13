import React, { Component } from 'react';
import { isAuthenticate } from '.';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ componen: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticate() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{ pathname: '/signin', state: { from: props.location } }}
        />
      )
    }
  />
);

export default PrivateRoute;
