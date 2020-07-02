import React, { PureComponent, useEffect, useState } from "react";
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

const App = (props) => {
  const [authenticated, setAuthenticated] = useState();

  const [settings, setSettings] = useState({
    site: { tagline: "", title: "" },
    contact: {},
    colors: {},
  })

  const [appWindow, setAppWindow] = useState({
    height: 0,
    width: 0,
    scroll: 0,
  })
  
  const handleScroll = (e) => {
    throttle(
      setAppWindow({
        ...appWindow,
        scrollTop: e.currentTarget.scrollY,
      }),
      250
    );
  };

  const handleWindowSize = (e) =>
    throttle(
      setAppWindow({
        ...appWindow,
        clientWidth: e.currentTarget.innerWidth,
        clientHeight: e.currentTarget.innerHeight,
      }),
      250
    );

  const getMenu = async ({ slug: menu }) =>
      await invokeApi({ path: `menus/${menu}` });

  useEffect(() => {
    if (__isBrowser__) {
      ((_$) => {
        _$.addListener(
          window,
          ["load", "scroll"],
          handleScroll,
          false,
          { passive: true, capture: true },
          true
        );
        _$.addListener(
          window,
          ["load", "resize"],
          handleWindowSize,
          false,
          { passive: true, capture: true, once: true },
          true
        );
      })(new _$());

      setAppWindow({
        height: window.innerHeight,
        width: window.innterWidth,
        scroll: 0
      })
    }

    (async () => {
      const _settings = await invokeApi({ path: "settings" });
      setSettings(_settings?.body);
    })();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleWindowSize);
    }
  }, [])

  const childProps = {
    ...props,
    getMenu,
    settings,
    authenticated,
    scrollTop: appWindow?.scroll,
    clientWidth: appWindow?.width,
    clientHeight: appWindow?.height,
  };
  
  return (
    <HelmetProvider>
      <E>
        <div id={styles.container}>
          <Header {...childProps} />
          <div className={styles.Wrapper}>
            <Router childProps={childProps} />
          </div>
          <Footer {...childProps} />
        </div>
      </E>
    </HelmetProvider>
  );
}
export default withRouter(App);
