import React from "react";
import { renderMarkup, styleStringToObject } from "LSP/utils/helpers";
import _$ from "long-story-library";
import Gallery from "react-gallery-designer";

export function injectGallery(content, galleryData, styles, props) {
  const sreg = new RegExp("<!--(lsp_gallery:{.+?})-->", "gi");
  const splitContent = content.split(sreg);
  let i = 0;
  return splitContent.map((html, index) => {
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
          {...props}
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
    return renderMarkup({ markup: html, i: index });
  });
}
export const getGalleryData = (galleries, lsp_galleries, props) =>
  galleries.map((s, i) => {
    const shortcode = JSON.parse(s.match(/({.+?})-->/)[1]);
    const gallery = lsp_galleries[i];
    const { gallery_data, gallery_images } = gallery;
    const width = _$(shortcode).OBJ(["style", "width"]);
    const containerWidth = width
      ? /px/gi.test(width)
        ? Number(width)
        : _$(Number(width)).vw()
      : props.clientWidth;
    return {
      slug: shortcode.slug,
      position: gallery.position,
      inContent: shortcode["in-content"],
      imgWidth: shortcode["img-width"],
      imgHeight: shortcode["img-height"],
      style: styleStringToObject(gallery.gallery_data.style),
      settings: gallery_data,
      images: gallery_images.map((img) => {
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
  });

export const getGalleryCommentJson = (content) =>
  content.match(/<!--lsp_gallery:(.+?)-->/gi);
