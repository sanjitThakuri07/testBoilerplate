import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";

import { useTemplateStore } from "src/store/zustand/templates/templateStore";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import { Alert, Tooltip } from "@mui/material";

import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ContentPasteSearchOutlinedIcon from "@mui/icons-material/ContentPasteSearchOutlined";
import { useInspectionStore } from "src/store/zustand/templates/inspectionStore";
import CalendarInspection from "src/modules/calendar/Inspection/CalendarInspection";

interface BasicCardProps {
  id: number;
  title: string;
  name: string;
  location: string;
  day?: string;
  start_time: Date;
  end_time: Date;
  description: string;
  buttonStatus?: boolean;
  eventType?: string;
  viewEventWithModal?: any;
  handleButtonClick?: any;
  handleCardClick?: any;
  deleteEvent?: any;
  inspectionType?: number;
  status?: string;
  inspectors?: string[];
  contractors?: string[];
  inspectionId?: number;
}

const BasicCard = ({
  title,
  name,
  location,
  day,
  start_time,
  end_time,
  description,
  buttonStatus = true,
  eventType,
  viewEventWithModal,
  deleteEvent,
  id,

  status,
  inspectors,
  contractors,
  inspectionType,
  inspectionId,
}: // handleButtonClick,
BasicCardProps) => {
  const navigate = useNavigate();
  const [showInspections, setShowInspections] = React.useState(false);
  const { manageInspection, manageInspectionData }: any = useInspectionStore();
  // console.log(inspectionType, 'inspectionType');

  const { templates, getTemplates }: any = useTemplateStore();

  const handleButtonClick = (eventType: string) => {
    switch (eventType) {
      case "view_activity":
        navigate(`/assign-activities/view/${id}`);
        break;

      case "visit_template":
        navigate(`/template/inspection/${id}`);
        break;
      case "visit_inspection":
        navigate(`/inspections/view/${id}`);
        break;

      case "start_inspection":
        navigate(`/template/inspection/${id}`);
        break;

      case "view_template":
        navigate(`/template/view/${id}`);
        break;

      case "generate_report":
        navigate(`/inspections/report/${id}`);
        break;

      case "view_booking":
        navigate(`/bookings/all-bookings/view/${id}`);
        break;

      default:
        break;
    }
  };

  const fetchInspectionType = () => {
    getTemplates(inspectionId);
  };

  React.useEffect(() => {
    fetchInspectionType();
    // manageInspection({ id: id });
  }, [inspectionId]);

  return (
    <Card
      sx={{ width: `clamp(150px, 340px, 400px)`, cursor: "pointer" }}
      className="calendar__info-card"
    >
      <CardContent sx={{ padding: "24px 24px 8px" }}>
        <Typography sx={{ fontSize: 16, fontWeight: "normal" }} color="primary">
          {title || name}
        </Typography>
        <Typography sx={{ mb: 1.5, color: "#151522" }} color="text.secondary">
          {/* {name} */}
        </Typography>

        <div className="calendar__block-content">
          {[
            { title: "Day", info: `${moment(start_time).format("Do dddd[,] YYYY")}` },
            {
              title: "Time",
              info: `${moment(start_time).format("h:mm a")} - ${moment(end_time).format("h:mm a")}`,
            },
            {
              title: "Summary",
              info: description,
            },
          ].map((it: any) => {
            return (
              <div className="calendar__block-card" key={it.title} style={{ marginBottom: "16px" }}>
                <Typography sx={{}} color="#151522">
                  {it.title} :
                </Typography>
                <Typography color="#667085" className="text__overflow-row-ellipse">
                  <div dangerouslySetInnerHTML={{ __html: it.info }} />
                </Typography>
              </div>
            );
          })}
        </div>

        {eventType === "Bookings" && (
          <>
            {inspectors && inspectors.length > 0 && (
              <div className="calendar__block-card" style={{ marginBottom: "16px" }}>
                <Typography sx={{}} color="#151522">
                  <EngineeringOutlinedIcon /> Inspectors :
                </Typography>

                <Tooltip title={inspectors?.join(", ")} arrow>
                  <Typography color="#667085" className="text__overflow-row-ellipse">
                    {inspectors?.map((it: any, i) => {
                      return <span key={it}>{it + " "} </span>;
                    })}
                  </Typography>
                </Tooltip>
              </div>
            )}

            {contractors && contractors.length > 0 && (
              <div className="calendar__block-card" style={{ marginBottom: "16px" }}>
                <Typography sx={{}} color="#151522">
                  <EngineeringOutlinedIcon /> Contractors :
                </Typography>
                <Tooltip title={contractors?.join(", ")} arrow>
                  <Typography color="#667085" className="text__overflow-row-ellipse">
                    {contractors?.map((it: any) => {
                      return <div key={it}>{it + " "}</div>;
                    })}
                  </Typography>
                </Tooltip>
              </div>
            )}

            <div className="calendar__block-card" style={{ marginBottom: "16px" }}>
              <Typography sx={{}} color="#151522">
                <LocationOnOutlinedIcon /> Location :
              </Typography>
              <Tooltip title={location} arrow>
                <Typography color="#667085" className="text__overflow-row-ellipse">
                  {location}
                </Typography>
              </Tooltip>
            </div>

            <div className="calendar__block-card" style={{ marginBottom: "16px" }}>
              <Typography sx={{}} color="#151522">
                <ContentPasteSearchOutlinedIcon /> Inspection Type :
              </Typography>
              <Tooltip title={inspectionType} arrow>
                <Typography color="#667085" className="text__overflow-row-ellipse">
                  {inspectionType}
                </Typography>
              </Tooltip>
            </div>
          </>
        )}

        {!showInspections && templates?.items?.length === 0 && (
          <Alert
            style={{
              marginBottom: "16px",
              scale: "0.8",
            }}
            severity="warning"
          >
            No inspection found!
          </Alert>
        )}

        {showInspections && (
          <>
            <CalendarInspection ID={id} />
          </>
        )}

        {/* {showInspections &&
          templates &&
          templates?.items?.map((it: any) => {
            return (
              <div className="calendar__block-cardd" key={it.id} style={{ marginBottom: '16px' }}>
                <div
                  className="d-flex"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}>
                  <div className="left_item">
                    {it.name.length > 20 ? it.name.substring(0, 20) + '...' : it.name}
                  </div>
                  <div className="right_item">
                    {' '}
                    {status === 'Invoiced' ? (
                      <Button
                        variant="outlined"
                        endIcon={<PlayCircleOutlineOutlinedIcon />}
                        onClick={() => navigate(`/inspections/view/${it.id}?BOOKING_ID=${id}`)}>
                        View Inspection
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        endIcon={<PlayCircleOutlineOutlinedIcon />}
                        onClick={() => navigate(`/template/inspection/${it.id}?BOOKING_ID=${id}`)}>
                        Inspection
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })} */}
      </CardContent>

      {eventType === "Template" && (
        <CardActions className="default-actions__container">
          <Button
            variant="outlined"
            // disabled={buttonStatus}
            onClick={() => handleButtonClick("visit_inspection")}
          >
            Visit Inspection
          </Button>
          <Button
            variant="contained"
            disabled={buttonStatus}
            onClick={() => handleButtonClick("start_inspection")}
          >
            Start Inspection
          </Button>
        </CardActions>
      )}

      {eventType === "Inspection" && (
        <CardActions className="default-actions__container">
          <Button variant="outlined" onClick={() => handleButtonClick("visit_template")}>
            View Template
          </Button>
          <Button variant="contained" onClick={() => handleButtonClick("generate_report")}>
            Generate Report
          </Button>
        </CardActions>
      )}
      {eventType === "Bookings" && (
        <CardActions className="default-actions__container">
          <Button variant="outlined" onClick={() => handleButtonClick("view_booking")}>
            View Booking
          </Button>
          <Button
            startIcon={<ListAltOutlinedIcon />}
            variant="contained"
            disabled={
              (!showInspections && templates?.items?.length === 0) ||
              status === "Completed" ||
              status === "Invoiced"
            }
            onClick={() => setShowInspections(!showInspections)}
          >
            Inspections
          </Button>
        </CardActions>
      )}
      {eventType === "Activity" && (
        <CardActions className="default-actions__container">
          <Button variant="outlined" onClick={() => handleButtonClick("view_activity")}>
            View Activity
          </Button>
        </CardActions>
      )}
      {eventType === "Event" && (
        <CardActions className="default-actions__container">
          <Button variant="outlined" onClick={() => viewEventWithModal(id)}>
            View Event
          </Button>
          <Button variant="contained" color="error" onClick={() => deleteEvent(id)}>
            Delete Event
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default BasicCard;
