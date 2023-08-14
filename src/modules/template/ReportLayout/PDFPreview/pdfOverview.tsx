import React from "react";
import { Box } from "@mui/material";
import LayoutProfile from "../Components/LayoutProfile";

export default function PdfOverview({ layoutObj, layoutParams }: any) {
  return (
    <Box>
      <LayoutProfile
        layoutObj={layoutObj}
        layoutParams={layoutParams}
        previewMode="pdf"
      />
    </Box>
  );
}
