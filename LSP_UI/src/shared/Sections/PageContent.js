import React, { PureComponent } from "react";
import { Helmet } from "react-helmet-async";
import { renderMarkup, removeMarkup } from "../utils/helpers";
import _$ from "long-story-library";
import styles from "./pagecontent.scss";
import isomorphic from "../utils/isomorphic";
import Gallery from "react-gallery-designer";

const getMetaImg = (props) =>
  _$(props).OBJ(["data", "body", "lsp_gallery", 0]) ||
  _$(props).OBJ(["data", "body", "lsp_gallerys", 0, "gallery_gallery", 0, "src"]);

export default (WC) =>
  isomorphic(
    class PageContent extends PureComponent {
      constructor(props) {
        super(props);
        this.state = {
          galleryShortCodes: [],
          parsedContent: renderMarkup({ markup: this.props.data.body.content }),
          metaImg: getMetaImg(this.props),
        };
      }
      componentDidMount() {
        const { content } = this.props.data.body;
        if (!this.state.metaImg) getMetaImg(this.props);
        if (content && content.match(/<!--lsp_gallery:(.+?)-->/gi)) {
          this.gallerys(content.match(/<!--lsp_gallery:(.+?)-->/gi));
        }
        // this.setState({ parsedContent: renderMarkup(content) });
      }
      componentDidUpdate(prevProps, prevState) {
        const { galleryData } = this.state;
        const { data, location } = this.props;
        const content = _$(data).OBJ(["body", "content"]);
        if (
          data !== prevProps.data ||
          location.pathname !== prevProps.location.pathname
        ) {
          if (content.match(/<!--lsp_gallery:(.+?)-->/gi)) {
            this.gallerys(content.match(/<!--lsp_gallery:(.+?)-->/gi));
          }
          this.setState({ parsedContent: renderMarkup({ markup: content }) });
        }
        if (galleryData !== prevState.galleryData) {
          const sreg = new RegExp("<!--(lsp_gallery:{.+?})-->");
          const splitContent = content.split(sreg);
          let i = 0;
          const galleryInject = splitContent.map((html, idx) => {
            if (/^lsp_gallery/.test(html)) {
              const idx = i++;
              const shortcode = JSON.parse(html.replace("lsp_gallery:", ""));
              const position = shortcode["in-content"]
                ? {
                    position: "relative",
                  }
                : {
                    position: "absolute",
                    top: galleryData[idx].position === "top" ? 0 : "",
                    bottom: galleryData[idx].position === "bottom" ? 0 : "",
                    left: 0,
                  };
              return (
                <Gallery
                  {...this.props}
                  className={[styles.gallery, shortcode.slug].join(" ")}
                  settings={galleryData[idx].settings}
                  images={galleryData[idx].images}
                  key={`${shortcode.slug}-${idx}`}
                  id={`${galleryData[idx].slug}-gallery-${idx}`}
                  style={{
                    ...position,
                    ...galleryData[idx].style,
                  }}
                  imgStyle={{
                    ...galleryData[idx].imgStyle,
                    width: galleryData[idx].imgWidth || "100%",
                    height: galleryData[idx].imgHeight || "",
                  }}
                  contain={galleryData[idx].contain}
                  suppressHydrationWarning={true}
                />
              );
            }
            return renderMarkup({ markup: html, i: idx });
          });
          this.setState({
            parsedContent: galleryInject,
          });
        }
      }

      gallerys = (gallerys) => {
        const { clientWidth } = this.props;
        const { lsp_gallerys } = this.props.data.body;
        this.setState({
          galleryData: gallerys.map((s, i) => {
            const shortcode = JSON.parse(s.match(/({.+?})-->/)[1]);
            const gallery = lsp_gallerys[i];
            const { gallery_data, gallery_gallery } = gallery;
            const width = _$(shortcode).OBJ(["style", "width"]);
            const containerWidth = width
              ? /px/gi.test(width)
                ? Number(width)
                : _$(Number(width)).vw
              : clientWidth;
            return {
              slug: shortcode.slug,
              position: gallery.position,
              inContent: shortcode["in-content"],
              imgWidth: shortcode["img-width"],
              imgHeight: shortcode["img-height"],
              style: shortcode.style,
              settings: gallery_data,
              images: gallery_gallery.map((img) => {
                const { sizes, image_meta } = img.media_details;
                return {
                  name: img.name,
                  alt: img.alt,
                  mimeType: img.mime_type,
                  src: !gallery_data.originalsize
                    ? containerWidth > 1024 && sizes.gallery_hd
                      ? sizes.gallery_hd.source_url
                      : containerWidth > 768 && sizes.gallery_large
                      ? sizes.gallery_large.source_url
                      : containerWidth > 480 && sizes.gallery_medium
                      ? sizes.gallery_medium.source_url
                      : sizes.gallery_small
                      ? sizes.gallery_small.source_url
                      : img.src
                    : containerWidth > 1024 && sizes.hd
                    ? sizes.hd.source_url
                    : containerWidth > 768 && sizes.large
                    ? sizes.large.source_url
                    : containerWidth > 480 && sizes.medium_large
                    ? sizes.medium_large.source_url
                    : sizes.medium
                    ? sizes.medium.source_url
                    : img.src,
                  srcset: img.srcset,
                  sizes: img.sizes,
                  placeholder: !gallery_data.originalsize
                    ? sizes.gallery_thumb
                      ? sizes.gallery_thumb.source_url
                      : img.src
                    : sizes.thumbnail
                    ? sizes.thumbnail.source_url
                    : img.src,
                  id: img.id,
                  caption: img.caption,
                  link: img.link,
                  target: img.target,
                  title: image_meta.title,
                  credit: image_meta.credit,
                  keywords: image_meta.keywords,
                };
              }),
            };
          }),
        });
      };
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
