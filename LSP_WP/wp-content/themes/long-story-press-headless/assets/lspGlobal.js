const polyfill = async () => {
  try {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
    Number.isInteger =
      Number.isInteger ||
      function(value) {
        return (
          typeof value === "number" &&
          isFinite(value) &&
          Math.floor(value) === value
        );
      };
    // https://tc39.github.io/ecma262/#sec-array.prototype.includes
    if (!Array.prototype.includes) {
      Object.defineProperty(Array.prototype, "includes", {
        value: function(valueToFind, fromIndex) {
          if (this == null) {
            throw new TypeError('"this" is null or not defined');
          }
          // 1. Let O be ? ToObject(this value).
          var o = Object(this);
          // 2. Let len be ? ToLength(? Get(O, "length")).
          var len = o.length >>> 0;
          // 3. If len is 0, return false.
          if (len === 0) {
            return false;
          }
          // 4. Let n be ? ToInteger(fromIndex).
          //    (If fromIndex is undefined, this step produces the value 0.)
          var n = fromIndex | 0;
          // 5. If n ≥ 0, then
          //  a. Let k be n.
          // 6. Else n < 0,
          //  a. Let k be len + n.
          //  b. If k < 0, let k be 0.
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
          // 7. Repeat, while k < len
          while (k < len) {
            // a. Let elementK be the result of ? Get(O, ! ToString(k)).
            // b. If SameValueZero(valueToFind, elementK) is true, return true.
            if (sameValueZero(o[k], valueToFind)) {
              return true;
            }
            // c. Increase k by 1.
            k++;
          }
          // 8. Return false
          return false;
        }
      });
    }
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat
    if (!String.prototype.repeat) {
      String.prototype.repeat = function(count) {
        "use strict";
        if (this == null) {
          // check if `this` is null or undefined
          throw new TypeError("can't convert " + this + " to object");
        }
        var str = "" + this;
        // To convert string to integer.
        count = +count;
        if (count < 0) {
          throw new RangeError("repeat count must be non-negative");
        }
        if (count == Infinity) {
          throw new RangeError("repeat count must be less than infinity");
        }
        count |= 0; // floors and rounds-down it.
        if (str.length == 0 || count == 0) {
          return "";
        }
        // Ensuring count is a 31-bit integer allows us to heavily optimize the
        // main part. But anyway, most current (August 2014) browsers can't handle
        // strings 1 << 28 chars or longer, so:
        if (str.length * count >= 1 << 28) {
          throw new RangeError(
            "repeat count must not overflow maximum string size"
          );
        }
        while ((count >>= 1)) {
          // shift it by multiple of 2 because this is binary summation of series
          str += str; // binary summation
        }
        str += str.substring(0, str.length * count - str.length);
        return str;
      };
    }
  } catch (e) {
    throw new Error(e);
  }
};
if (typeof module !== "undefined") module.exports = polyfill;
polyfill();
