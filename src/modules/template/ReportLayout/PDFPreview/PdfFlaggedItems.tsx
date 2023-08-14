import React from "react";
import { Box, Chip, Divider, Stack } from "@mui/material";
import { useReportLayoutDataSets } from "../store/ReportStoreDataSets";

export default function PdfFlaggedItems({
  has_flagged_summary,
  has_flagged,
}: any) {
  const {
    getDatasFromTemplates: { reducerDatas },
  } = useReportLayoutDataSets();

  return (
    <Box mt={2}>
      {has_flagged_summary && (
        <Box className="box-container-pdf">
          <Box sx={{ fontWeight: 500 }} className="pdf_label">
            <Stack direction="row" justifyContent="space-between">
              <Box>Flagged Contents</Box>
              {has_flagged && <Box>1</Box>}
            </Stack>
          </Box>

          {reducerDatas?.flaggedQuestions
            ?.slice(0, 7)
            ?.map((flag: any, index: any) => {
              return (
                <>
                  {index !== 0 && <Divider />}
                  <Box key={index} className="individual_box_container">
                    <Stack direction="row" justifyContent="space-between">
                      <Box sx={{ fontSize: "15px" }}>
                        {flag?.label ?? "N/A"}
                      </Box>
                      <Box sx={{ opacity: "0.7", mt: 0.3 }}>
                        {flag?.flaggedResponse?.map((item: any, index: any) => {
                          return (
                            <Chip
                              sx={{ ml: 0.5 }}
                              key={index}
                              size="small"
                              label={item}
                            />
                          );
                        })}
                      </Box>
                    </Stack>
                  </Box>
                </>
              );
            })}
        </Box>
      )}
    </Box>
  );
}
