import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import invokeApi from "LSP/utils/invokeApi";
import { throttle } from "LSP/utils/helpers";
import _$ from "long-story-library";
import Router from "LSP/utils/Router";
import E from "LSP/utils/E";
import Header from "Site/Sections/Header";
import Footer from "Site/Sections/Footer";
import styles from "./app.scss";

class App extends PureComponent {
  constructor(props) {
    super(props);
    const baseState = {
      authenticated: false,
      settings: {
        site: { tagline: "", title: "" },
        contact: {},
        colors: {},
      },
      data: {},
    };
    if (__isBrowser__) {
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
      this.state = {
        ...baseState,
        clientWidth: window.innerWidth,
        clientHeight: window.innerHeight,
        scrollTop: 0,
      };
    } else {
      this.state = baseState;
    }
  }
  async componentDidMount() {
    const settings = await invokeApi({ path: "/settings" });
    this.setState({
      settings: settings?.body,
    });
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleWindowSize);
  }
  handleScroll = (e) => {
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
  getMenu = async ({slug: menu}) => await invokeApi({ path: `menus/${menu}` });
  setAppData = (data) => this.setState({ data });
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
      setAppData: this.setAppData,
      settings,
      authenticated,
      data,
      scrollTop: scrollTop || 0,
      clientWidth: clientWidth || void 0,
      clientHeight: clientHeight || void 0,
    };
    return (
      <HelmetProvider>
        <Helmet>
          <title>{_$(data).OBJ(["head", "title"])}</title>
          <meta
            name="twitter:title"
            content={_$(data).OBJ(["head", "title"])}
          />
        </Helmet>
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
