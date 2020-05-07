import React from "react";
import PageContent from "LSP/Sections/PageContent";
import styles from "./page.scss";

export default PageContent(({ data, parsedContent, ...props }) => (
  <div className={styles.topContent}>
    <div className={styles.header}>Four Oh Four!!!</div>
    <div>Page not found</div>
  </div>
));
