/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { Button as MuiButton } from "@mui/material";
import { CommonTooltip } from "components/tooltips";
import React from "react";

interface Props {
  children: React.ReactNode;
  name?: string;
  className?: string;
  disabled?: any;
  onClick: (e: any) => void;
  tooltipText?: any;
}

const Button = (props: Props) => {
  const { children, className, onClick, disabled, name = "button", tooltipText } = props;

  return (
    <CommonTooltip title={tooltipText ?? ""} placement="top-end">
      <MuiButton
        className={className || "primary-button"}
        onClick={onClick}
        name={name}
        disabled={disabled}
      >
        {children}
      </MuiButton>
    </CommonTooltip>
  );
};

export default Button;
