import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

const useApi = ({staticContext, fetchInitialData, restArgs = {}}) => {
    let location = useLocation();
    let { slug } = useParams();
    const [data, setData] = useState(
      __isBrowser__ ? window?.__INITIAL_DATA__ : staticContext?.data
    );
    useEffect(() => {
      if (__isBrowser__) {
        delete window?.__INITIAL_DATA__;
        (async () => {
            setData(
              await fetchInitialData({
                slug,
                restArgs,
                query: location.search,
              })
            );
        })();
      }
    }, []);
    return data;
}

export default useApi;
