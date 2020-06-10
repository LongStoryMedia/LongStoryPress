import React, { PureComponent } from "react";
import _$ from "long-story-library";

export const deref = (obj, arr) => {
  let i = 0;
  while (obj && i < arr.length) obj = obj[arr[i++]];
  return obj;
};

const isomorphic = (WC, { param, windowData = false }) => {
  return class IsomorphicComponent extends PureComponent {
    constructor(props) {
      super(props);
      let data;
      if (windowData) {
        if (__isBrowser__) {
          data = window.__INITIAL_DATA__;
          delete window.__INITIAL_DATA__;
        } else {
          data = this.props.staticContext.data;
        }
      }
      this.state = {
        data,
        loading: data ? false : true
      };
    }
    componentDidMount() {
      const { data } = this.state;
      this.setState({ loading: true });
      !data ? this.setDataInternal() : this.setState({ loading: false });;
    }
    componentDidUpdate(prevProps) {
      const { location } = this.props;
      if (windowData && location !== prevProps.location) {
        this.setDataInternal();
      }
    }
    componentWillUnmount() {
      this.setState({ data: null });
    }
    setDataInternal = async () => {
      const { fetchInitialData, setData } = this.props;
      const data = await fetchInitialData(deref(this.props, param));
      setData(data);
      try {
        this.setState({ data });
      } catch (e) {
        console.log(e);
        const E = window.confirm("Something went wrong! Click 'ok' to reload.");
        if (E) window.location.reload(true);
      }
      this.setState({ loading: false });
    };
    render() {
      const { loading, data } = this.state;
      const { loader } = this.props;
      return (
        <>
          {loader ? loader : null}
          {data && (
            <WC
              {...this.props}
              data={data}
              loading={loading}
              param={deref(this.props, param)}
            />
          )}
        </>
      );
    }
  };
};
export default isomorphic;