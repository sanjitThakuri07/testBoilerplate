import { Box } from "@mui/material";
import React from "react";

export default function PdfPageBreak({ has_page_break }: any) {
  return (
    <>
      {has_page_break && (
        <Box className="Pdf_break_main_container">
          <Box className="pdf_page_break_container"></Box>
          <Box className="pdf_page_break_content">Page Break</Box>
        </Box>
      )}
    </>
  );
}
