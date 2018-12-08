import React from "react";

export const createMarkup = sanitaryMarkup => ({ __html: sanitaryMarkup });

export const renderMarkup = (markup, i) => (
  <span key={i} dangerouslySetInnerHTML={createMarkup(markup)} />
);
