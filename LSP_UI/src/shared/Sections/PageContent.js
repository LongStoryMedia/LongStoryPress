import React, { PureComponent } from "react";
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

const getMetaImg = (props) =>
  _$(props).OBJ(["data", "body", "lsp_gallery", 0]) ||
  _$(props).OBJ([
    "data",
    "body",
    "lsp_galleries",
    0,
    "gallery_images",
    0,
    "src",
  ]);

export default (WC) =>
  isomorphic(
    class PageContent extends PureComponent {
      state = {
        galleryShortCodes: [],
        parsedContent: renderMarkup({ markup: this.props.data.body.content }),
        metaImg: getMetaImg(this.props),
      };
      setGalleryIfGallery = body => {
        if (body.content && getGalleryCommentJson(body.content)) {
          this.setState({
            galleryData: getGalleryData(
              getGalleryCommentJson(body.content),
              body.lsp_galleries,
              this.props
            ),
          });
        }
      }
      componentDidMount() {
        const { body } = this.props.data;
        if (!this.state.metaImg) {
          getMetaImg(this.props);
        }
        this.setGalleryIfGallery(body);
      }
      componentDidUpdate(prevProps, prevState) {
        const { galleryData } = this.state;
        const { data, location } = this.props;
        const content = _$(data).OBJ(["body", "content"]);
        if (
          data !== prevProps.data ||
          location.pathname !== prevProps.location.pathname
        ) {
          this.setGalleryIfGallery(data.body);
          this.setState({ parsedContent: renderMarkup({ markup: content }) });
        }
        if (galleryData !== prevState.galleryData) {
          this.setState({
            parsedContent: injectGallery(
              content,
              galleryData,
              styles,
              this.props
            ),
          });
        }
      }
      render() {
        const { data, children } = this.props;
        const { metaImg } = this.state;
        return (
          <>
            <Helmet>
              <title>{data.head.title}</title>
              <meta name="twitter:title" content={data.head.title} />
            </Helmet>
            {!!metaImg && (
              <Helmet>
                <meta name="twitter:image" content={metaImg.src} />
                <meta name="og:image" content={metaImg.src} />
                <meta property="og:image:type" content={metaImg.mime_type} />
              </Helmet>
            )}
            {!!data.body.content && (
              <Helmet>
                <meta
                  property="og:description"
                  content={`${removeMarkup(data.body.content).slice(
                    0,
                    248
                  )}...`}
                />
              </Helmet>
            )}
            <WC {...this.props} {...this.state}>
              {children}
            </WC>
          </>
        );
      }
    },
    { param: ["match", "params", "slug"], windowData: true }
  );
