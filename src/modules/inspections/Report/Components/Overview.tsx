import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Collapse, Stack, Typography } from "@mui/material";
import CustomBadgeCreator from "src/components/CustomBadgeCreator/index";
import { useCurrentLayout, useReportDataSets } from "containers/inspections/store/inspection";
import LayoutProfile from "containers/template/ReportLayout/Components/LayoutProfile";
import { useReportLayoutDataSets } from "src/modules/template/ReportLayout/store/ReportStoreDataSets";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const Overview = ({ badgeContent, mode = "web", datass = {}, currentLayout }: any) => {
  const [overviewCollapsed, setOverviewCollapsed] = useState(true);
  const { layoutParams } = useReportLayoutDataSets();
  const { initialState, setInitialState } = useReportDataSets();
  const [searchParams, setSearchParams] = useSearchParams();

  const { currentReportLayout } = useCurrentLayout();
  const current = searchParams?.get("token") ? currentLayout : currentReportLayout;

  const imagePreview = current?.logo?.length
    ? `${process.env.VITE_HOST_URL}/${current?.logo}`
    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuO5DHoVEEhjaWnyLXFsJ7_Jk6T_QDWGYsAogR5M8n&s";

  if (mode === "pdf") {
    return (
      <Box>
        <LayoutProfile
          layoutObj={current}
          layoutParams={layoutParams}
          previewMode="pdf"
          initialState={initialState}
        />
      </Box>
    );
  }

  return (
    <>
      <div className="overview_layout_container __question">
        <Box display={"flex"} width={"100%"} justifyContent="space-between">
          <Stack direction="row" spacing={2} justifyContent="center" alignItems={"center"}>
            <Box
              onClick={() => setOverviewCollapsed(!overviewCollapsed)}
              className="overview_button"
            >
              <FontAwesomeIcon
                icon={faAngleRight}
                className={`${overviewCollapsed && "rotate_arrow_down"} rotate_arrow_straight`}
              />
            </Box>

            <Typography fontSize={18} fontWeight={500} sx={{ select: "none" }}>
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
              <LayoutProfile
                layoutObj={current}
                layoutParams={layoutParams}
                initialState={initialState}
              />
            </Box>{" "}
            {/* down contents */}
            <Box sx={{ display: "flex", justifyContent: "space-between" }} mt={1}>
              <Stack direction="row" spacing={2} justifyContent="center" alignItems={"center"}>
                <Typography fontSize={14} fontWeight={400}>
                  {" "}
                  Inspection Score
                </Typography>
                <Typography fontSize={16} fontWeight={600}>
                  {" "}
                  0%
                </Typography>
              </Stack>
              {current?.has_flagged && (
                <Stack direction="row" spacing={2} justifyContent="center" alignItems={"center"}>
                  <Typography fontSize={14} fontWeight={400}>
                    Flagged Items
                  </Typography>
                  <Typography fontSize={16} fontWeight={600}>
                    {datass?.flaggedQuestions?.length}
                  </Typography>
                </Stack>
              )}
              {current?.has_action && (
                <Stack direction="row" spacing={2} justifyContent="center" alignItems={"center"}>
                  <Typography fontSize={14} fontWeight={400}>
                    {" "}
                    Created Actions
                  </Typography>
                  <Typography fontSize={16} fontWeight={600}>
                    {" "}
                    {datass?.actions?.length}
                  </Typography>
                </Stack>
              )}
            </Box>
          </Collapse>
        </Box>
      </div>
    </>
  );
};

export default Overview;
