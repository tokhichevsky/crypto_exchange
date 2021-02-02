import React from "react";

interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>{
  wrapperClassName?: string
}

const Input = ({wrapperClassName, ...props}: InputProps) =>
  <div className={`form-control ${wrapperClassName || ""}`}>
    <input {...props}/>
  </div>;

export default Input;