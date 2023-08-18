import React from "react";
import { Box, Divider, Stack } from "@mui/material";
import { useReportLayoutDataSets } from "../../../../store/zustand/report/ReportStoreDataSets";

export default function PdfUnansweredQuestions({ has_unanswered_questions }: any) {
  const {
    getDatasFromTemplates: { reducerDatas },
  } = useReportLayoutDataSets();

  return (
    <Box mt={2}>
      {has_unanswered_questions && (
        <Box className="box-container-pdf">
          <Box sx={{ fontWeight: 500 }} className="pdf_label">
            Unanswered Questions
          </Box>

          {reducerDatas?.unansweredQuestions?.slice(0, 5)?.map((ques: any, index: any) => {
            return (
              <>
                {index !== 0 && <Divider />}
                <Box key={index} className="individual_box_container">
                  <Stack direction="row" justifyContent="space-between">
                    <Box sx={{ fontSize: "15px" }}>{ques?.label ?? "N/A"}</Box>
                    <Box sx={{ opacity: "0.7", mt: 0.3 }}>Unanswered</Box>
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
