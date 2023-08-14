import React from "react";
import { IOSSwitch } from "src/components/switch/IosSwitch";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Collapse, TextareaAutosize } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useReportLayoutDataSets } from "../store/ReportStoreDataSets";
import BASTooltip from "src/components/BASTooltip/BASTooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const Disclaimer = ({ layoutObj }: any) => {
  const { has_disclaimer, disclaimer_text } = layoutObj;
  const { updateLayoutProperties } = useReportLayoutDataSets();
  const [disclaimerCollapsed, setDisclaimerCollapsed] = React.useState(has_disclaimer);

  return (
    <Box className="overview_layout_container">
      <Box sx={{ width: "100%" }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <BASTooltip label="Disclaimer" tooltipPlacement="top">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <InfoOutlinedIcon style={{ color: "#667085", fontSize: "23px" }} />
              </Box>
            </BASTooltip>
            <IOSSwitch
              name={`has_disclaimer`}
              checked={has_disclaimer}
              onChange={(e: any) => {
                updateLayoutProperties(e?.target.name, e?.target?.checked);
                setDisclaimerCollapsed(!disclaimerCollapsed);
              }}
              disableText
            />
          </Box>
          <Box sx={{ fontWeight: 500 }}>Abstract</Box>
          <Box>
            <FontAwesomeIcon
              icon={faAngleRight}
              className={`${has_disclaimer && "rotate_arrow_down"} rotate_arrow_straight`}
            />
          </Box>
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
            onChange={(e: any) => updateLayoutProperties(e?.target.name, e?.target?.value)}
            className="text__area-style"
            name={"disclaimer_text"}
            value={disclaimer_text}
          />
        </Box>
      </Collapse>
    </Box>
  );
};

export default Disclaimer;
