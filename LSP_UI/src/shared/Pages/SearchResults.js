import React from "react";
import PostList from "../Sections/PostList";
import { NavLink } from "react-router-dom";
import styles from "./searchresults.scss";

const SearchResults = PostList(
  ({ url, title, i, ...props }) => (
    <NavLink
      className={styles.listItem}
      to={`/${url && url.replace(/^https?:\/\/.*?\//, "")}`}
    >
      <span className={styles.number}>{i + 1})</span>
      <span className={styles.title}>{title}</span>
    </NavLink>
  ),
  { windowData: true, param: ["location", "search"] }
);
export default props => (
  <SearchResults {...props} className={styles.postList} header="Search Results" headerClass={styles.header} />
);
