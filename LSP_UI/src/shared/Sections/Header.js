import React, { PureComponent, Fragment } from "react";
import { Link } from "react-router-dom";
import SVGInline from "react-svg-inline";
import styles from "./header.scss";
import Menu from "../Menu";
// import Logo from process.env.LOGO;

export default class Header extends PureComponent {
  state = {
    mainMenuVisible: false
  };
  componentDidUpdate(prevProps) {
    const { history } = this.props;
    history !== prevProps.history && this.scale();
  }
  componentDidMount() {
    this.scale();
  }
  toggleMenu = () =>
    this.setState({
      mainMenuVisible: this.state.mainMenuVisible ? false : true
    });
  scale = () => {
    const { location, scrollTop, vpu } = this.props;
    this.setState({
      heightToScale:
        "/" === location.pathname ? `calc(30vmax - ${scrollTop}px)` : "3.6em"
    });
  };
  render() {
    const { mainMenuVisible, heightToScale } = this.state;
    const { location, settings, getMenu, vpu, scrollTop } = this.props;
    const { colors } = settings;
    const s = {
      bgOne: { backgroundColor: colors.background_one },
      bgPrime: { backgroundColor: colors.primary_color },
      colorContrast: { color: settings.colors.contrast_text_color }
    };
    const hamburger = mainMenuVisible
      ? [styles.hamburger, styles.bite].join(" ")
      : styles.hamburger;
    const squish =
      "/" === location.pathname && scrollTop < vpu(30, "vmax")
        ? `calc(30vmax - ${scrollTop}px)`
        : "";
    return (
      <Fragment>
        <header
          style={{ ...s.bgPrime, height: squish }}
          className={styles.Header}
        >
          <div className={hamburger} onClick={this.toggleMenu}>
            <span style={s.bgOne} />
            <span style={s.bgOne} />
            <span style={s.bgOne} />
          </div>
          <Link to="/" className={styles.homeLink}>
            {settings.site.title && (
              <h1 className={styles.appTitle} style={s.colorContrast}>
                {settings.site.title}
              </h1>
            )}
          </Link>
          <Menu
            {...this.props}
            menu="main-menu"
            toggleMenu={this.toggleMenu}
            fetchInitialData={getMenu}
            visible={mainMenuVisible}
          />
        </header>
        <Menu menu="primary" fetchInitialData={getMenu} {...this.props} />
        <div
          style={{
            height: "/" === location.pathname && `30vmax`,
            width: "100%"
          }}
        />
      </Fragment>
    );
  }
}

// {props.commentOut && <ShopAccountMenu {...this.props} menuItem={styles.menuItem} menuIcon={styles.menuIcon} shopaccountmenu={styles.shopaccountmenu}/>}
// \
