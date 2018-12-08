var L$ = window.L$ || {
  addListener: function addListener(els, evt, cb, iterate, options, useCapture) {
    this.addListener.bind(this);
    iterate = iterate || false;
    function __L$_listener(el) {
      if (!!el.addEventListener) {
        var passiveSupport = false;
        try {
          options = {
            get passive() {
              passiveSupport = true;
            }
          };
        } catch (e) {
          passiveSupport = false;
        }
        window.addEventListener("test", options, options);
        window.removeEventListener("test", options, options);
        if (passiveSupport) {
          return el.addEventListener(
            evt,
            cb,
            { passive: (options && options.passive) || false },
            typeof useCapture !== "undefined" ? useCapture : false
          );
        } else {
          return el.addEventListener(evt, cb, false);
        }
      } else if (el.attachEvent) {
        return el.attachEvent("on" + evt, cb);
      } else {
        return (el.onload = cb);
      }
    }
    if (this.arrayLike(els) && iterate) {
      return Array.from(els).forEach(function(el) {
        __L$_listener(el);
      });
    }
    return __L$_listener(els);
  },
  arrayLike: function isArrayLike(item) {
    this.arrayLike.bind(this);
    return (
      Array.isArray(item) ||
      (!!item &&
        typeof item === "object" &&
        typeof item.length === "number" &&
        (item.length === 0 || (item.length > 0 && item.length - 1 in item)))
    );
  },
  sumAttr: function sumAttr(coll, attr) {
    total = 0;
    for (var i = 0; i < coll.length; i++) {
      total += coll[i][attr];
    }
    return total;
  },
  id: function id(name) {
    this.id.bind(this);
    return document && document.getElementById(name);
  },
  cl: function cl(name) {
    this.cl.bind(this);
    return document && document.getElementsByClassName(name);
  },
  tags: function tags(name) {
    this.tags.bind(this);
    return document && document.getElementsByTagName(name);
  },
  el: function el(name) {
    this.el.bind(this);
    return document && document.createElement(name);
  },
  frag: function frag() {
    this.frag.bind(this);
    return document && document.createDocumentFragment();
  },
  kids: function kids(name, findParentBy) {
    this.kids.bind(this);
    if (typeof name == "object" && !findParentBy) {
      if (this.arrayLike(name)) {
        return name[0].children;
      }
      return name.children;
    }
    findParentBy = findParentBy || "id";
    if (!Object.getOwnPropertyNames(this).includes(findParentBy)) {
      throw new Error(
        "L$.kids() requires 'id', 'cl', or 'tags' as the second argument. " +
          "This indicates how the browser should find the element - " +
          "by id, className, or tagName respectively. " +
          "Note that for 'cl' and 'tags', the browser will return only the first match"
      );
    }
    return this.arrayLike(this[findParentBy](name))
      ? this[findParentBy](name)[0].children
      : this[findParentBy](name).children;
  }
};
