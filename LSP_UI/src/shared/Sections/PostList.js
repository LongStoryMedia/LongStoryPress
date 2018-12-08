import React, { PureComponent, Fragment } from "react";
import { NavLink } from "react-router-dom";
import isomorphic from "../utils/isomorphic";
import PreviewCard from "../UI/PreviewCard";
import styles from "./journals.scss";

class PostList extends PureComponent {
  render() {
    const {
      data,
      authenticated,
      settings,
      wpPostType,
      apiPostType,
      param
    } = this.props;
    return (
      <div>
        {data &&
          data.map(({ id, slug, title, excerpt, featuredMedia }) => (
            <Fragment key={id}>
              {authenticated && (
                <a
                  className={styles.listItem}
                  href={`${
                    process.env.LSP_ADMIN
                  }/wp-admin/post-new.php?post_type=${wpPostType}`}
                >
                  <PreviewCard
                    title={`add new ${apiPostType.slice(
                      0,
                      apiPostType.length
                    )}`}
                    className={styles.contentBox}
                  />
                </a>
              )}
              <NavLink className={styles.listItem} to={`/${param}/${slug}`}>
                {settings ? (
                  <PreviewCard
                    featuredMedia={
                      featuredMedia.mediaDetails.sizes.medium.source_url
                    }
                    title={title}
                    content={excerpt}
                    className={styles.contentBox}
                    style={{ backgroundColor: settings.colors.background_two }}
                  />
                ) : (
                  <p>{title}</p>
                )}
              </NavLink>
            </Fragment>
          ))}
      </div>
    );
  }
}

export default {
  blog: isomorphic(PostList, {
    param: ["match", "params", 0],
    apiPostType: "posts",
    wpPostType: "post"
  }),
  articles: isomorphic(PostList, {
    param: ["match", "params", 0],
    apiPostType: "posts",
    wpPostType: "post"
  }),
  tutorials: isomorphic(PostList, {
    param: ["match", "params", 0],
    apiPostType: "tutorials",
    wpPostType: "lsp_tutorial"
  })
};

//
