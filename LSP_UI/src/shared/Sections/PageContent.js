import React, { PureComponent } from "react";
// import Helmet from 'react-helmet'
import { renderMarkup } from "../utils/helpers";
import styles from "./pagecontent.scss";
import isomorphic from "../utils/isomorphic";

export default isomorphic(
  class extends PureComponent {
    displayName = "PageContent";
    render() {
      const { data } = this.props;
      return (
        <div className={styles.topContent}>
          <div className={styles.header}>{data.title}</div>
          <div>{renderMarkup(data.content)}</div>
        </div>
      );
    }
  },
  { param: ["match", "params", "slug"], windowData: true }
);
