import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment, { weekdays } from "moment";

import { deleteAPI, getAPI, postAPI } from "src/lib/axios";
import CalendarFilter from "./CalendarFilter";
import { Button, CircularProgress, Fade, Grid } from "@mui/material";
import { ICalendarFilter } from "src/interfaces/calendarFilter";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import PopoverButton from "./Buttons/PopoverButton";
import FullPageLoader from "src/components/FullPageLoader";

import MoreEvents from "./MoreEvents";
import AddEvent from "./event/AddEvent";
import { WeekDaysObj } from "src/validationSchemas/EventSchema";
import { useSnackbar } from "notistack";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import ReactSelect from "src/components/ReactSelect/ReactSelect";
import { useCalendarFilter } from "src/store/zustand/globalStates/calendarFilter";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { usePermissionStore } from "src/store/zustand/permission";
import { permissionList } from "src/constants/permission";
import { checkPermission } from "src/utils/permission";
import { queryMaker } from "src/utils/keyFunction";

const localizer = momentLocalizer(moment);

const CoreCalendar = () => {
  const initialData: ICalendarFilter = {
    country: [],
    region: [],
    location: [],
    customer: [],
    activity_status: [],
    inspection: [],
    inspection_type: [],
    inspection_status: [],
    territory: [],
    booking_status: [],
    display_options: [],
    start_date: moment().startOf("month").format("YYYY-MM-DD"),
    end_date: moment().endOf("month").format("YYYY-MM-DD"),
  };
  const { permissions } = usePermissionStore();

  const [eventList, setEventList] = React.useState([]);
  const [dayEventList, setDayEventList] = React.useState([]);
  const [eventDate, setEventDate] = React.useState("");
  const [initialValues, setInitialValues] = React.useState<ICalendarFilter>(initialData);

  const [selectedTab, setSelectedTab] = React.useState<number>(0);
  const [selecetedView, setSelecetedView] = React.useState<string>("month");
  const [showMore, setShowMore] = React.useState<boolean>(false);
  const [checked, setChecked] = React.useState(false);
  const [eventModal, setEventModal] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [eventId, setEventId] = React.useState<number>(0);
  const [selectedFilter, setSelectedFilter] = React.useState<number>(0);
  const [deleteFilterId, setDeleteFilterId] = React.useState<number>(0);
  const [filterData, setFilterData] = React.useState<any>([]);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    React.useState<boolean>(false);

  const [clearData, setClearData] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { setFilterName, setFilterFields, setFilterId } = useCalendarFilter();

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  const handleTabChange = (event: any, newValue: number) => {
    setSelectedTab(newValue);
  };

  const fetchCalendarData = (filter: any) => {
    setLoading(true);

    const params = queryMaker(filter);

    getAPI(`calendar/?${params}${selectedTab === 1 ? "&my_schedule=true" : ""}`)
      .then((res) => {
        if (res.status === 200) {
          setEventList(
            res.data.map((item: any) => ({
              ...item,

              title: item.title || item.name,
              start_date: moment(item.start_date).toDate(),
              end_date: moment(item.end_date).toDate(),
            })),
          );

          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const formats = {
    weekdayFormat: (date: any, culture: any, localizer: any) =>
      localizer.format(date, "dddd", culture),
  };

  const deleteEvent = () => {
    let deletePayload = {
      config_ids: [eventId],
    };
    deleteAPI(`calendar/`, deletePayload)
      .then((res) => {
        if (res.status === 200) {
          enqueueSnackbar(res?.data?.message, {
            variant: "success",
          });
          setShowDeleteConfirmationModal(false);
          fetchDataWithStateValues();
        }
      })
      .catch((err) => {
        enqueueSnackbar(err?.response?.data?.detail?.message || "Something went wrong!", {
          variant: "error",
        });
      });
  };

  const CustomEvent = (event: any) => {
    return (
      <PopoverButton
        events={event}
        viewEventWithModal={(id: number) => {
          setEventModal(true);
          setEventId(id);
        }}
        deleteEvent={(id: number) => {
          setShowDeleteConfirmationModal(true);
          // deleteEvent(id);

          setEventId(id);
        }}
      />
    );
  };

  const handleSelectFilter = () => {
    if (selectedFilter === null) {
      setInitialValues(initialData);
      return;
    } else if (selectedFilter) {
      setLoading(true);
      getAPI(`calendar-filter/${selectedFilter}/`)
        .then((res) => {
          if (res.status === 200) {
            setChecked(true);

            setInitialValues(res?.data.fields);
            setFilterFields(res?.data.fields);
            setFilterName(res?.data.name);
            setFilterId(res?.data.id);
            setLoading(false);
          }
        })
        .catch((err) => {
          enqueueSnackbar(err?.response?.data?.detail?.message || "Something went wrong!", {
            variant: "error",
          });
        });
    }
  };

  React.useEffect(() => {
    handleSelectFilter();
  }, [selectedFilter]);

  const onNavigate = (date: any) => {
    const firstDay = moment(date).startOf("month").format("YYYY-MM-DD");
    const lastDay = moment(date).endOf("month").format("YYYY-MM-DD");
    setInitialValues((prev) => ({
      ...prev,
      start_date: firstDay,
      end_date: lastDay,
    }));
  };

  const fetchDataWithStateValues = () => {
    if (initialValues.start_date && initialValues.end_date) {
      fetchCalendarData(initialValues);
    }
  };

  React.useEffect(() => {
    fetchDataWithStateValues();
  }, [initialValues, selectedTab]);

  const handleDeleteFilter = () => {
    let payload = {
      config_ids: [deleteFilterId],
    };
    deleteAPI(`calendar-filter/`, payload)
      .then((res) => {
        if (res.status === 200) {
          enqueueSnackbar(res?.data?.message, {
            variant: "success",
          });
          setShowDeleteConfirmationModal(false);
          setDeleteFilterId(0);
          setSelectedFilter(0);
          setChecked(false);
          fetchFilterData();
          setInitialValues(initialValues);
          setFilterFields(initialValues);
          setFilterName("");
          setFilterId(0);
        }
      })
      .catch((err) => {
        enqueueSnackbar(err?.response?.data?.detail?.message || "Something went wrong!", {
          variant: "error",
        });
      });
  };

  const fetchFilterData = () => {
    let defaultValue = {
      value: null,
      label: "Select Filter",
      icon: null,
    };

    getAPI(`calendar-filter/`)
      .then((res) => {
        if (res.status === 200) {
          let filterOptions = res?.data?.items?.map((item: any) => ({
            value: item.id,
            label: item.name,
            icon: (
              <DeleteOutlinedIcon
                onClick={() => {
                  setDeleteFilterId(item.id);
                  setShowDeleteConfirmationModal(true);
                }}
                style={{
                  height: "20px",
                  width: "20px",
                  marginLeft: "7px",
                  cursor: "pointer",
                }}
              />
            ),
          }));
          setFilterData([defaultValue, ...filterOptions]);
        }
      })
      .catch((err) => {
        enqueueSnackbar(err?.response?.data?.detail?.message || "Something went wrong!", {
          variant: "error",
        });
      });
  };

  React.useEffect(() => {
    // checkPermission({
    //   permissions,
    //   permission: permissionList.EventFilter.view,
    // }) && fetchFilterData();
    fetchFilterData();
  }, []);

  return (
    <>
      <div
        id="CoreCalendar"
        style={{
          marginTop: "20px",
          height: "100%",
        }}
      >
        <div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}></div>

        <Grid container spacing={2}>
          <Grid item xs={checked ? 8 : showMore ? 8 : 12}>
            <div
              className="myCustomHeight"
              style={{
                height: "70vh",
              }}
            >
              <div className="calendar_header_btns">
                <div
                  className="calendar_header_btns_left"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant={selectedTab === 0 ? "contained" : "outlined"}
                    onClick={(e) => handleTabChange(e, 0)}
                    style={{
                      marginRight: "10px",
                    }}
                  >
                    All Schedules
                  </Button>
                  <Button
                    variant={selectedTab === 1 ? "contained" : "outlined"}
                    onClick={(e) => handleTabChange(e, 1)}
                  >
                    My Schedules
                  </Button>

                  {checkPermission({
                    permissions,
                    permission: permissionList.EventFilter.view,
                  }) ? (
                    <div
                      className="filter_select"
                      style={{
                        width: "220px",
                        marginLeft: "10px",
                      }}
                    >
                      <ReactSelect
                        onEdit={() => {
                          // alert('onEdit');
                        }}
                        permissions={permissions}
                        permission={permissionList.EventFilter}
                        onDelete={(e: number) => {
                          setDeleteFilterId(e);
                          setShowDeleteConfirmationModal(true);
                        }}
                        handleTypeSelect={(item: any) => {
                          setSelectedFilter(item.value);
                        }}
                        isClearable={false}
                        Options={filterData}
                        // value={selectedFilter}
                        value={
                          filterData?.find((item: any) => item.value === selectedFilter) ||
                          filterData[0]
                        }
                      />
                    </div>
                  ) : null}
                </div>

                <div className="calendar_header_btns_right">
                  <Button
                    variant="outlined"
                    onClick={handleChange}
                    style={{
                      marginRight: "10px",
                    }}
                  >
                    {checked ? (
                      <>
                        {" "}
                        <FilterListOffIcon />
                        Hide Filter{" "}
                      </>
                    ) : (
                      <>
                        <FilterListIcon />
                        Show Filter
                      </>
                    )}
                  </Button>

                  {checkPermission({
                    permissions,
                    permission: [permissionList.Event.add],
                  }) ? (
                    <Button
                      variant="contained"
                      endIcon={<InsertInvitationIcon />}
                      onClick={() => {
                        setEventId(0);
                        setEventModal(true);
                        setClearData(true);
                      }}
                    >
                      New Event
                    </Button>
                  ) : null}
                </div>
              </div>
              {loading && <FullPageLoader />}

              <Calendar
                localizer={localizer}
                events={eventList}
                components={{
                  event: CustomEvent,
                }}
                onNavigate={onNavigate}
                formats={formats}
                startAccessor="start_date"
                endAccessor="end_date"
                popop={false}
                onShowMore={(events: any, date: any) => {
                  setEventDate(date);
                  setShowMore(true);
                  setDayEventList(events);
                }}
                doShowMoreDrillDown={false}
                eventPropGetter={(event: any) => {
                  let newStyle = {
                    backgroundColor: "#3677a33b",
                    padding: "3px 3px",
                    color: "#3677A3",
                    borderRadius: "14px",
                  };

                  let today = new Date();

                  // if (event.type === 'holiday') {
                  //   newStyle.backgroundColor = '#283452';
                  // }

                  //  previous date
                  if (event.end_date < today) {
                    newStyle.backgroundColor = "rgb(220 149 18 / 29%)";
                    newStyle.color = "#B54708";
                  }

                  // upcoming date
                  if (event.start_date > today) {
                    newStyle.backgroundColor = "rgb(9 216 94 / 24%)";
                    newStyle.color = "#027A48";
                  }

                  if (event?.status === "Completed") {
                    newStyle.backgroundColor = "rgb(13 104 3)";
                    newStyle.color = "rgb(255 255 255)";
                  }
                  if (event?.status === "Due") {
                    newStyle.backgroundColor = "rgb(220 18 18 / 85%)";
                    newStyle.color = "rgb(255 255 255)";
                  }
                  if (event?.status === "In Progress") {
                    newStyle.backgroundColor = "rgb(4 28 209 / 85%)";
                    newStyle.color = "rgb(255 255 255)";
                  }

                  return {
                    className: "",
                    style: newStyle,
                  };
                }}
              />
            </div>
          </Grid>

          {showMore ? (
            <Fade in={true} timeout={500}>
              <Grid item xs={showMore ? 4 : 0}>
                <MoreEvents
                  permissions={permissions}
                  handleCardClick={(e) => console.log(e, "deded34")}
                  setShowMore={setShowMore}
                  setDayEventList={setDayEventList}
                  dayEventList={dayEventList}
                  eventDate={eventDate}
                  setShowDeleteConfirmationModal={setShowDeleteConfirmationModal}
                  setEventId={setEventId}
                  eventId={eventId}
                />
              </Grid>
            </Fade>
          ) : (
            <Fade in={checked} timeout={500}>
              <Grid
                item
                xs={checked ? 4 : 0}
                style={{
                  display: checked ? "block" : "none",
                }}
              >
                <CalendarFilter
                  initialValues={initialValues}
                  setInitialValues={setInitialValues}
                  submitCalendarFilter={(e: any) => {
                    fetchCalendarData(e);
                  }}
                  isFilterFetched={checked}
                  fetchFilterData={fetchFilterData}
                  // handleSaveFilter={(filter: any) => {
                  //   handleSaveFilter(filter);
                  // }}
                />
              </Grid>
            </Fade>
          )}
        </Grid>

        <ConfirmationModal
          openModal={showDeleteConfirmationModal}
          setOpenModal={() => setShowDeleteConfirmationModal(!showDeleteConfirmationModal)}
          handelConfirmation={() => {
            deleteFilterId !== 0 ? handleDeleteFilter() : deleteEvent();
          }}
          confirmationHeading={`Do you want to delete this ${
            deleteFilterId !== 0 ? "filter" : "event"
          }  ?`}
          confirmationDesc={`This will delete the ${
            deleteFilterId !== 0 ? "filter" : "event"
          } permanently.`}
          status="warning"
          confirmationIcon="src/assets/icons/icon-feature.svg"
          // loader={deleteLoading}
        />

        <AddEvent
          permissions={permissions}
          permission={permissionList.Event}
          openModal={eventModal}
          clearObj={{ clearData, setClearData }}
          fetchData={() => {
            setEventId(0);
            fetchDataWithStateValues();
          }}
          setOpenModal={() => {
            setEventModal(!eventModal);
          }}
          eventId={eventId}
        />
      </div>
    </>
  );
};

export default CoreCalendar;
