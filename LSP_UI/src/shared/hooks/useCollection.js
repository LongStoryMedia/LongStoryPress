import React from "react";
import useApi from "./useApi";

const useCollection = (WC) => {
  const data = useApi({ staticContext, fetchInitialData });
  return data?.body?.map(({ id, ...rest }, i) => (
    <WC
      key={id}
      id={id}
      data={data}
      className={className}
      header={header}
      {...rest}
      i={i}
    />
  ));
};
export default useCollection;