import React from "react";
import { IOSSwitch } from "src/components/switch/IosSwitch";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Collapse, Divider, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useReportLayoutDataSets } from "../../../../store/zustand/report/ReportStoreDataSets";
import BASTooltip from "src/components/BASTooltip/BASTooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const FlaggedItems = ({ layoutObj }: any) => {
  const { has_flagged, has_flagged_summary } = layoutObj;
  const { updateLayoutProperties } = useReportLayoutDataSets();
  const [flaggedCollapsed, setFlaggedCollapsed] = React.useState(has_flagged_summary);

  return (
    <div className="overview_layout_container">
      <Box sx={{ width: "100%" }}>
        <Stack direction="row" spacing={5} alignItems="center">
          {/* flagged count */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <BASTooltip label="Flagged Count" tooltipPlacement="top">
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
                name={`has_flagged`}
                checked={has_flagged}
                onChange={(e) => updateLayoutProperties(e?.target.name, e?.target?.checked)}
                disableText
              />
            </Box>
            <Box sx={{ fontWeight: 500 }}>Flagged Count</Box>
          </Stack>
          <Divider orientation="vertical" variant="middle" flexItem />
          {/* flagged content */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <BASTooltip label="Flagged Content" tooltipPlacement="top">
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
                name={`has_flagged_summary`}
                checked={has_flagged_summary}
                onChange={(e: any) => {
                  updateLayoutProperties(e?.target.name, e?.target?.checked);
                  setFlaggedCollapsed(!flaggedCollapsed);
                }}
                disableText
              />
            </Box>
            <Box sx={{ fontWeight: 500 }}>Flagged Content</Box>
            <Box>
              <FontAwesomeIcon
                icon={faAngleRight}
                className={`${has_flagged_summary && "rotate_arrow_down"} rotate_arrow_straight`}
              />
            </Box>
          </Stack>
        </Stack>

        {/* actions fields */}
        <Collapse in={flaggedCollapsed} timeout="auto" unmountOnExit>
          <Stack direction="row" spacing={2} alignItems="center" mt={3.5}>
            <Box sx={{ fontWeight: 500, fontSize: "20px" }}>Flagged Content</Box>
            <div className="counting_highlight">
              <div className="counting_highlight_text">1</div>
            </div>
          </Stack>

          <>
            <Box sx={{ mt: 3 }}>
              <Typography component="p">Report Number</Typography>
            </Box>
            <Stack sx={{ mt: 2 }} direction="row" spacing={2}>
              <div className="status_highlight">
                <div className="status_highlight_text">No</div>
              </div>
            </Stack>
          </>
        </Collapse>
      </Box>
    </div>
  );
};

export default FlaggedItems;
