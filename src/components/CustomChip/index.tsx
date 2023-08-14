import React from "react";

const index = ({ style, children, className }: any) => {
  return (
    <span
      style={{
        background: style?.background || "transparent",
        border: `1px solid ${style?.borderColor || "trasparent"}`,
        color: "#000",
      }}
      className={`${className}`}
    >
      <span className="dot"></span>
      <span>{children}</span>
    </span>
  );
};

export default index;
