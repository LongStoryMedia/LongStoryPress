import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { renderMarkup, removeMarkup } from "LSP/utils/helpers";
import {
  injectGallery,
  getGalleryData,
  getGalleryCommentJson,
} from "LSP/utils/galleryHelpers";
import _$ from "long-story-library";
import styles from "./pagecontent.scss";
import isomorphic from "LSP/utils/isomorphic";
import { useLocation } from "react-router";

const PageContent = (WC) =>
  isomorphic((props) => {
    let location = useLocation();
    const [parsedContent, setParsedContent] = useState(
      props?.data?.body?.content
    );
    const metaImg =
      props?.data?.body?.lsp_gallery?.[0] ||
      props?.data?.body?.lsp_galleries?.[0]?.gallery_images?.[0]?.src;
      
    const parseContent = (body) => {
      if (body?.content && getGalleryCommentJson(body?.content)) {
        setParsedContent(
          injectGallery(
            body?.content,
            getGalleryData(
              getGalleryCommentJson(body?.content),
              body?.lsp_galleries,
              props
            ),
            styles,
            props
          )
        );
      } else {
        setParsedContent(renderMarkup({ markup: body?.content }));
      }
    };
    useEffect(() => {
      parseContent(props.data?.body);
    }, [props.data]);
    return (
      <>
        <Helmet>
          <title>{props.data?.head?.title}</title>
          <meta name="twitter:title" content={props.data?.head?.title} />
        </Helmet>
        {metaImg && (
          <Helmet>
            <meta name="twitter:image" content={metaImg?.src} />
            <meta name="og:image" content={metaImg?.src} />
            <meta property="og:image:type" content={metaImg?.mime_type} />
          </Helmet>
        )}
        {props.data?.body?.content && (
          <Helmet>
            <meta
              property="og:description"
              content={`${removeMarkup(props.data?.body?.content)?.slice(
                0,
                248
              )}...`}
            />
          </Helmet>
        )}
        <WC {...props} parsedContent={parsedContent}>
          {props.children}
        </WC>
      </>
    );
  });
export default PageContent;
