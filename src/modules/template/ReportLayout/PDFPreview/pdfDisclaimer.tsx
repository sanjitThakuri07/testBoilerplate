import React from "react";
import { Box, Divider, Stack } from "@mui/material";

export default function PdfDisclaimer({
  has_disclaimer,
  disclaimer_text,
}: any) {
  return (
    <>
      {has_disclaimer && (
        <Box mt={1} className="box-container-pdf">
          <Box sx={{ width: "100%" }}>
            <Box sx={{ fontWeight: 500 }} className="pdf_label">
              Abstract
            </Box>
          </Box>

          <Box
            sx={{ opacity: "0.7", fontSize: "14px", mt: 0.4, padding: "10px" }}
          >
            {disclaimer_text}
          </Box>
        </Box>
      )}
    </>
  );
}
