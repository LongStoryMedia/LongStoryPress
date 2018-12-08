import React from "react"

export default ({
  contactBoxStyles,
  contactUsLinkStyles,
  contactLinkBox,
  phoneStyles,
  addressStyles,
  contactHeaderStyles,
  settings,
  ...props
}) => {
  const { contact } = settings
  return (
    <div className={contactBoxStyles}>
      <div className={contactHeaderStyles}>{contact.contact_title}</div>
      <div className={addressStyles}>
        {contact.street}<br/>
        {contact.city}, {contact.state_province} {contact.postal_code}
      </div>
      <div className={[phoneStyles, contactLinkBox].join(' ')}>
        Call us at <a href={`tel:${contact.phone}`} className={contactUsLinkStyles}>{contact.phone}</a>
      </div>
      <div className={contactLinkBox}>
        <a href={`mailto:${contact.email}`} className={contactUsLinkStyles}>Email</a>
      </div>
    </div>
  )
}
