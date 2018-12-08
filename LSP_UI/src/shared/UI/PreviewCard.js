import React from "react";
import styles from "./previewcard.scss";
import ProgressiveImg from "./ProgressiveImg";
import { renderMarkup } from "../utils/helpers";

export default ({
  className,
  title,
  titleStyles,
  contentStyles,
  content,
  featuredMedia,
  placeHolder,
  height,
  style,
  contain,
  ...props
}) => (
  <div className={[styles.contentBox, className].join(" ")} style={style}>
    {typeof featuredMedia !== "undefined" ? (
      <ProgressiveImg
        contain={contain}
        className={[styles.title, titleStyles].join(" ")}
        height={height || "10em"}
        src={featuredMedia}
        placeHolder={placeHolder}
      >
        {title && title}
      </ProgressiveImg>
    ) : (
      <div className={styles.title} style={{ opacity: 1 }}>
        <span className={titleStyles}>{title}</span>
      </div>
    )}
    {content && (
      <div className={[styles.content, contentStyles].join(" ")}>
        {renderMarkup(content)}
      </div>
    )}
  </div>
);
