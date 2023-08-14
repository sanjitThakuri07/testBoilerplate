import { Typography } from "@mui/material";
import React from "react";
import "./org.scss";

const OrgCard = ({ title = "", content = "", icon = undefined, pill = "", children=<></> }) => {
  return (
    <div className="org-holder">
      <div className="top">
        <Typography variant="body1" className="title">
          {title}
        </Typography>
        <Typography variant="h3" className="content">
          {content}
        </Typography>
        {pill && (
          <div className="org-pill-holder">
            <span className="pill">{pill}</span>
          </div>
        )}
      </div>
      {icon && <div className="ico-holder">{icon}</div>}
      {children}
    </div>
  );
};

export default OrgCard;
