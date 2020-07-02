import React from "react";
import isomorphic from "../utils/isomorphic";

export default (WC) => {
  return isomorphic(({ data, className, header, ...props }) => (
    <div className={className}>
      {header ? <h2>{header}</h2> : ""}
      {data?.body?.map(({ id, ...rest }, i) => (
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
  ));
};
