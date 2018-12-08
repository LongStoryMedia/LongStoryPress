import React, { PureComponent, Fragment } from "react";
import { withRouter } from "react-router-dom";
import Helmet from "react-helmet";
import { invokeApi } from "./utils/api";
import styles from "./app.scss";
import Router from "./utils/Router";
import Header from "./Sections/Header";
import Footer from "./Sections/Footer";

class App extends PureComponent {
  state = {
    authenticated: false,
    settings: {
      site: { tagline: "", title: "" },
      contact: {},
      colors: {}
    }
  };
  async componentDidMount() {
    const settings = await invokeApi({ path: "/settings" });
    this.setState({
      settings,
      clientWidth: window.innerWidth || 0,
      clientHeight: window.innerHeight || 0,
      scrollTop: 0
    });
    if (__isBrowser__) {
      window.addEventListener("scroll", this.handleScroll);
      window.addEventListener("load", this.handleWindowSize);
      window.addEventListener("resize", this.handleWindowSize);
    }
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleWindowSize);
  }
  handleScroll = e =>
    this.setState({
      scrollTop: e.currentTarget.scrollY || 0
    });
  handleWindowSize = e =>
    this.setState({
      clientWidth: e.currentTarget.innerWidth || 0,
      clientHeight: e.currentTarget.innerHeight || 0
    });
  getMenu = async menu => await invokeApi({ path: `menus/${menu}` });
  vpu = (num, type) => {
    const { clientWidth, clientHeight } = this.state,
      vw = clientWidth / 100,
      vh = clientHeight / 100,
      vmax = vw > vh ? vw : vh,
      vmin = vw < vh ? vw : vh;
    switch (type) {
      case "vw":
        return vw * num;
      case "vh":
        return vh * num;
      case "vmax":
        return vmax * num;
      case "vmin":
        return vmin * num;
      default:
        return vw * num;
    }
  };
  render() {
    const {
      authenticated,
      settings,
      scrollTop,
      clientWidth,
      clientHeight
    } = this.state;
    const childProps = {
      ...this.props,
      getMenu: this.getMenu,
      vpu: this.vpu,
      settings,
      authenticated,
      scrollTop,
      clientWidth,
      clientHeight
    };
    return (
      <Fragment>
        <Helmet>
          {settings.colors && (
            <style>
              {`
            body {
              background-color: ${settings.colors.backdrop}
            }
            a {
              color: ${settings.colors.link_text_color};
              visibility: visible;
            }
            a:hover {
              color: ${settings.colors.accent_color}
            }
            a::before, [class*='hamburger']:hover span {
              background-color: ${settings.colors.accent_color}
            }
            [class*='hamburger'] span {
              background-color: ${settings.colors.secondary_color}
            }
          `}
            </style>
          )}
        </Helmet>
        <div id={styles.container}>
          <Header {...childProps} />
          <div className={styles.Wrapper}>
            <Router {...this.props} childProps={childProps} />
          </div>
          <Footer {...childProps} />
        </div>
      </Fragment>
    );
  }
}

export default withRouter(App);
