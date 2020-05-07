import React, { PureComponent } from "react";
import PageContent from "LSP/Sections/PageContent";
import PreviewCard from "LSP/Components/PreviewCard";
import { NavLink } from "react-router-dom";
import _$ from "long-story-library";
import { renderMarkup } from "../utils/helpers";
import styles from "./page.scss";

export default PageContent(
  class Default extends PureComponent {
    render() {
      const { data, parsedContent } = this.props;
      return (
        <>
          <div className={styles.topContent}>
            <div className={styles.header}>
              {renderMarkup({ markup: data.body.title })}
            </div>
            <>{parsedContent}</>
          </div>
          {!!data.body.children && (
            <div className={styles.secondary}>
              {data.body.children.map(
                ({ id, title, content, lsp_gallery, lsp_subsection }) =>
                  lsp_subsection ? (
                    <NavLink
                      className={styles.section}
                      to={lsp_subsection.link_to ? lsp_subsection.link_to : "/"}
                      key={id}
                    >
                      <PreviewCard
                        featuredMedia={_$(lsp_gallery).OBJ([
                          0,
                          "media_details",
                          "sizes",
                          "medium",
                          "source_url",
                        ])}
                        title={title}
                        content={content ? content : ""}
                        titleStyles={[
                          "background_background_two",
                          "color_text_color",
                          "hover_color_accent_color",
                          "pseudo_background_secondary_color",
                        ].join(" ")}
                        imgStyles="children_hover_color_accent_color"
                        className={styles.contentBox}
                      />
                    </NavLink>
                  ) : null
              )}
            </div>
          )}
        </>
      );
    }
  }
);
