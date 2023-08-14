import { Grid } from "@mui/material";
import { LayoutLabels } from "src/modules/layout/constants";
import React from "react";
interface ReactNodeProps {
  collapsed: boolean;
}

const Footer: React.FC<any> = ({ collapsed }: ReactNodeProps) => {
  return (
    <Grid
      container
      className="footer-container"
      spacing={0}
      alignItems={"space-between"}
      direction={"row"}
      justifyContent={"space-between"}
      style={{
        margin: "15px 0",
      }}
    >
      <Grid item>{LayoutLabels.COPYRIGHT}</Grid>
      <Grid item>{LayoutLabels.HELPTEXT}</Grid>
    </Grid>
  );
};

export default Footer;
