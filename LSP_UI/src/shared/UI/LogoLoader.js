import React from 'react'
import Logo from '../static/images/logo.png'
import styles from './logoloader.scss'

export default () => <div className={styles.loadingBox}>
  <img src={Logo} alt="logo" className={styles.loading}/>
</div>
