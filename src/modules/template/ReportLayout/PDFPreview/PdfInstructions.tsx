import { Box, Divider, Stack } from "@mui/material";
import React from "react";
import { useReportLayoutDataSets } from "../../../../store/zustand/report/ReportStoreDataSets";

export default function PdfInstructions({ has_instruction }: any) {
  const {
    getDatasFromTemplates: { reducerDatas },
  } = useReportLayoutDataSets();

  const dummyInstruction = ["Please log all damages and defects noted on the vehicle"];

  console.log(reducerDatas);

  return (
    <Box mt={2}>
      {has_instruction && (
        <Box className="box-container-pdf">
          <Box sx={{ fontWeight: 500 }} className="pdf_label">
            Instructions
          </Box>

          {reducerDatas?.instruction?.length > 0 ? (
            reducerDatas?.instructions?.slice(0, 7)?.map((ques: any, index: any) => {
              return (
                <>
                  {index !== 0 && <Divider />}
                  <Box key={index} className="individual_box_container">
                    <Stack direction="row" justifyContent="space-between">
                      <Box sx={{ fontSize: "15px" }}>{ques?.label ?? "N/A"}</Box>
                      <Box sx={{ opacity: "0.7", mt: 0.3 }}>xxxxxxxxxxx</Box>
                    </Stack>
                  </Box>
                </>
              );
            })
          ) : (
            <Box className="individual_box_container">
              <Stack direction="row" justifyContent="space-between">
                <Box sx={{ fontSize: "15px" }}>
                  Please check the vessel number 0013af immediately!
                </Box>
                <Box sx={{ opacity: "0.7", mt: 0.3 }}>xxxxxxxxxxx</Box>
              </Stack>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
