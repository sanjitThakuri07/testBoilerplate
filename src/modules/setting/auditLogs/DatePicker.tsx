import { Box, Button, Grid, Modal, Stack } from "@mui/material";
import { FC, useState } from "react";
import { RangeKeyDict } from "react-date-range";
import DateRangePickerComponent from "src/components/dateRangePicker";

import {
  addDays,
  endOfDay,
  startOfDay,
  startOfMonth,
  endOfMonth,
  addMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import moment from "moment";

const DatePicker: FC<{
  modelOpen?: boolean;
  onHide: (key: "datepicker" | "location" | "customizedTable") => void;
  setModelOpen?: any;
  onDataTableChange?: any;
  state?: any;
  setState?: any;
}> = ({ modelOpen = false, onHide, setModelOpen, onDataTableChange, state, setState }) => {
  const handleClose = () => {
    onHide("datepicker");
    setModelOpen(!modelOpen);
  };

  const defineds = {
    startOfWeek: startOfWeek(new Date()),
    endOfWeek: endOfWeek(new Date()),
    startOfLastWeek: startOfWeek(addDays(new Date(), -7)),
    endOfLastWeek: endOfWeek(addDays(new Date(), -7)),
    startOfToday: startOfDay(new Date()),
    endOfToday: endOfDay(new Date()),
    startOfYesterday: startOfDay(addDays(new Date(), -1)),
    endOfYesterday: endOfDay(addDays(new Date(), -1)),
    startOfMonth: startOfMonth(new Date()),
    endOfMonth: endOfMonth(new Date()),
    startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
    endOfLastMonth: endOfMonth(addMonths(new Date(), -1)),
  };

  const staticRanges = [
    {
      label: "Today",
      range: () => ({
        startDate: defineds.startOfToday,
        endDate: defineds.endOfToday,
      }),
      key: "selection",
      isSelected: () => true,
    },
    {
      label: "Yesterday",
      range: () => ({
        startDate: defineds.startOfYesterday,
        endDate: defineds.endOfYesterday,
      }),
      isSelected: () => false,
    },
    {
      label: "This week",
      range: () => ({
        startDate: defineds.startOfWeek,
        endDate: defineds.endOfWeek,
      }),
      isSelected: () => false,
    },
    {
      label: "Last week",
      range: () => ({
        startDate: defineds.startOfLastWeek,
        endDate: defineds.endOfLastWeek,
      }),
      isSelected: () => false,
    },
    {
      label: "This month",
      range: () => ({
        startDate: defineds.startOfMonth,
        endDate: defineds.endOfMonth,
      }),
      isSelected: () => false,
    },
    {
      label: "Last month",
      range: () => ({
        startDate: defineds.startOfLastMonth,
        endDate: defineds.endOfLastMonth,
      }),
      isSelected: () => false,
    },
    {
      label: "This year",
      range: () => ({
        startDate: new Date(),
        endDate: new Date(),
      }),
      isSelected: () => false,
    },
    {
      label: "Last year",
      range: () => ({
        startDate: new Date(),
        endDate: new Date(),
      }),
      isSelected: () => false,
    },
    {
      label: "All time",
      range: () => ({
        startDate: new Date(),
        endDate: new Date(),
      }),
      isSelected: () => false,
    },
  ];

  const handleSelect = (ranges: RangeKeyDict) => {
    setState([ranges.selection as any]);
  };

  return (
    <Modal open={modelOpen} onClose={handleClose}>
      <Box className="datepicker-modal">
        <DateRangePickerComponent
          onChange={handleSelect}
          moveRangeOnFirstSelection={false}
          months={2}
          ranges={state}
          direction="horizontal"
          staticRanges={staticRanges}
          showMonthAndYearPickers={false}
          showDateDisplay={true}
        />
        <Grid container className="button-holder" justifyContent="space-between">
          <Grid item>
            <Button variant="outlined">
              {moment(state[0]?.startDate)?.format("MMMM Do YYYY")}
            </Button>
            &nbsp;-&nbsp;
            <Button variant="outlined">{moment(state[0]?.endDate)?.format("MMMM Do YYYY")}</Button>
          </Grid>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={() => setModelOpen(!modelOpen)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setModelOpen(!modelOpen);
                onDataTableChange({
                  object: {
                    from_date: moment(state[0]?.startDate).format("YYYY-MM-DD"),
                    to_date: moment(state[0]?.endDate).format("YYYY-MM-DD"),
                  },
                });
              }}
            >
              Apply
            </Button>
          </Stack>
        </Grid>
      </Box>
    </Modal>
  );
};

export default DatePicker;
