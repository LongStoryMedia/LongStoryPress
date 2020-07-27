import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

const isomorphic = (WC) => (props) => {
  let location = useLocation();
  let { slug } = useParams();
  const [data, setData] = useState(
    __isBrowser__ ? window?.__INITIAL_DATA__ : props.staticContext?.data
  );
  useEffect(() => {
    if (__isBrowser__) {
      delete window?.__INITIAL_DATA__;
      (async () => {
          setData(
            await props.fetchInitialData({
              slug,
              query: location.search,
            })
          );
      })();
    }
  }, []);
  return <WC {...props} data={data} />;
};
export default isomorphic;
