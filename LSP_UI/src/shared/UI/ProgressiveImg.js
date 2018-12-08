import React, { PureComponent } from "react";
import styles from "./progressiveimg.css";

export default class extends PureComponent {
  state = {
    src: this.props.placeHolder || "",
    currentClass: styles.placeholder
  };
  static getDerivedStateFromProps(props, state) {
    const { src } = props;
    if (src !== state.src) return () => this.loadImage(src);
    return null;
  }
  componentDidMount() {
    const { src } = this.props;
    this.loadImage(src);
  }
  componentWillUnmount() {
    if (this.image) {
      this.image.onload = null;
      this.image.onerror = null;
    }
  }
  onLoad = () =>
    this.setState({ src: this.props.src, currentClass: styles.loadedImg });
  onError = e => this.props.onError && this.props.onError(e);
  loadImage = src => {
    if (this.image) {
      this.image.onload = null;
      this.image.onerror = null;
    }
    const image = new Image();
    this.image = image;
    image.onload = this.onLoad;
    image.onerror = this.onError;
    image.src = src;
  };
  render() {
    const { style, className, height, contain, repeat, position } = this.props;
    const { src, currentClass } = this.state;
    return (
      <div
        style={{
          ...style,
          backgroundColor: "transparent",
          backgroundImage: `url("${src}")`,
          backgroundPosition: !position ? "center" : position,
          backgroundOrigin: "initial",
          backgroundClip: "initial",
          backgroundAttachment: "initial",
          backgroundSize: !contain ? "cover" : "contain",
          backgroundRepeat: !repeat ? "no-repeat" : "repeat",
          height: height || (style && style.height) || "200px"
        }}
        className={[className, styles.progressiveImg, currentClass].join(" ")}
      />
    );
  }
}
