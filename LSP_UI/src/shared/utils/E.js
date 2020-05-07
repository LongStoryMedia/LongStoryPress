import React, { PureComponent } from "react";
import { renderMarkup } from "./helpers";

export default class E extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: "",
      info: "",
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    this.setState({
      error,
      info,
    });
  }

  render() {
    const { hasError, error } = this.state;
    return hasError ? (
      <div
        style={{
          position: "fixed",
          height: "100vh",
          width: "100vw",
          zIndex: 9999,
          backgroundColor: "#fff",
          overflow: "scroll",
        }}
      >
        {error && (
          <>
            <h1 style={{ color: "#9f110d" }}>
              {renderMarkup({ markup: error.name.replace(/\n/g, "<br/>") })}
            </h1>
            <code
              style={{
                whiteSpace: "pre",
                backgroundColor: "#f8f8f8",
              }}
            >
              {renderMarkup({ markup: error.message.replace(/\n/g, "<br/>") })}
            </code>
            <br />
            <code
              style={{
                whiteSpace: "pre",
                fontSize: "0.75em",
                backgroundColor: "#f8f8f8",
              }}
            >
              {renderMarkup({
                markup: error.stack
                  .replace(/\n/g, "<br/>")
                  .split("<br/>")
                  .slice(1, 2)
                  .join("<br/>"),
              })}
            </code>
            <br />
            <code
              style={{
                whiteSpace: "pre",
                fontSize: "0.5em",
                backgroundColor: "#f8f8f8",
              }}
            >
              {renderMarkup({
                markup: error.stack
                  .replace(/\n/g, "<br/>")
                  .split("<br/>")
                  .slice(2)
                  .join("<br/>"),
              })}
            </code>
          </>
        )}
      </div>
    ) : (
      this.props.children
    );
  }
}
