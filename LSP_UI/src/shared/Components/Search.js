import React, { PureComponent, createRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import LoaderButton from "./LoaderButton";

export default class Search extends PureComponent {
  constructor(props) {
    super(props);
    this.searchQuery = createRef();
    this.state = { query: "", visible: false };
  }
  componentDidMount() {
    this.setState({
      query: this.searchQuery.current ? this.searchQuery.current.value : ""
    });
  }
  expandSearchBox = () =>
    this.setState({ visible: this.state.visible ? false : true });
  handleSearch = () => {
    const { query } = this.state;
    this.props.history.push(`/search?search=${query.replace(/\s/g, ",")}`);
  };
  handleChange = e => this.setState({ query: e.currentTarget.value });
  render() {
    const {
      inputClass,
      className,
      iconClass,
      btnClass,
      text,
      loadingText,
      isLoading,
      inputStyle,
      btnStyle
    } = this.props;
    const { visible } = this.state;
    let w = visible ? "auto" : 0;
    let o = visible ? 1 : 0;
    return (
      <div className={className}>
        <FontAwesomeIcon
          icon={faSearch}
          onClick={this.expandSearchBox}
          className={iconClass}
          style={{
            maxHeight:"20px",
            maxWidth:"20px"
          }}
        />
        <input
          ref={this.searchQuery}
          type="text"
          onChange={this.handleChange}
          className={inputClass}
          style={{ ...inputStyle, width: w, opacity: o }}
        />
        <LoaderButton
          onClick={this.handleSearch}
          onKeyDown={this.handleSearch}
          isLoading={isLoading}
          className={btnClass}
          text={text}
          loadingText={loadingText}
          style={{ ...btnStyle, width: w, opacity: o }}
        />
      </div>
    );
  }
}
