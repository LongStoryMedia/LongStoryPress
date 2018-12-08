import React from 'react'
import { Route, Switch } from 'react-router-dom'
import routes from '../routes'
import NoMatch from '../Pages/NoMatch'

export default ({ childProps }) => (
  <Switch>
    {
      routes.map(
        ({
          path,
          exact,
          component: Component,
          ...rest
        }) => (
          <Route
          key={path}
          path={path}
          exact={exact}
          render={(props) => (
            <Component {...childProps} {...props} {...rest} />
          )} />
        )
      )
    }
    <Route render={(props) => <NoMatch {...props} /> } />
  </Switch>
)
