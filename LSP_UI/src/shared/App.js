import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { invokeApi } from "LSP/utils/api";
import { throttle } from "LSP/utils/helpers";
import _$ from "long-story-library";
import styles from "./app.scss";
import Router from "LSP/utils/Router";
import E from "LSP/utils/E";
import Header from "Site/Sections/Header";
import Footer from "Site/Sections/Footer";

class App extends PureComponent {
  state = {
    authenticated: false,
    settings: {
      site: { tagline: "", title: "" },
      contact: {},
      colors: {},
    },
    data: {},
  };
  async componentDidMount() {
    if (__isBrowser__) {
      this.setState({
        clientWidth: window.innerWidth,
        clientHeight: window.innerHeight,
        scrollTop: 0,
      });
      
      ((_$) => {
        _$.addListener(
          window,
          "scroll",
          this.handleScroll,
          false,
          { passive: true, capture: true },
          true
        );
        _$.addListener(
          window,
          ["load", "resize"],
          this.handleWindowSize,
          false,
          { passive: true, capture: true, once: true },
          true
        );
      })(new _$());
    }
    const settings = await invokeApi({ path: "/settings" });
    this.setState({
      settings: settings.body,
    });
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleWindowSize);
  }
  handleScroll = e => {
    throttle(
      this.setState({
        scrollTop: e.currentTarget.scrollY,
      }),
      250
    );
  };
  handleWindowSize = (e) =>
    throttle(
      this.setState({
        clientWidth: e.currentTarget.innerWidth,
        clientHeight: e.currentTarget.innerHeight,
      }),
      250
    );
  getMenu = async (menu) => await invokeApi({ path: `menus/${menu}` });
  setData = (data) => this.setState({ data });
  render() {
    const {
      authenticated,
      settings,
      scrollTop,
      clientWidth,
      clientHeight,
      data,
    } = this.state;
    const childProps = {
      ...this.props,
      getMenu: this.getMenu,
      setData: this.setData,
      settings,
      authenticated,
      data,
      scrollTop: scrollTop || 0,
      clientWidth: clientWidth || void 0,
      clientHeight: clientHeight || void 0,
    };
    return (
      <HelmetProvider>
        <E>
          <div id={styles.container}>
            <Header {...childProps} />
            <div className={styles.Wrapper}>
              <Router {...this.props} childProps={childProps} />
            </div>
            <Footer {...childProps} />
          </div>
        </E>
      </HelmetProvider>
    );
  }
}
export default withRouter(App);
