import React, { PureComponent } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'
import LoaderButton from './LoaderButton'

export default class Search extends PureComponent {
  state = { query: "" }
  handleSearch = () => {
    const { query } = this.state
    this.props.history.push(`/search/?q=${query.replace(/\s/g, ",")}`)
  }
  handleChange = e => this.setState({ query: e.currentTarget.value })
  render() {
    const {
      visible,
      searchInput,
      expandSearchBox,
      searchBox,
      eyeglass,
      loaderButton,
      text,
      loadingText,
      runningSearch
    } = this.props
    let w = visible ? "auto" : 0
    let o = visible ? 1 : 0
    return (
      <div className={searchBox}>
        <FontAwesomeIcon icon={faSearch} onClick={expandSearchBox} className={eyeglass}/>
        <input type="text" onChange={this.handleChange} className={searchInput} style={{ width: w, opacity: o }} />
        <LoaderButton onClick={this.handleSearch} isLoading={runningSearch} className={loaderButton} text={text} loadingText={loadingText} style={{ width: w, opacity: o }} />
      </div>
    )
  }
}
