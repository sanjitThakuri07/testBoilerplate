import React from "react";

import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import BasicCard from "src/components/CalendarInfo";

interface MoreItemPopoverProps {
  event: any;
}

const MoreItemPopover = ({ event }: MoreItemPopoverProps) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {/* <span aria-describedby={id} onClick={handleClick}> */}
        {/* <BasicCard
          // onClickCard={handleClick}
          title={event.title}
          name={event.name}
          description={event.description}
          start_time={event.start_date}
          end_time={event.end_date}
          allDay={event.allDay}
          location={event.location}
          buttonStatus={true}
        /> */}
        {/* </span> */}
      </Popover>
    </div>
  );
};

export default MoreItemPopover;
