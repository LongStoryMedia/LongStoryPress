import React from "react";
import PostList from "../Sections/PostList";
import _$ from "long-story-library";
import PreviewCard from "LSP/Components/PreviewCard";
import { NavLink } from "react-router-dom";
import { renderMarkup } from "../utils/helpers";
import styles from "./blocklist.scss";

const BlockList = PostList(
  ({ lsp_gallery, title, excerpt, slug, param, postType, authenticated }) => (
    <>
      {authenticated && (
        <a
          className={styles.listItem}
          href={`${process.env.LSP_ADMIN}/wp-admin/post-new.php?post_type=${postType}`}
        >
          <PreviewCard
            title={`add new ${postType.slice(0, postType.length)}`}
            className={styles.contentBox}
          />
        </a>
      )}
      <NavLink className={styles.listItem} to={`/${param}/${slug}`}>
        {
          <PreviewCard
            featuredMedia={_$(lsp_gallery).OBJ([
              0,
              "media_details",
              "sizes",
              "medium",
              "source_url",
            ])}
            title={renderMarkup({ markup: title })}
            content={excerpt}
            className={[
              styles.contentBox,
              "background_background_two",
              "color_text_color",
            ].join(" ")}
          />
        }
      </NavLink>
    </>
  ),
  {}
);
export default (props) => <BlockList {...props} className={styles.postList} />;
