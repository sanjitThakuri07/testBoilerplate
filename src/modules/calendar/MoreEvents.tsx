import { Avatar, Button, Divider, IconButton, Popover } from "@mui/material";
import React from "react";
import LoginIcon from "@mui/icons-material/Login";
import BasicCard from "components/CalendarInfo";
import AddEvent from "./event/AddEvent";
import moment from "moment";
import { permissionList } from "src/constants/permission";

interface MoreEventsProps {
  setShowMore: (value: boolean) => void;
  setDayEventList: (value: any) => void;
  dayEventList: any;
  handleCardClick: (value: any) => void;

  eventDate?: string;
  eventId?: number;
  setEventId?: any;
  setShowDeleteConfirmationModal?: any;
  permissions?: any;
}

const MoreEvents = ({
  setShowMore,
  setDayEventList,
  dayEventList,
  handleCardClick,
  eventDate,
  setShowDeleteConfirmationModal,
  eventId,
  setEventId,
  permissions,
}: MoreEventsProps) => {
  const [eventData, setEventData] = React.useState<any>([]);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [eventModal, setEventModal] = React.useState<boolean>(false);
  // const [eventId, setEventId] = React.useState<number>(0);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleButtonClick = (button_type: any) => {
    let target = button_type?.target.innerHTML as string;
    switch (target as string) {
      case "View Activity":
        alert("ivity");
        break;

      case "Visit Template":
        alert("Visit Template");
        break;

      case "Start Inspection":
        alert("Start Inspection");
        break;

      case "View Template":
        alert("View Template");
        break;

      case "Generate Report":
        alert("Generate Report");
        break;

      case "View Booking":
        alert("View Booking");
        break;

      case "View Event":
        setEventId(eventData.id);
        break;

      default:
        break;
    }
  };

  return (
    <div>
      <div
        className="calendar_show_more"
        style={{
          height: "67.6vh",
        }}
      >
        <div className="calendar_show_more_header">
          <div className="calendar_show_more_header_left">
            {moment(eventDate).format("dddd")}
            <div className="calendar_show_more_date">
              {moment(eventDate).format("MMMM D, YYYY")}
            </div>
          </div>
          <div className="calendar_show_more_header_right">
            <IconButton
              onClick={() => {
                setShowMore(false);
                setDayEventList([]);
              }}
            >
              <LoginIcon />
            </IconButton>
          </div>
        </div>
        <Divider
          variant="middle"
          style={{
            margin: "15px 0px",
          }}
        />

        <div className="calendar_show_more_card_container">
          {dayEventList.map((event: any, index: number) => (
            <>
              <span aria-describedby={id} onClick={handleClick}>
                <div
                  onClick={() => {
                    handleCardClick(event);
                    setEventData(event);
                  }}
                  key={index}
                  className="calendar_show_more_card"
                  style={{
                    backgroundColor: "#3677a36e",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: () => {
                        if (event?.type === "Event") {
                          return "orange";
                        } else if (event?.type === "Inspection") {
                          return "blue";
                        }
                        if (event?.type === "Activity") {
                          return "green";
                        }
                        if (event?.type === "Template") {
                          return "purple";
                        }
                        if (event?.type === "Bookings") {
                          return "#ea7a3d";
                        }
                        return "red";
                      },
                    }}
                  >
                    {event?.type === "Event"
                      ? "E"
                      : event?.type === "Inspection"
                      ? "I"
                      : event?.type === "Activity"
                      ? "A"
                      : event?.type === "Template"
                      ? "F"
                      : event?.type === "Bookings"
                      ? "B"
                      : "R"}
                  </Avatar>
                  <div
                    className="calendar_show_more_card_right"
                    style={{
                      marginLeft: "12px",
                    }}
                  >
                    <div
                      className="calendar_show_more_card_title"
                      style={{
                        color: "#3677A3",
                      }}
                    >
                      {event.type === "Bookings" ? event.booking_id : event.title || event.name}
                    </div>
                    <div
                      className="calendar_show_more_card_time"
                      style={{
                        color: "#3677A3",
                      }}
                    >
                      {new Date(event.start_date).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}{" "}
                      -{" "}
                      {new Date(event.end_date).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </div>
                  </div>
                </div>
              </span>
            </>
          ))}
        </div>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          className="calendar_popover"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <BasicCard
            id={eventData.id}
            title={eventData.title}
            status={eventData.status}
            name={eventData.name}
            handleButtonClick={() => handleButtonClick}
            description={eventData.description}
            start_time={eventData.start_date}
            end_time={eventData.start_time}
            handleCardClick={handleCardClick}
            inspectionType={eventData.inspection_type}
            inspectionId={eventData.inspection_type_id}
            viewEventWithModal={(id: number) => {
              setEventModal(true);
              setEventId(id);
            }}
            deleteEvent={(id: number) => {
              setShowDeleteConfirmationModal(true);
              setEventId(id);
            }}
            // viewEventWithModal={(event:any) => console.log(event, 'edebfjhebfebj')}
            eventType={eventData.type}
            // allDay={eventData.allDay}
            location={eventData.location}
            // buttonStatus={today >= startTime && today <= endTime ? false : true}
          />
        </Popover>
      </div>

      <AddEvent
        permissions={permissions}
        permission={permissionList.Event}
        openModal={eventModal}
        fetchData={() => {}}
        setOpenModal={() => {
          setEventModal(!eventModal);
        }}
        eventId={eventId}
      />
    </div>
  );
};

export default MoreEvents;
