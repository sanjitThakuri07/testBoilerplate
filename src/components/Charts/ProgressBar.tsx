import React from "react";
// import { Box } from "@mui/material";

export default function ProgressBar({ bgColor, completed }: any) {
  return (
    <div className="progress_bar_container">
      <div
        className="progress_dynamic_container"
        style={{ width: `${completed}%`, backgroundColor: bgColor }}
      >
        <div className="progress_bar_label"></div>
      </div>
    </div>
  );
}
