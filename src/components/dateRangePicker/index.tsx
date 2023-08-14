// import React from 'react'
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker, RangeKeyDict } from "react-date-range";

interface Props {
  staticRanges: any;
  direction?: any;
  name?: string;
  className?: string;
  disabled?: any;
  months?: number;
  ranges: any;
  showMonthAndYearPickers?: boolean;
  moveRangeOnFirstSelection?: boolean;
  showDateDisplay?: boolean;
  onChange: (ran: RangeKeyDict) => void;
  tooltipText?: any;
}

const DateRangePickerComponent = (props: Props) => {
  const {
    staticRanges = { startDate: new Date(), endDate: new Date() },
    direction = "horizontal",
    className,
    showMonthAndYearPickers = false,
    moveRangeOnFirstSelection = false,
    showDateDisplay = true,
    months = 2,
    onChange,
    ranges,
  } = props;

  return (
    <DateRangePicker
      onChange={onChange}
      moveRangeOnFirstSelection={moveRangeOnFirstSelection}
      months={months}
      ranges={ranges}
      className={className}
      direction={direction}
      staticRanges={staticRanges}
      showMonthAndYearPickers={showMonthAndYearPickers}
      showDateDisplay={showDateDisplay}
    />
  );
};

export default DateRangePickerComponent;
