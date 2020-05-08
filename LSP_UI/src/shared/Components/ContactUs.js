import React from "react";

export default ({
  contactBoxClass,
  contactUsLinkClass,
  contactLinkBox,
  phoneClass,
  addressClass,
  contactHeaderClass,
  settings,
  ...props
}) => {
  const { contact } = settings;
  return (
    <div className={contactBoxClass}>
      <div className={contactHeaderClass}>{contact.contact_title}</div>
      {(contact.street ||
        contact.city ||
        contact.state_province ||
        contact.postal_code) && (
        <div className={addressClass}>
          {contact.street}
          <br />
          {contact.city}, {contact.state_province} {contact.postal_code}
        </div>
      )}
      {contact.phone && (
        <div className={[phoneClass, contactLinkBox].join(" ")}>
          Call us at{" "}
          <a href={`tel:${contact.phone}`} className={contactUsLinkClass}>
            {contact.phone}
          </a>
        </div>
      )}
      <div className={contactLinkBox}>
        <a href={`mailto:${contact.email}`} className={contactUsLinkClass}>
          Email
        </a>
      </div>
    </div>
  );
};
