import React from "react";
import FourOhFour from "LSP/Pages/FourOhFour";
import { Route, Switch } from "react-router-dom";
import routes from "Site/routes";

export default ({ childProps }) => (
  <Switch>
    {routes.map(({ path, exact, component: Component, ...rest }) => (
      <Route
        key={path}
        path={path}
        exact={exact}
        render={props => {
          return <Component {...childProps} {...props} {...rest} />;
        }}
      />
    ))}
    <Route component={FourOhFour} />
  </Switch>
);
