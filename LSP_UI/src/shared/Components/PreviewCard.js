import React from "react";
import { ImageDesigner } from "react-gallery-designer";
import styles from "./previewcard.scss";
import { renderMarkup } from "../utils/helpers";

export default ({
  className,
  title,
  titleStyles,
  imgStyles,
  contentStyles,
  content,
  preview,
  featuredMedia,
  placeHolder,
  height,
  style,
  contain,
  srcset,
}) => (
  <div
    className={[styles.contentBox, className, "background_background_one"].join(
      " "
    )}
    style={style}
  >
    {featuredMedia ? (
      <ImageDesigner
        contain={contain}
        className={[styles.title, imgStyles].join(" ")}
        height={height || "10em"}
        src={featuredMedia}
        placeHolder={placeHolder ? placeHolder : featuredMedia}
        srcset={srcset}
        tag="div"
        lazy={false}
      >
        {title && (
          <span className={[styles.title, titleStyles].join(" ")}>{title}</span>
        )}
      </ImageDesigner>
    ) : (
      <div className={styles.title} style={{ opacity: 1 }}>
        <span className={titleStyles}>{title}</span>
      </div>
    )}
    {content && (
      <div className={[styles.content, contentStyles].join(" ")}>
        {renderMarkup({ markup: preview ? preview : `${content.split(" ").slice(0, 30).join(" ").trim()}...` })}
      </div>
    )}
  </div>
);
