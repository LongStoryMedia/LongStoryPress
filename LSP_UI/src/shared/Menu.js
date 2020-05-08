import React from "react";
import { NavLink } from "react-router-dom";
import isomorphic from "./utils/isomorphic";
import _$ from "long-story-library";

export default isomorphic(
  ({
    data,
    style,
    className,
    menuItemClass,
    onClick,
  }) => (
    <nav
      className={className}
      style={style}
    >
      {_$(data)
        .OBJ(["body", "content"])
        .map(({ slug, id, title, icon }) => (
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
  ),
  { param: ["menu"] }
);
