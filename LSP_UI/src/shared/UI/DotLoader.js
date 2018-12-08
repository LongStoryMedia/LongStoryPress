import React from 'react'
import styles from './dotloader.scss'

export default ({ loading, infoText, ...props }) => (
  loading
  ? <div className={styles.loader}>
      <h2 className={styles.infoText}>{infoText}</h2>
      <div className={styles.dots}>
        <span className={[styles.bull, styles.one].join(" ")}>&bull;</span>
        <span className={[styles.bull, styles.two].join(" ")}>&bull;</span>
        <span className={[styles.bull, styles.three].join(" ")}>&bull;</span>
      </div>
    </div>
  : null
)
