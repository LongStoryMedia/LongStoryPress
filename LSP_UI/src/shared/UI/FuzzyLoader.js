import React from 'react'

export default ({ loading, infoText, ...props }) => (
  loading
  ? <div style={{width: "100%", height: "100%", position: "absolute", top: "0", left: "0", filter: "blur(50px)", backgroundColor: "rgba(175, 175, 175, 0.5)"}}>
      <h2>{infoText}</h2>
    </div>
  : null
)
