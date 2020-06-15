import React from "react";
import PageContent from "LSP/Sections/PageContent";
import { renderMarkup } from "../utils/helpers";
import styles from "./page.scss";

export default PageContent((props) => (
  <div className={styles.topContent}>
    <div className={styles.header}>
      {renderMarkup({ markup: props?.data?.body?.title })}
    </div>
    {props.parsedContent}
  </div>
));
