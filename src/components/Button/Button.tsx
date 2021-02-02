import React from "react";
import "./Button.scss";

interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  invalidText?: string
}

const Button = (props: ButtonProps) =>
  <div className="Button-wrapper">
    <button {...props} className={`Button ${props.className || ""}`}>
      {props.children}
    </button>
    {props.invalidText && <span className="Button_invalid-text">{props.invalidText}</span>}
  </div>;

export default Button;