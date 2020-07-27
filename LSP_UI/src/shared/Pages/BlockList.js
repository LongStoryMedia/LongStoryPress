import React from "react";
import Collection from "../Sections/Collection";
import _$ from "long-story-library";
import PreviewCard from "LSP/Components/PreviewCard";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./blocklist.scss";
import useApi from "../hooks/useApi";

const BlockList = (props) => {
  const location = useLocation();
  const { staticContext, fetchInitialData, restArgs } = props;
  const data = useApi({ staticContext, fetchInitialData, restArgs });
  return (
    <div className={styles.postList}>
      {data?.body?.map(({ lsp_gallery, title, excerpt, slug, id }) => (
        <NavLink
          className={styles.listItem}
          to={`${location.pathname}/${slug}`}
          key={id}
        >
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
      ))}
    </div>
  );
};
export default BlockList;
