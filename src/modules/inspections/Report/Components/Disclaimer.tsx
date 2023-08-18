import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Collapse, TextareaAutosize, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useCurrentLayout } from "src/store/zustand/inspectionTemp/inspection";
import React from "react";

const Disclaimer = ({ mode = "web" }) => {
  const [disclaimerCollapsed, setDisclaimerCollapsed] = React.useState<any>(true);
  const { currentReportLayout } = useCurrentLayout();

  if (mode === "pdf") {
    return (
      <Box
      //  className="box-container-pdf"
      >
        <Box sx={{ width: "100%" }}>
          <Box sx={{ fontWeight: 500 }} className="pdf_label">
            Abstract
          </Box>
        </Box>
        <Box sx={{ opacity: "0.7", fontSize: "14px", mt: 0.4 }}>
          {currentReportLayout?.disclaimer_text}
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="overview_layout_container">
        <Box display={"flex"} width={"100%"} justifyContent="space-between">
          <Stack direction="row" spacing={2} justifyContent="center" alignItems={"center"}>
            <Box
              onClick={() => setDisclaimerCollapsed(!disclaimerCollapsed)}
              className="overview_button"
            >
              <FontAwesomeIcon
                icon={faAngleRight}
                className={`${disclaimerCollapsed && "rotate_arrow_down"} rotate_arrow_straight`}
              />
            </Box>

            <Typography fontSize={18} fontWeight={500} sx={{ select: "none" }}>
              Abstract
            </Typography>
          </Stack>
        </Box>

        <Collapse in={disclaimerCollapsed} timeout="auto" unmountOnExit sx={{ width: "100%" }}>
          <Box pt={2} sx={{ width: "100%" }}>
            <TextareaAutosize
              style={{
                outline: "none",
                resize: "none",
                width: "96%",
              }}
              minRows={4}
              id="w3review"
              className="text__area-style"
              name={"disclaimer_text"}
              value={currentReportLayout?.disclaimer_text}
            />
          </Box>
        </Collapse>
      </Box>
    </>
  );
};

export default Disclaimer;
