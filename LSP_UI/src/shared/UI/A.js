import React, { PureComponent } from 'react'
import { NavLink } from 'react-router-dom'

export default class A extends PureComponent {
  isActive = (match, path, location) => !!(match || path === location.pathname)
  render() {
    const { to, className, activeClassName, children } = this.props
    return <NavLink to={to} className={className} activeClassName={activeClassName} isActive={this.isActive.bind(this, to)}>{children}</NavLink>
  }
}
