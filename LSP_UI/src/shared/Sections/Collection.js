import React from "react";
import _$ from "long-story-library";
import isomorphic from "../utils/isomorphic";

export default (
  WC,
  { param = ["match", "params", 0], windowData = true }
) => {
  return isomorphic(
    ({ data, className, header, ...props }) => {
      return (
          <div className={className}>
            {header ? <h2>{header}</h2> : ""}
            {_$(data).OBJ(["body"]).map(({ id, ...rest }, i) => (
              <WC
                key={id}
                id={id}
                data={data}
                className={className}
                header={header}
                {...props}
                {...rest}
                i={i}
              />
            ))}
          </div>
      );
    },
    { param, windowData }
  );
};
