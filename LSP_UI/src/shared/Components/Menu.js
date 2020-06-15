import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import invokeApi from "LSP/utils/invokeApi";

export default ({ style, className, menuItemClass, onClick, menu }) => {
  const [menuData, setMenu] = useState();
  useEffect(() => {
    (async () => {
      setMenu(await invokeApi({ path: `menus/${menu}` }));
    })();
  }, []);
  return (
    <nav className={className} style={style}>
      {(menuData?.body?.content || []).map(({ slug, id, title, icon }) => (
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
};
