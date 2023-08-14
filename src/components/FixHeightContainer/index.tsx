import React from "react";

const HeightContainer = ({ children, style, className }: any) => {
  let STYLE: any = style || {};
  return (
    <div
      style={{ ...STYLE }}
      className={className ? `${className}` : "HEIGHT__CONTAINER__FIX_STYLE"}
    >
      {children}
    </div>
  );
};

export default HeightContainer;
