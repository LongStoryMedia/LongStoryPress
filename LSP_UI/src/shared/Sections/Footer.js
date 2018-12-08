import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import ContactUs from "../UI/ContactUs";
// import LoaderButton from '../UI/LoaderButton'
import Menu from "../Menu";
import Search from "../UI/Search";
import styles from "./footer.scss";

export default class Footer extends PureComponent {
  state = { visible: false };
  expandSearchBox = () =>
    this.setState({ visible: this.state.visible ? false : true });

  render() {
    const { visible } = this.state;
    const { settings, getMenu } = this.props;
    const { colors } = settings;
    const s = {
      bgOne: { backgroundColor: colors.background_one },
      bgTwo: { backgroundColor: colors.background_two },
      bgPrime: { backgroundColor: colors.primary_color },
      colorPrime: { color: colors.primary_color }
    };
    return (
      <footer className={styles.Footer} style={s.bgPrime}>
        <div
          className={styles.upperFooter}
          style={{ ...s.bgTwo, ...s.colorPrime }}
        >
          <Menu
            menu="social"
            fetchInitialData={getMenu}
            icon={true}
            {...this.props}
          />
          <Search
            {...this.props}
            searchBox={styles.searchBox}
            expandSearchBox={this.expandSearchBox}
            visible={visible}
            searchInput={styles.searchInput}
            eyeglass={styles.searchIcon}
            loaderButton={styles.loaderButton}
            loaderImg={styles.loaderImg}
            loadingText="searching..."
            text="search"
          />
        </div>
        <div className={styles.lowerFooter} style={s.bgPrime}>
          <ContactUs
            contactBoxStyles={styles.contactBoxStyles}
            contactHeaderStyles={styles.contactHeaderStyles}
            addressStyles={styles.addressStyles}
            phoneStyles={styles.phoneStyles}
            contactUsLinkStyles={styles.contactUsLinkStyles}
            contactLinkBox={styles.contactLinkBox}
            {...this.props}
          />
          <span className={styles.copyright}>
            &copy; <Link to="/">{settings.site.title}</Link>{" "}
            {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    );
  }
}
// <LoaderButton className={styles.loginBtn} text={props.authenticated ? "logout" : "login"} onClick={props.handleAuthClick} loadingText="welcome!" />
