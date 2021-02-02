import React, {MouseEventHandler} from "react";
import IconSet from "./IconSet";


type IconProps = {
  name: string,
  width?: number | string,
  height?: number | string,
  className?: string,
  onClick?: MouseEventHandler
}

const Icon = (props: IconProps) => {
  return (
    <svg
      width={props.width?.toString() || "16"}
      height={props.height?.toString() || "16"}
      xmlns="http://www.w3.org/2000/svg"
      className={props.className || ""}
      onClick={props.onClick}
    >
      {IconSet[props.name]}
    </svg>
  );
};

export default Icon;