import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const isomorphic = (WC) => ({ param, useMeta = true, ...props }) => {
  let location = useLocation();
  const [data, setData] = useState(
    __isBrowser__ ? window?.__INITIAL_DATA__ : props.staticContext?.data
  );
  const deref = (obj, arr) => {
    let i = 0;
    while (obj && i < arr?.length) obj = obj[arr[i++]];
    return obj;
  };
  useEffect(() => {
    if(__isBrowser__){
      delete window?.__INITIAL_DATA__
    }
    (async () => {
      setData(
        await props.fetchInitialData({
          slug: deref(props, param),
          query: location.search,
        })
      );
      props.setAppData(data);
    })();
    return () => setData({})
  }, [location]);
  return (
    <WC {...props} data={data} useMeta={useMeta} param={deref(props, param)} />
  );
};
export default isomorphic;
