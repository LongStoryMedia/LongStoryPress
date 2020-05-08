import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";
import styles from "../app.scss";

export default ({
  isLoading,
  text,
  loadingText,
  className,
  onClick,
  style
}) => (
  <button className={className} onClick={onClick} style={style}>
    {isLoading && <FontAwesomeIcon icon={faCog} className={styles.loaderImg} />}
    {!isLoading ? text : loadingText}
  </button>
);
