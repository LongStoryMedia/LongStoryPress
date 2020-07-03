import React from "react";
import Collection from "../Sections/Collection";
import _$ from "long-story-library";
import PreviewCard from "LSP/Components/PreviewCard";
import { NavLink } from "react-router-dom";
import styles from "./blocklist.scss";

const BlockList = Collection(
  ({ lsp_gallery, title, excerpt, slug, postType, authenticated, data }) => (
    <>
      {authenticated && (
        <a
          className={styles.listItem}
          href={`${process.env.LSP_ADMIN}/wp-admin/post-new.php?post_type=${postType}`}
        >
          <PreviewCard
            title={`add new ${postType.slice(0, postType?.length)}`}
            className={styles.contentBox}
          />
        </a>
      )}
      <NavLink className={styles.listItem} to={`/${data.head.type}/${slug}`}>
        {
          <PreviewCard
            featuredMedia={
              lsp_gallery?.[0]?.media_details?.sizes?.medium?.source_url
            }
            title={title}
            content={excerpt}
            className={styles.contentBox}
            titleClass={[
              styles.postTitle,
              "background_background_two",
              "color_text_color",
              "hover_color_accent_color",
              "pseudo_background_secondary_color",
            ].join(" ")}
          />
        }
      </NavLink>
    </>
  )
);
export default (props) => <BlockList {...props} className={styles.postList} />;
