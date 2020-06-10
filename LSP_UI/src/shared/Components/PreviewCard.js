import React from "react";
import { ImageDesigner } from "react-gallery-designer";
import styles from "./previewcard.scss";
import { renderMarkup } from "../utils/helpers";

export default ({
  className,
  title,
  titleClass,
  imgClass,
  contentClass,
  titleStyles,
  content,
  preview,
  featuredMedia,
  placeHolder,
  height,
  style,
  contain,
  srcset,
  children,
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
        className={[styles.title, imgClass].join(" ")}
        height={height || "10em"}
        src={featuredMedia}
        placeHolder={placeHolder ? placeHolder : featuredMedia}
        srcset={srcset}
        tag="div"
        lazy={true}
      >
        {title && (
          <span style={titleStyles} className={[styles.title, titleClass].join(" ")}>
            {renderMarkup({ markup: title })}
          </span>
        )}
        {children}
      </ImageDesigner>
    ) : (
      <div className={styles.title} style={{ opacity: 1 }}>
        <span className={titleClass}>{renderMarkup({ markup: title })}</span>
      </div>
    )}
    {content && (
      <div className={[styles.content, contentClass].join(" ")}>
        {renderMarkup({
          markup: preview
            ? preview
            : `${content.split(" ").slice(0, 30).join(" ").trim()}...`,
        })}
      </div>
    )}
  </div>
);
