const globalFn = async () => {
  try {
    if (window.fetch) {
      const getSettings = await fetch(LSP.api.settings, {
        method: "GET",
        headers: new Headers({ "X-WP-Nonce": LSP.api.nonce })
      });
      const settings = await getSettings.json();
      const style = document.createElement("style");
      const colorize = (color, type) => {
        if (type === "text") return `color: ${color};`;
        else if (type === "background") return `background-color: ${color};`;
        else if (type === "shadow") return `box-shadow: 0 0 2px ${color};`;
        else if (type === "border") return `border-color: ${color};`;
        else return `color: ${color}; background-color: ${color};`;
      };
      const {
        primary_color,
        secondary_color,
        accent_color,
        background_one,
        background_two,
        text_color,
        header_text_color,
        link_text_color
      } = settings.colors;

      style.innerText = `#adminmenu, #adminmenu .wp-submenu, #adminmenuback, #adminmenuwrap, #wpadminbar {
        ${colorize(primary_color, "background")}
      }
      a, #adminmenu li.menu-top:hover, #adminmenu li.opensub>a.menu-top, #adminmenu li>a.menu-top:focus, #wpadminbar:not(.mobile) .ab-top-menu > li:hover > .ab-item, #wpadminbar:not(.mobile) > #wp-toolbar li:hover span.ab-label, #adminmenu a:hover, .components-button.is-link, #adminmenu .wp-submenu a:hover, #adminmenu a:hover {
        ${colorize(link_text_color, "text")}
      }
      #wpadminbar .ab-top-menu > li.hover > .ab-item, #wpadminbar.nojq .quicklinks .ab-top-menu > li > .ab-item:focus, #wpadminbar:not(.mobile) .ab-top-menu > li:hover > .ab-item, #wpadminbar:not(.mobile) .ab-top-menu > li > .ab-item:focus, #adminmenu div.wp-menu-image::before, #wpadminbar #adminbarsearch::before, #wpadminbar .ab-icon::before, #wpadminbar .ab-item::before, #adminmenu .wp-submenu a:focus, #adminmenu li.menu-top > a:focus {
        ${colorize(secondary_color, "text")}
      }
      #wpadminbar .ab-top-menu > li.hover > .ab-item, #wpadminbar:not(.mobile) .ab-top-menu > li:hover > .ab-item, #wpadminbar:not(.mobile) .ab-top-menu > li > .ab-item:focus, #adminmenu div.wp-menu-image::before:hover, #wpadminbar #adminbarsearch::before:hover, #wpadminbar .ab-icon::before:hover, #wpadminbar .ab-item::before:hover, a:active, a:hover, #adminmenu .wp-submenu a:focus, #adminmenu .wp-submenu a:hover, #adminmenu a:hover, #adminmenu li.menu-top > a:focus, .components-button.is-link:active, .components-button.is-link:hover {
        ${colorize(accent_color, "text")}
      }
      a:active, a:hover, #adminmenu li a:focus div.wp-menu-image:before, #adminmenu li.opensub div.wp-menu-image:before, #adminmenu li:hover div.wp-menu-image:before, #wpadminbar .quicklinks .ab-sub-wrapper .menupop.hover>a, #wpadminbar .quicklinks .menupop ul li a:focus, #wpadminbar .quicklinks .menupop ul li a:focus strong, #wpadminbar .quicklinks .menupop ul li a:hover, #wpadminbar .quicklinks .menupop ul li a:hover strong, #wpadminbar .quicklinks .menupop.hover ul li a:focus, #wpadminbar .quicklinks .menupop.hover ul li a:hover, #wpadminbar .quicklinks .menupop.hover ul li div[tabindex]:focus, #wpadminbar .quicklinks .menupop.hover ul li div[tabindex]:hover, #wpadminbar li #adminbarsearch.adminbar-focused:before, #wpadminbar li .ab-item:focus .ab-icon:before, #wpadminbar li .ab-item:focus:before, #wpadminbar li a:focus .ab-icon:before, #wpadminbar li.hover .ab-icon:before, #wpadminbar li.hover .ab-item:before, #wpadminbar li:hover #adminbarsearch:before, #wpadminbar li:hover .ab-icon:before, #wpadminbar li:hover .ab-item:before, #wpadminbar.nojs .quicklinks .menupop:hover ul li a:focus, #wpadminbar.nojs .quicklinks .menupop:hover ul li a:hover, #collapse-button:focus, #collapse-button:hover {
        ${colorize(accent_color, "text")}
      }
      h1, h2, h3 {
        ${colorize(header_text_color, "text")}
      }
      body, .components-panel__header {
        ${colorize(background_one, "background")}
        ${colorize(text_color, "text")}
      }
      .components-panel__header {
        ${colorize(background_one, "border")}
      }
      .edit-post-sidebar__panel-tab.is-active, .components-button.is-primary:focus:not(:disabled):not([aria-disabled="true"]), .components-button.is-primary:hover {
        ${colorize(secondary_color, "border")}
      }
      .alternate, .striped>tbody>:nth-child(odd), ul.striped>:nth-child(odd), #lsp-form>section, .edit-post-sidebar, .try-gutenberg-panel, .welcome-panel, .postbox {
        ${colorize(background_two, "background")}
      }
      .wrap .page-title-action:focus {
        ${colorize(secondary_color, "text")}
        ${colorize(background_two, "background")}
        ${colorize(secondary_color, "shadow")}
      }
      .split-page-title-action a, .split-page-title-action a:active, .split-page-title-action .expander:after, .wrap .add-new-h2, .wrap .add-new-h2:active, .wrap .page-title-action, .wrap .page-title-action:active {
        ${colorize(secondary_color, "text")}
        ${colorize(background_two, "background")}
      }
      .split-page-title-action a:hover, .split-page-title-action .expander:hover:after, .components-button.is-primary:focus:not(:disabled):not([aria-disabled="true"]), .components-button.is-primary:hover, .wp-core-ui .button-primary:hover  {
        ${colorize(secondary_color, "background")}
        ${colorize(background_two, "text")}
      }
      .components-button.is-primary:hover, .wp-core-ui .button-primary:hover  {
        ${colorize(primary_color, "border")}
        ${colorize(accent_color, "background")}
      }
      .split-page-title-action a:focus, .split-page-title-action .expander:focus:after {
        ${colorize(secondary_color, "border")}
        ${colorize(secondary_color, "shadow")}
        ${colorize(background_two, "text")}
      }
      #adminmenu .wp-has-current-submenu .wp-submenu .wp-submenu-head, #adminmenu .wp-menu-arrow, #adminmenu .wp-menu-arrow div, #adminmenu li.current a.menu-top, #adminmenu li.wp-has-current-submenu a.wp-has-current-submenu, .folded #adminmenu li.current.menu-top, .folded #adminmenu li.wp-has-current-submenu {
        ${colorize(background_one, "text")}
      }
      .components-button.is-primary, .wp-core-ui .button-primary {
        ${colorize(secondary_color, "border")}
        ${colorize(secondary_color, "background")}
        ${colorize(background_one, "text")}
      }`;
      document.head.appendChild(style);
    }
    if (!Array.prototype.includes) {
      Object.defineProperty(Array.prototype, "includes", {
        value: function(searchElement, fromIndex) {
          if (this == null) {
            throw new TypeError('"this" is null or not defined');
          }
          var o = Object(this);
          var len = o.length >>> 0;
          if (len === 0) {
            return false;
          }
          var n = fromIndex | 0;
          var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
          function sameValueZero(x, y) {
            return (
              x === y ||
              (typeof x === "number" &&
                typeof y === "number" &&
                isNaN(x) &&
                isNaN(y))
            );
          }
          while (k < len) {
            if (sameValueZero(o[k], searchElement)) {
              return true;
            }
            k++;
          }
          return false;
        }
      });
    }
  } catch (e) {
    throw new Error(e);
  }
};
if (typeof module !== "undefined") module.exports = globalFn;
globalFn();
