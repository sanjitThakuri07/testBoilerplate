import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Collapse, Stack, Typography } from "@mui/material";
import CustomBadgeCreator from "src/components/CustomBadgeCreator/index";
import { useState } from "react";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import LayoutProfile from "./LayoutProfile";

const Overview = ({ badgeContent, layoutObj, layoutParams }: any) => {
  const { has_flagged, has_action } = layoutObj;
  const [overviewCollapsed, setOverviewCollapsed] = useState(true);

  return (
    <div className="overview_layout_container">
      <Box display={"flex"} width={"100%"} justifyContent="space-between">
        <Stack direction="row" spacing={2} justifyContent="center" alignItems={"center"}>
          <Box onClick={() => setOverviewCollapsed(!overviewCollapsed)} className="overview_button">
            <FontAwesomeIcon
              icon={faAngleRight}
              className={`${overviewCollapsed && "rotate_arrow_down"} rotate_arrow_straight`}
            />
          </Box>

          <Typography fontSize={20} fontWeight={500} sx={{ select: "none" }}>
            Overview
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="center">
          <CustomBadgeCreator styleChoice={badgeContent?.status} value={badgeContent?.value} />
        </Stack>
      </Box>
      <Box width="100%">
        <Collapse in={overviewCollapsed} timeout="auto" unmountOnExit>
          <Box sx={{ py: 2, mt: 3 }}>
            <LayoutProfile layoutObj={layoutObj} layoutParams={layoutParams} />
          </Box>

          {/* down contents */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }} mt={1}>
            <Stack direction="row" spacing={2} justifyContent="center" alignItems={"center"}>
              <Typography fontSize={14} fontWeight={400}>
                Inspection Score
              </Typography>
              <Typography fontSize={16} fontWeight={600}>
                0%
              </Typography>
            </Stack>
            {has_flagged && (
              <Stack direction="row" spacing={2} justifyContent="center" alignItems={"center"}>
                <Typography fontSize={14} fontWeight={400}>
                  Flagged Items
                </Typography>
                <Typography fontSize={16} fontWeight={600}>
                  1
                </Typography>
              </Stack>
            )}
            {has_action && (
              <Stack direction="row" spacing={2} justifyContent="center" alignItems={"center"}>
                <Typography fontSize={14} fontWeight={400}>
                  {" "}
                  Created Actions
                </Typography>
                <Typography fontSize={16} fontWeight={600}>
                  {" "}
                  1
                </Typography>
              </Stack>
            )}
          </Box>
        </Collapse>
      </Box>
    </div>
  );
};

export default Overview;
