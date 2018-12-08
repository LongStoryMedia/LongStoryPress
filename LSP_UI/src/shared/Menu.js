import React from 'react'
import { NavLink } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// adding social media icons individually to avoid bundling the whole library
// to add more options, add the fa icon with eslint diable comment
import {
  faFacebook, // eslint-disable-line no-unused-vars
  faGithubSquare, // eslint-disable-line no-unused-vars
  faGoogle, // eslint-disable-line no-unused-vars
  faInstagram, // eslint-disable-line no-unused-vars
  faLinkedin, // eslint-disable-line no-unused-vars
  faMedium, // eslint-disable-line no-unused-vars
  faPintrest, // eslint-disable-line no-unused-vars
  faRavelry, // eslint-disable-line no-unused-vars
  faSlack, // eslint-disable-line no-unused-vars
  faTwitter, // eslint-disable-line no-unused-vars
  faYoutube, // eslint-disable-line no-unused-vars
} from '@fortawesome/free-brands-svg-icons'
import isomorphic from './utils/isomorphic'
import styles from './menu.scss'

library.add(faFacebook)

export default isomorphic(
  ({ data, visible, toggleMenu, icon, style, menu, ...props }) => {
    let o, v, z, onClick
    if(toggleMenu) {
      o = visible ? 1 : 0
      v = visible ? 'visible' : 'hidden'
      z = visible ? 10 : -1
      onClick = toggleMenu
    }
    return (
      <div
        className={styles[menu]}
        style={{...style, opacity: o, visibility: v, zIndex: z}}
      >{
        data.content.map(({ object_slug, id, title }) =>
        <NavLink
          className={styles.menuItem}
          style={{...style, opacity: o, visibility: v, zIndex: z}}
          onClick={onClick}
          to={'home' !== object_slug ? `/${object_slug}` : '/'}
          key={id}
        >
        {
          icon
          ? <FontAwesomeIcon
              icon={["fab", title.toLowerCase()]}
              className={styles.socialIcon}
            />
          : title
        }
        </NavLink>)
      }</div>
    )
  },
{ param: ["menu"] })
