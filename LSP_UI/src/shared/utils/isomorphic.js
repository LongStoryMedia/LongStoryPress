import React, { PureComponent, Fragment } from "react";
import DotLoader from "../UI/DotLoader";

export const deref = (obj, arr) => {
  let i = 0;
  while (obj && i < arr.length) obj = obj[arr[i++]];
  return obj;
};

export default (WC, { param, wpPostType, apiPostType, windowData = false }) =>
  class extends PureComponent {
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
        mounted: false,
        loading: data ? false : true
      };
    }
    componentDidMount() {
      if (!this.state.data) this.setData();
    }
    componentDidUpdate(prevProps) {
      if (
        deref(this.props, param) !== deref(prevProps, param) &&
        this.state.mounted
      )
        this.setData();
    }
    setData = () => {
      this.setState(() => ({ loading: true }));
      this.props.fetchInitialData(deref(this.props, param)).then(data => {
        this.setState(() => ({ data, loading: false }));
      });
    };
    render() {
      const { loading, data } = this.state;
      const { loader } = this.props;
      return (
        <Fragment>
          {loader ? loader : <DotLoader loading={loading} />}
          {data && (
            <WC
              {...this.props}
              data={data}
              setData={this.setData}
              loading={loading}
              param={deref(this.props, param)}
              wpPostType={wpPostType}
              apiPostType={apiPostType}
            />
          )}
        </Fragment>
      );
    }
  };
