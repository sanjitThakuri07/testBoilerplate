import BasicCard from "src/components/CalendarInfo";
import { Avatar, Popover } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

interface PopoverButtonProps {
  viewEventWithModal: (id: number) => void;
  // deleteEvent: (id: number) => void;
}

const PopoverButton = (events: any, eventName: string) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  let event = events.events.event;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "custom-calendar_popover" : undefined;

  const startTime = new Date(events.events.event.start_date);
  const endTime = new Date(events.events.event.end_date);

  const today = new Date();

  const viewEventWithModal = (id: number) => {
    events.viewEventWithModal(id);
  };

  const deleteEventById = (id: number) => {
    events.deleteEvent(id);
  };

  let event_sht = events.events.event;
  let event_type = event_sht.type;

  let event_annotate = "";
  let event_color = "";

  switch (event_type) {
    case "Event":
      event_annotate = "E";
      event_color = "orange";
      break;

    // case 'Inspection':
    //   event_annotate = 'I';
    //   event_color = 'blue';
    //   break;

    case "Activity":
      event_annotate = "A";
      event_color = "green";
      break;

    case "Template":
      event_annotate = "I";
      event_color = "purple";
      break;

    case "Bookings":
      event_annotate = "B";
      event_color = "#ea7a3d";
      break;

    default:
      event_annotate = "R";
      event_color = "red";
  }

  console.info(event.inspector, "jhjednje");

  return (
    <div id="PopoverButton">
      <div
        aria-describedby={id}
        onClick={handleClick}
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Avatar
          sx={{
            bgcolor: event_color,

            width: 20,
            height: 20,
            fontSize: "12px",
            marginRight: "7px",
            marginTop: "0.8px",
          }}
        >
          {event_annotate}
        </Avatar>{" "}
        {event_sht.type === "Bookings" ? event_sht.booking_id : event_sht.title || event_sht.name}
      </div>
      <Popover
        id={id}
        className="calendar_popover"
        open={open}
        anchorEl={anchorEl}
        disableRestoreFocus
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <BasicCard
          id={events.events.event.id}
          title={events.events.event.title}
          name={events.events.event.name}
          description={events.events.event.description}
          start_time={startTime}
          status={events.events.event.status}
          end_time={endTime}
          inspectors={events.events.event.inspectors}
          contractors={events.events.event.contractors}
          viewEventWithModal={() => viewEventWithModal(event.id)}
          deleteEvent={() => deleteEventById(event.id)}
          eventType={event.type}
          location={events.events.event.location}
          inspectionType={events.events.event.inspection_type}
          inspectionId={events.events.event.inspection_type_id}
          // handleButtonClick={handleButtonClick}
          buttonStatus={today >= startTime && today <= endTime ? false : true}
        />
      </Popover>
    </div>
  );
};

export default PopoverButton;
