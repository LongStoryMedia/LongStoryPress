import React from "react";
import { NavLink } from "react-router-dom";
import isomorphic from "LSP/utils/isomorphic";
import _$ from "long-story-library";

export default isomorphic(
  ({ data, style, className, menuItemClass, onClick }) => {
    const content = _$(data).OBJ(["body", "content"]) || [
      { slug: "", id: "", title: "", icon: "" },
    ];
    return (
      <nav className={className} style={style}>
        {content.map(({ slug, id, title, icon }) => (
          <NavLink
            className={menuItemClass}
            onClick={onClick}
            onTouchStart={onClick}
            to={"home" !== slug ? `/${slug}` : "/"}
            key={id}
          >
            {icon ? icon : title}
          </NavLink>
        ))}
      </nav>
    );
  },
  { param: ["menu"] }
);
