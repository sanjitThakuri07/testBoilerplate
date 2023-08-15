import React from "react";
import {
  Box,
  Button,
  Chip,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { ReactComponent as InfoIcon } from "/src/assets/icons/info_icon.svg";
import { useCurrentLayout } from "src/modules/inspections/store/inspection";

export default function CreateLayout({ layouts = [] }: any) {
  const { currentReportLayout } = useCurrentLayout();

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box sx={{ fontWeight: 500, fontSize: "25px" }}>Report Layout</Box>
          <Box sx={{ cursor: "pointer" }}>
            <InfoIcon />
          </Box>
        </Stack>
        {/* <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<img src="/src/assets/icons/plus-white.svg" alt="plus" />}
          >
            Create Layout
          </Button>
        </Box> */}
        {/* choose default layout */}
        <Stack direction="column" sx={{ width: "100%", mt: 3 }}>
          <InputLabel htmlFor="Text" sx={{ mb: 0.5 }}>
            <div className="label-heading">Choose Layout</div>
          </InputLabel>
          <Select
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                },
              },
            }}
            // id={`address.${index}.status`}
            name={"default_layout"}
            size="small"
            fullWidth
            onChange={layouts?.handleChange}
            value={layouts?.currentLayout || {}}
            renderValue={(e: any) => {
              return e?.name || "";
            }}
            defaultValue={layouts?.currentLayout}
            placeholder="Choose a option"
            sx={{
              overflow: "hidden",
            }}
          >
            {(layouts?.layoutList || [])?.map((option: any, index: number) => {
              return (
                <MenuItem key={index} value={option}>
                  {option?.name}
                </MenuItem>
              );
            })}
          </Select>
        </Stack>
        <Stack direction="column" sx={{ width: "100%", mt: 3 }}>
          <a href="#overview">Overview</a>
          {currentReportLayout?.has_disclaimer && <a href="#disclaimer">Disclaimer</a>}
          {currentReportLayout?.has_flagged_summary && <a href="#flaggedItems">FlaggedItems</a>}
          {currentReportLayout?.has_action_summary && <a href="#actions">Activity</a>}
          <a href="#questions">Questions</a>
          {currentReportLayout?.has_media_summary && <a href="#media">Media</a>}
        </Stack>
      </Box>
    </>
  );
}
