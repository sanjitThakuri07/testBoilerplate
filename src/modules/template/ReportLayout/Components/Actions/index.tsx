import React from "react";
import {
  Box,
  Checkbox,
  Collapse,
  Divider,
  Input,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { IOSSwitch } from "src/components/switch/IosSwitch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useReportLayoutDataSets } from "../../store/ReportStoreDataSets";
import BASTooltip from "src/components/BASTooltip/BASTooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ViewStreamRoundedIcon from "@mui/icons-material/ViewStreamRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";

export default function Actions({ layoutObj }: any) {
  const {
    has_action,
    has_action_summary,
    has_inspection_result,
    has_media_summary,
    has_checked,
    has_unchecked,
    has_instruction,
    has_unanswered_questions,
    has_checkboxes,
    media_resolution,
    media_thumbnail,
    // other fields for pdf and word
    has_table_of_contents,
    has_page_break,
    has_footer,
    footer_text,
  } = layoutObj;
  const {
    updateLayoutProperties,
    getDatasFromTemplates: { reducerDatas },
  } = useReportLayoutDataSets();
  const [activityCollapsed, setActivityCollapsed] = React.useState(has_action_summary);
  const [mediaCollapsed, setMediaCollapsed] = React.useState(has_media_summary);
  const [inspectionCollapsed, setInspectionCollapsed] = React.useState(has_inspection_result);
  const [instructionCollapsed, setInstructionCollapsed] = React.useState(has_instruction);
  const [unansweredQCollapsed, setUnansweredQCollapsed] = React.useState(has_unanswered_questions);
  const [checkboxCollapsed, setCheckboxCollapsed] = React.useState(has_checkboxes);
  const [selectedMediaSize, setSelectedMediaSize] = React.useState(media_thumbnail || "small");

  console.log({ layoutObj });

  return (
    <>
      <Box p={1}>
        <div className="activity_container">
          <Stack direction="column">
            <Stack direction="row" spacing={5} alignItems="center">
              <Stack direction="row" spacing={2}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <BASTooltip label="Assigned Activity Count" tooltipPlacement="top">
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
                    name={`has_action`}
                    checked={has_action}
                    onChange={(e) => updateLayoutProperties(e?.target.name, e?.target?.checked)}
                    disableText
                  />
                </Box>
                <Box sx={{ fontWeight: 500 }}>Assigned Activity Count</Box>
              </Stack>
              <Divider orientation="vertical" variant="middle" flexItem />
              {/* activity content */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <BASTooltip label="Assigned Activity Summary" tooltipPlacement="top">
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
                    name={`has_action_summary`}
                    checked={has_action_summary}
                    onChange={(e: any) => {
                      updateLayoutProperties(e?.target.name, e?.target?.checked);
                      setActivityCollapsed(!activityCollapsed);
                    }}
                    disableText
                  />
                </Box>
                <Box sx={{ fontWeight: 500 }}>Assigned Activity Summary</Box>
                <Box>
                  <FontAwesomeIcon
                    icon={faAngleRight}
                    className={`${has_action_summary && "rotate_arrow_down"} rotate_arrow_straight`}
                  />
                </Box>
              </Stack>
            </Stack>
            <Collapse in={has_action_summary} timeout="auto" unmountOnExit>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 3.5 }}>
                <Box sx={{ fontWeight: 500, fontSize: "20px" }}>Activity</Box>
                <div className="counting_highlight">
                  <div className="counting_highlight_text">1</div>
                </div>
              </Stack>
              <Box pb={3} pt={3}>
                <Box>
                  <Typography component="p">
                    Mark Jones created a High priority action for Fred Smith
                  </Typography>
                </Box>
                <Stack sx={{ mt: 2 }} direction="row" spacing={2}>
                  <div className="status_highlight">
                    <div className="status_highlight_text">In Progress</div>
                  </div>
                  <div className="date_highlight">
                    <div className="date_highlight_text">23/01/2-23</div>
                  </div>
                </Stack>
                <Stack
                  direction="column"
                  spacing={0.5}
                  sx={{ mt: 3, color: "#667085", opacity: "0.5" }}
                >
                  <Box>Work Areas / Personal Protective Equipment (PPE)</Box>
                  <Box>Hard Hats (available, worn by crew and in safe condition)</Box>
                </Stack>
              </Box>
            </Collapse>
          </Stack>
        </div>
      </Box>

      {/* action fields */}
      <Stack direction="column" pb={3}>
        <Box sx={{ my: 0.8 }} px={1}>
          <Stack direction="row" spacing={2} className="activity_container">
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <BASTooltip label="Inspection Results" tooltipPlacement="top">
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
                name={`has_inspection_result`}
                checked={has_inspection_result}
                onChange={(e) => updateLayoutProperties(e.target?.name, e?.target?.checked)}
                disableText
              />
            </Box>
            <Box sx={{ fontWeight: 500 }}>Inspection Results</Box>
          </Stack>
        </Box>
        {/* unanswered questions */}
        <Box px={1}>
          <Box sx={{ my: 0.8 }} className="activity_container">
            <Stack direction="row" spacing={2}>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <BASTooltip label="Unanswered Questions" tooltipPlacement="top">
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
                  name={`has_unanswered_questions`}
                  checked={has_unanswered_questions}
                  onChange={(e: any) => {
                    updateLayoutProperties(e?.target.name, e?.target?.checked);
                    setUnansweredQCollapsed(!unansweredQCollapsed);
                  }}
                  disableText
                />
              </Box>
              <Box sx={{ fontWeight: 500 }}>Unanswered Questions</Box>
              <Box>
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className={`${
                    has_unanswered_questions && "rotate_arrow_down"
                  } rotate_arrow_straight`}
                />
              </Box>
            </Stack>
            <Collapse in={unansweredQCollapsed} timeout="auto" unmountOnExit>
              <Box py={1} pt={2}>
                <div className="unanswered_box_container">
                  {reducerDatas?.unansweredQuestions?.slice(0, 7)?.map((ques: any, index: any) => {
                    return (
                      <>
                        {index !== 0 && <Divider />}
                        <Box key={index} className="individual_box_container">
                          <Box sx={{ fontSize: "15px" }}>{ques?.label ?? "N/A"}</Box>
                          <Box sx={{ opacity: "0.7", mt: 0.3 }}>Unanswered</Box>
                        </Box>
                      </>
                    );
                  })}
                </div>
              </Box>
            </Collapse>
          </Box>
        </Box>
        {/* instructions */}
        <Box px={1}>
          <Box sx={{ my: 0.8 }} className="activity_container">
            <Stack direction="row" spacing={2}>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <BASTooltip label="Unanswered Questions" tooltipPlacement="top">
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
                  name={`has_instruction`}
                  checked={has_instruction}
                  onChange={(e: any) => {
                    updateLayoutProperties(e?.target.name, e?.target?.checked);
                    setInstructionCollapsed(!instructionCollapsed);
                  }}
                  disableText
                />
              </Box>
              <Box sx={{ fontWeight: 500 }}>Instructions</Box>
              <Box>
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className={`${has_instruction && "rotate_arrow_down"} rotate_arrow_straight`}
                />
              </Box>
            </Stack>
            <Collapse in={instructionCollapsed} timeout="auto" unmountOnExit>
              <Box py={1} pt={2}>
                <div className="unanswered_box_container">
                  {reducerDatas?.instructions?.length > 0 ? (
                    reducerDatas?.instructions?.slice(0, 5)?.map((ins: any, index: any) => {
                      return (
                        <>
                          {index !== 0 && <Divider />}
                          <Box key={index} className="individual_box_container">
                            <Box sx={{ fontSize: "15px" }}>{ins?.label ?? "N/A"}</Box>
                            <Box sx={{ opacity: "0.7", mt: 0.3 }}>xxxxxxxxxxxxx</Box>
                          </Box>
                        </>
                      );
                    })
                  ) : (
                    <Box className="individual_box_container">
                      <Box sx={{ fontSize: "15px" }}>
                        Please check the vessel number 0013af immediately!
                      </Box>
                      <Box sx={{ opacity: "0.7", mt: 0.3 }}>xxxxxxxxxxxxx</Box>
                    </Box>
                  )}
                </div>
              </Box>
            </Collapse>
          </Box>
        </Box>
        {/* checkboxes */}
        <Box sx={{ my: 0.8 }} px={1}>
          <Box className="activity_container">
            <Stack direction="row" spacing={2}>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <BASTooltip label="Checkboxes" tooltipPlacement="top">
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
                  name={`has_checkboxes`}
                  checked={has_checkboxes}
                  onChange={(e) => {
                    updateLayoutProperties(e?.target?.name, e?.target?.checked);
                    setCheckboxCollapsed(!checkboxCollapsed);
                  }}
                  disableText
                />
              </Box>
              <Box sx={{ fontWeight: 500 }}>Checkboxes</Box>
              <Box>
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className={`${has_checkboxes && "rotate_arrow_down"} rotate_arrow_straight`}
                />
              </Box>
            </Stack>
            <Collapse in={checkboxCollapsed} timeout="auto" unmountOnExit>
              <Box py={1} pt={2}>
                <Stack direction="row" spacing={5} alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Checkbox
                      color="primary"
                      checkedIcon={<img src="/assets/icons/icon-check.svg" alt="check" />}
                      icon={<img src="/assets/icons/icon-uncheck.svg" alt="uncheck" />}
                      indeterminateIcon={
                        <img src="/assets/icons/icon-check-remove.svg" alt="indeterminate" />
                      }
                      name={`has_checked`}
                      checked={has_checked}
                      onChange={(e: any) =>
                        updateLayoutProperties(e?.target.name, e?.target?.checked)
                      }
                    />

                    <Box sx={{ fontWeight: 500 }}>Checked</Box>
                  </Stack>
                  <Divider orientation="vertical" variant="middle" flexItem />
                  {/* activity content */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Checkbox
                      color="primary"
                      checkedIcon={<img src="/assets/icons/icon-check.svg" alt="check" />}
                      icon={<img src="/assets/icons/icon-uncheck.svg" alt="uncheck" />}
                      indeterminateIcon={
                        <img src="/assets/icons/icon-check-remove.svg" alt="indeterminate" />
                      }
                      name="has_unchecked"
                      checked={has_unchecked}
                      onChange={(e: any) =>
                        updateLayoutProperties(e?.target.name, e?.target?.checked)
                      }
                    />

                    <Box sx={{ fontWeight: 500 }}>Unchecked</Box>
                  </Stack>
                </Stack>
              </Box>
            </Collapse>
          </Box>
        </Box>
        {/* media */}
        <Box p={1}>
          <Box className="activity_container">
            <Stack direction="row" spacing={2}>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <BASTooltip label="Media Settings" tooltipPlacement="top">
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
                  name={`has_media_summary`}
                  checked={has_media_summary}
                  onChange={(e: any) => {
                    updateLayoutProperties(e?.target.name, e?.target?.checked);
                    setMediaCollapsed(!mediaCollapsed);
                  }}
                  disableText
                />
              </Box>
              <Box sx={{ fontWeight: 500 }}>Media Settings</Box>
              <Box>
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className={`${has_media_summary && "rotate_arrow_down"} rotate_arrow_straight`}
                />
              </Box>
            </Stack>
            <Collapse in={mediaCollapsed} timeout="auto" unmountOnExit>
              <Box px={2} pb={3} pt={1}>
                <Stack direction="row" spacing={5} alignItems="center" mt={2}>
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Box
                      className={`${
                        selectedMediaSize === "small" && "selected_media"
                      } media_layout`}
                      onClick={() => {
                        setSelectedMediaSize("small");
                        updateLayoutProperties("media_thumbnail", "small");
                      }}
                    >
                      <DashboardRoundedIcon
                        style={{ fontSize: "80px" }}
                        onClick={() => setSelectedMediaSize("small")}
                      />
                    </Box>
                    <Box
                      className={`${
                        selectedMediaSize === "medium" && "selected_media"
                      } media_layout`}
                    >
                      <ViewStreamRoundedIcon
                        style={{ fontSize: "80px" }}
                        onClick={() => {
                          setSelectedMediaSize("medium");
                          updateLayoutProperties("media_thumbnail", "medium");
                        }}
                      />
                    </Box>
                    <Box
                      onClick={() => {
                        setSelectedMediaSize("large");
                        updateLayoutProperties("media_thumbnail", "large");
                      }}
                      className={`${
                        selectedMediaSize === "large" && "selected_media"
                      } single_layout`}
                    >
                      <Box className="single_inner_layout"></Box>
                    </Box>
                  </Stack>
                </Stack>
                {/* photo resolution */}
                <Box mt={3}>
                  <Stack direction="column" sx={{ width: "100%", mt: 5 }}>
                    <InputLabel htmlFor="Text" sx={{ mb: 0.5 }}>
                      <div className="label-heading">Photo resolution</div>
                    </InputLabel>

                    <Select
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                          },
                        },
                      }}
                      name={"media_resolution"}
                      value={media_resolution}
                      onChange={(e: any) => {
                        updateLayoutProperties("media_resolution", e?.target?.value);
                      }}
                      size="small"
                      placeholder="Choose a option"
                      sx={{
                        overflow: "hidden",
                      }}
                    >
                      <MenuItem value={"standard_resolution"}>Standard resolution</MenuItem>
                      <MenuItem value={"high_resolution"}>High resolution</MenuItem>
                    </Select>
                  </Stack>
                </Box>
              </Box>
            </Collapse>
          </Box>
        </Box>

        {/* other fields for pdf and word */}
        <Box sx={{ my: 0.8 }} px={1}>
          <Box className="activity_container">
            <Stack direction="row" spacing={2}>
              <Box sx={{ fontWeight: 500 }}>PDF and Word Settings</Box>
            </Stack>
            {/* table of contents */}
            <Stack direction="row" spacing={6} mt={2} alignItems="center">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Checkbox
                    color="primary"
                    checkedIcon={<img src="/assets/icons/icon-check.svg" alt="check" />}
                    icon={<img src="/assets/icons/icon-uncheck.svg" alt="uncheck" />}
                    indeterminateIcon={
                      <img src="/assets/icons/icon-check-remove.svg" alt="indeterminate" />
                    }
                    name="has_table_of_contents"
                    checked={has_table_of_contents}
                    onChange={(e: any) =>
                      updateLayoutProperties(e?.target.name, e?.target?.checked)
                    }
                  />
                </Box>
                <Box sx={{ fontWeight: 500 }}>Table of contents</Box>
              </Stack>
              <Divider orientation="vertical" variant="middle" flexItem />
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Checkbox
                    color="primary"
                    checkedIcon={<img src="/assets/icons/icon-check.svg" alt="check" />}
                    icon={<img src="/assets/icons/icon-uncheck.svg" alt="uncheck" />}
                    indeterminateIcon={
                      <img src="/assets/icons/icon-check-remove.svg" alt="indeterminate" />
                    }
                    name="has_page_break"
                    checked={has_page_break}
                    onChange={(e: any) =>
                      updateLayoutProperties(e?.target.name, e?.target?.checked)
                    }
                  />
                </Box>
                <Box sx={{ fontWeight: 500 }}>Page Break</Box>
              </Stack>
            </Stack>
            <Stack direction="column">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Checkbox
                    color="primary"
                    checkedIcon={<img src="/assets/icons/icon-check.svg" alt="check" />}
                    icon={<img src="/assets/icons/icon-uncheck.svg" alt="uncheck" />}
                    indeterminateIcon={
                      <img src="/assets/icons/icon-check-remove.svg" alt="indeterminate" />
                    }
                    name="has_footer"
                    checked={has_footer}
                    onChange={(e: any) =>
                      updateLayoutProperties(e?.target.name, e?.target?.checked)
                    }
                  />
                </Box>
                <Box sx={{ fontWeight: 500 }}>Footer</Box>
              </Stack>
              <Box mt={1}>
                {has_footer && (
                  <OutlinedInput
                    value={footer_text}
                    name="footer_text"
                    size="small"
                    fullWidth
                    placeholder="Enter footer text"
                    onChange={(e: any) => {
                      updateLayoutProperties(e?.target.name, e?.target?.value);
                    }}
                  />
                )}
              </Box>
            </Stack>
          </Box>
        </Box>
      </Stack>
    </>
  );
}
