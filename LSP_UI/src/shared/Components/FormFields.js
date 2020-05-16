import React from "react";
import styles from "./formfields.scss";

const TextQuestion = (props) => (
  <div className={styles.question}>
    <label className={styles.inputLabel}>{props.label}</label>
    <input
      className={styles.textInput}
      type={props.type}
      id={props.id}
      name={props.name}
      autoComplete={props.autoComplete}
      title={props.title}
      value={props.value}
      onChange={props.handleChange}
    />
  </div>
);

const LongerTextQuestion = (props) => (
  <div className={styles.question}>
    <label className={styles.textAreaLabel}>{props.label}</label>
    <textarea
      className={styles.textArea}
      type={props.type}
      id={props.id}
      name={props.name}
      autoComplete={props.autoComplete}
      title={props.title}
      value={props.value}
      onChange={props.handleChange}
      rows={props.rows}
    />
  </div>
);

const RadioQuestion = (props) => (
  <div className={styles.question}>
    <label className={styles.spanTwo}>{props.label}</label>
    <div className={styles.radioCheck}>
      {props.selections.map((selection, i) => (
        <React.Fragment key={[selection, props.id].join(",")}>
          <input
            type="radio"
            value={selection}
            key={[selection, [props.name, props.id].join(".")].join("")}
            id={[selection, [props.name, props.id].join(".")].join("")}
            name={props.name}
            title={props.title}
            onClick={props.handleChange}
          />
          <label
            htmlFor={[selection, [props.name, props.id].join(".")].join("")}
            key={[selection, props.name, props.id].join("-")}
            className={styles.radio}
          />
          <span key={[props.name, props.id].join(".")}>{selection}</span>
        </React.Fragment>
      ))}
    </div>
  </div>
);

const CheckBox = (props) => (
  <div className={styles.question}>
    <input
      type="checkbox"
      id={props.id}
      name={props.name}
      autoComplete="off"
      title={props.title}
      value={props.value}
      onChange={props.handleCheck}
    />
    <label htmlFor={props.id} className={styles.checkBox} />
    <label className={styles.checkBoxLabel}>{props.label}</label>
  </div>
);

const Text = (props) => <TextQuestion {...props} type="text" />;

const PaymentMethod = (props) => (
  <RadioQuestion {...props} type="radio" name="paymentMethod" />
);

const FirstName = (props) => (
  <TextQuestion
    {...props}
    autoComplete="given-name"
    label="first name:"
    type="text"
    value={props.firstName}
  />
);

const LastName = (props) => (
  <TextQuestion
    {...props}
    autoComplete="family-name"
    label="last name:"
    type="text"
    value={props.lastName}
  />
);

const Email = (props) => (
  <TextQuestion
    {...props}
    autoComplete="email"
    label="email:"
    type="email"
    value={props.email}
  />
);

const Phone = (props) => (
  <TextQuestion
    {...props}
    autoComplete="tel-national"
    label="phone:"
    type="text"
    value={props.phone}
  />
);
const Occupation = (props) => (
  <TextQuestion
    {...props}
    autoComplete="organization-title"
    label="occupation:"
    type="text"
    value={props.occupation}
  />
);

const Money = (props) => (
  <TextQuestion
    {...props}
    autoComplete="transaction-amount"
    type="number"
    min="0.01"
    step="1.00"
  />
);

const Date = (props) => <TextQuestion {...props} type="date" />;

const Bday = (props) => (
  <TextQuestion
    {...props}
    autoComplete="bday"
    label="birthdate:"
    type="date"
    value={props.dob}
  />
);

const YesNo = (props) => (
  <RadioQuestion {...props} type="radio" valueOne="yes" valueTwo="no" />
);

const Sex = (props) => (
  <RadioQuestion
    {...props}
    label="sex:"
    type="radio"
    valueOne="male"
    valueTwo="female"
  />
);

const Property = (props) => (
  <LongerTextQuestion
    {...props}
    labelClass={styles.spanTwo}
    inputClass={styles.lineDown}
    autoComplete="off"
    rows="2"
    spellcheck="true"
  />
);

const Password = (props) => (
  <TextQuestion
    {...props}
    type="password"
    autoComplete="current-password"
    label={props.label || "password:"}
  />
);

export {
  Text,
  FirstName,
  LastName,
  PaymentMethod,
  Password,
  Email,
  Phone,
  Money,
  Date,
  Bday,
  YesNo,
  Property,
  Occupation,
  Sex,
  CheckBox,
};
