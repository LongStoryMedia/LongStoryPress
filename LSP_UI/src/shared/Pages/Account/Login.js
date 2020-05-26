import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import invokeApi from "LSP/utils/invokeApi";
import { Email, Password } from "LSP/Components/FormFields";
import LoaderButton from "LSP/Components/LoaderButton";
import styles from "./account.scss";

export default class Login extends PureComponent {
  state = {
    email: "",
    password: ""
  };

  handleInput = e =>
    this.setState({
      [e.currentTarget.id]: e.currentTarget.value
    });

  handleSubmit = async e => {
    e.preventDefault();
    const { email, password } = this.state;
    const { search } = this.props.location;
    try {
      await invokeApi({
        path: "login",
        method: "POST",
        body: {
          username: email,
          password
        },
        options: {
          mode: "same-origin",
          redirect: "follow",
          credentials: "include"
        },
        noReturn: true
      });
    } catch (e) {
      throw e;
    }
    if(search.match(/\?redirect=/)){
      this.props.history.push(search.slice(search.indexOf("=") + 1));
    }
  };

  render() {
    return (
      <>
        <form onSubmit={this.handleSubmit} className={styles.account}>
          <div className={styles.contentBox}>
            <Email
              id="email"
              value={this.state.email}
              handleChange={this.handleInput}
            />
            <Password
              id="password"
              value={this.state.password}
              handleChange={this.handleInput}
            />
            <span className={styles.reset}>
              <Link className={styles.pwreset} to="/my-account/password-reset">
                Forgot your password?
              </Link>
            </span>
          </div>
          <div className={styles.btnRow}>
            <LoaderButton
              type="submit"
              className={styles.rowBtn}
              isLoading={this.state.isLoading}
              text="Log In"
              loadingText="Welcome!"
            />
            <Link className={styles.rowBtnRight} to="/my-account/sign-up">
              Sign Up
            </Link>
          </div>
        </form>
      </>
    );
  }
}
