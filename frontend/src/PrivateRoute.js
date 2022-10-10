import React from 'react';
import {
    Route,
    Redirect,
} from "react-router-dom";
import { useAuth } from './hooks/use-auth';

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
    const auth = useAuth()

    if (auth.loadingUser) {
      return <p>Loading..</p>;
    }

    return (
      <Route
        {...rest}
        render={({ location }) =>
          auth.user && !auth.isLoading ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }

export default PrivateRoute;