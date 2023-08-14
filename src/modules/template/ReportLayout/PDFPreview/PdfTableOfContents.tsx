import React from "react";
import { Box, Stack } from "@mui/material";

export default function PdfTableOfContents({ has_table_of_contents }: any) {
  const dummyContents = [
    { label: "1. Abstract" },
    { label: "2. Flagged Content" },
    { label: "3. Assigned Summary" },
    { label: "4. Inspection Result" },
    {
      label: "5. Page",
      childSection: [
        { label: "5.1 Section" },
        { label: "5.2 Section" },
        { label: "5.3 Section" },
      ],
    },
    { label: "6. Media Settings" },
  ];

  return (
    <>
      <Box mt={2}>
        {has_table_of_contents && (
          <Box className="">
            <Box sx={{ fontWeight: 500 }} className="pdf_label">
              Table of Contents
            </Box>
            <Box className="individual_box_container">
              {dummyContents?.map((content: any, index: any) => {
                return (
                  <Stack direction="column">
                    <Stack
                      key={index}
                      direction="row"
                      justifyContent="space-between"
                      mt={1}
                    >
                      <Box sx={{ fontWeight: 500 }}>{content?.label}</Box>
                      <Box sx={{ mt: 0.3 }}>#</Box>
                    </Stack>
                    {content?.childSection?.map((child: any, index: any) => {
                      return (
                        <Stack
                          key={index}
                          direction="row"
                          justifyContent="space-between"
                          py={0.5}
                          px={2}
                        >
                          <Box sx={{ fontWeight: 500, opacity: "0.7" }}>
                            {child?.label}
                          </Box>
                          <Box sx={{ mt: 0.3 }}>#</Box>
                        </Stack>
                      );
                    })}
                  </Stack>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}
