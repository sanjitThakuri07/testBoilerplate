import { Box, Button, Card, Divider, Grid, TextField } from "@mui/material";

import { getAPI, postAPI, putAPI } from "src/lib/axios";

import React from "react";

import Select from "react-select";

import makeAnimated from "react-select/animated";

import { Formik, FormikProps } from "formik";

import { ICalendarFilter } from "src/interfaces/calendarFilter";

import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";

import SaveIcon from "src/assets/icons/save_icon.svg";

import { useSnackbar } from "notistack";

import { useCalendarFilter } from "globalStates/calendarFilter";

import moment from "moment";

import { permissionList } from "src/constants/permission";

import { usePermissionStore } from "src/store/zustand/permission";

import { checkPermission } from "src/utils/permission";

import useCountryStore "src/store/zustand/generalSettings/country";

const animatedComponents = makeAnimated();

const CalendarFilter = ({
  initialValues,

  setInitialValues,

  submitCalendarFilter,

  fetchFilterData,

  isFilterFetched,
}: any) => {
  const { filterName, setFilterName, setFilterFields, setFilterId, filterFields, filterId } =
    useCalendarFilter();

  const [countryOptions, setCountryOptions] = React.useState([]);

  const [regionOptions, setRegionOptions] = React.useState([]);

  const [locationOptions, setLocationOptions] = React.useState([]);

  const [customerOptions, setCustomerOptions] = React.useState([]);

  const [activityOptions, setActivityOptions] = React.useState([]);

  const [inspectionOptions, setInspectionOptions] = React.useState([]);

  const [inspectionStatusOptions, setInspectionStatusOptions] = React.useState([]);
  const [bookingStatusOptions, setBookingStatusOptions] = React.useState([]);
  const [territoryOptions, setTerritoryOptions] = React.useState([]);

  const [newInitialValues, setNewInitialValues] = React.useState(initialValues);

  const [openFilterSavingModal, setOpenFilterSavingModal] = React.useState<boolean>(false);

  const [internalFilterName, setInternalFilterName] = React.useState<string>("");

  const [filterValue, setFilterValue] = React.useState<ICalendarFilter>(initialValues);

  const { permissions } = usePermissionStore();

  let initialFilterValue: ICalendarFilter = {
    country: [],

    region: [],

    location: [],

    customer: [],

    activity_status: [],

    inspection_status: [],

    inspection: [],

    territory: [],

    booking_status: [],

    display_options: [],

    start_date: moment().startOf("month").format("YYYY-MM-DD"),

    end_date: moment().endOf("month").format("YYYY-MM-DD"),
  };

  // const bookingStatusOptions = [
  //   { value: 'approved', label: 'Approved' },
  //   { value: 'cancelled', label: 'Cancelled' },
  //   { value: 'completed', label: 'Completed' },
  // ];

  const displayOptions = [
    { value: "activity", label: "Activity" },

    { value: "inspections", label: "Inspections" },

    { value: "bookings", label: "Bookings" },

    { value: "events", label: "Events" },
  ];

  const { enqueueSnackbar } = useSnackbar();

  // const { fetchCountrys, countrys }: any = useCountryStore();

  // const storeDataFetch = async () => {

  //   await fetchCountrys({});

  //   if (countrys.length > 0) {

  //     setCountryOptions(countrys.map((item: any) => ({ value: item.id, label: item.name })));

  //   }

  // };

  // React.useEffect(() => {

  //   storeDataFetch();

  // }, []);

  const getFilterOptions = async () => {
    const { status: statusCountry, data: dataCountry } = await getAPI("country/");

    if (statusCountry === 200) {
      setCountryOptions(
        dataCountry.items.map((item: any) => ({ value: item.id, label: item.name })),
      );
    }

    const { status: statusRegion, data: dataRegion } = await getAPI("region/");

    if (statusRegion === 200) {
      setRegionOptions(dataRegion.items.map((item: any) => ({ value: item.id, label: item.name })));
    }

    const { status: statusLocation, data: dataLocation } = await getAPI("location/");

    if (statusLocation === 200) {
      setLocationOptions(
        dataLocation.items.map((item: any) => ({ value: item.id, label: item.location })),
      );
    }

    const { status: statusCustomer, data: dataCustomer } = await getAPI("customers/");

    if (statusCustomer === 200) {
      setCustomerOptions(
        dataCustomer.items.map((item: any) => ({ value: item.id, label: item.organization_name })),
      );
    }

    const { status: statusActivity, data: dataActivity } = await getAPI("activity-status/");

    if (statusActivity === 200) {
      setActivityOptions(
        dataActivity.items.map((item: any) => ({ value: item.id, label: item.name })),
      );
    }

    const { status: statusInspectionStatus, data: dataInspectionStatus } = await getAPI(
      "inspection-status/",
    );

    if (statusInspectionStatus === 200) {
      setInspectionStatusOptions(
        dataInspectionStatus.items.map((item: any) => ({ value: item.id, label: item.name })),
      );
    }

    const { status: statusInspection, data: dataInspection } = await getAPI("inspection-name/");
    if (statusInspection === 200) {
      setInspectionOptions(
        dataInspection.items.map((item: any) => ({ value: item.id, label: item.name })),
      );
    }

    const { status: statusTerritory, data: dataTerritory } = await getAPI("territory/");

    if (statusTerritory === 200) {
      setTerritoryOptions(
        dataTerritory.items.map((item: any) => ({ value: item.id, label: item.name })),
      );
    }
    const { status: statusBooking, data: dataBooking } = await getAPI("booking-status/");
    if (statusTerritory === 200) {
      setBookingStatusOptions(
        dataBooking.items.map((item: any) => ({ value: item.id, label: item.name })),
      );
    }
  };

  React.useEffect(() => {
    // console.log('isFilterFetched', isFilterFetched);

    if (
      (isFilterFetched &&
        (countryOptions.length === 0 ||
          regionOptions.length === 0 ||
          locationOptions.length === 0 ||
          customerOptions.length === 0 ||
          activityOptions.length === 0 ||
          inspectionOptions.length === 0 ||
          territoryOptions.length === 0)) ||
      inspectionStatusOptions.length === 0
    )
      getFilterOptions();
  }, [isFilterFetched]);

  let appliedFilterCount = 0;

  for (const key in initialValues) {
    if (Array.isArray(initialValues[key]) && initialValues[key].length > 0) {
      appliedFilterCount++;
    }
  }

  const handleSaveFilter = () => {
    let payload = {
      name: internalFilterName || filterName,

      fields: filterValue,
    };

    if (filterName) {
      putAPI(`calendar-filter/${filterId}`, payload)
        .then((res) => {
          if (res.status === 200) {
            enqueueSnackbar(res?.data?.message, {
              variant: "success",
            });

            setOpenFilterSavingModal(false);

            fetchFilterData();
          }
        })

        .catch((err) => {
          enqueueSnackbar(err?.response?.data?.detail?.message || "Something went wrong!", {
            variant: "error",
          });
        });
    } else {
      postAPI("/calendar-filter/", [payload])
        .then((res) => {
          if (res.status === 200) {
            enqueueSnackbar(res?.data?.message, {
              variant: "success",
            });

            setOpenFilterSavingModal(false);

            fetchFilterData();
          }
        })

        .catch((err) => {
          enqueueSnackbar(err?.response?.data?.detail?.message || "Something went wrong!", {
            variant: "error",
          });
        });
    }
  };

  return (
    <div id="CalendarFilter">
      <Box>
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          // initialValues={newInitialValues}

          onSubmit={async (values, formikHelpers) => {
            submitCalendarFilter(values);
          }}
        >
          {(props: FormikProps<ICalendarFilter>) => {
            const { values, setFieldValue, submitForm, resetForm } = props;

            // eslint-disable-next-line react-hooks/rules-of-hooks
            React.useEffect(() => {
              setInitialValues(values);
            }, [values]);

            return (
              <>
                <Card sx={{ padding: "20px 10px", height: "100vh" }} variant="outlined">
                  <div className="filter_heading">
                    <div className="filter_heading_left">
                      <div className="filter_heading_left_title">Apply Filters</div>

                      <div className="filter_heading_left_text">{appliedFilterCount} applied</div>
                    </div>

                    <div className="filter_heading_right">
                      <Button
                        size="small"
                        type="button"
                        onClick={() => {
                          resetForm();

                          setInitialValues(initialFilterValue);
                        }}
                        sx={{
                          marginRight: "10px",
                        }}
                      >
                        Reset
                      </Button>

                      <Button size="small" variant="outlined" onClick={submitForm}>
                        Apply Filters
                      </Button>
                    </div>
                  </div>

                  <Divider
                    variant="middle"
                    sx={{
                      margin: "20px 0",
                    }}
                  />

                  <div className="filter_body">
                    <Grid container item spacing={2}>
                      <Grid item xs={12}>
                        <div className="custom_label">
                          <label htmlFor="display_options">Display Options</label>
                        </div>

                        <Select
                          name="display_options"
                          onChange={(e: any) => {
                            setFieldValue(
                              "display_options",

                              e.map((item: any) => item.value),
                            );
                          }}
                          // defaultValue={values.display_options}

                          closeMenuOnSelect={false}
                          theme={(theme) => ({
                            ...theme,

                            colors: {
                              ...theme.colors,

                              primary: "#33426a",
                            },
                          })}
                          value={displayOptions.filter((item: any) =>
                            values.display_options.includes(item.value),
                          )}
                          components={animatedComponents}
                          isMulti
                          options={displayOptions}
                          isLoading={displayOptions.length === 0}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <div className="custom_label">
                          <label htmlFor="customer">Customer</label>
                        </div>

                        <Select
                          name="customer"
                          onChange={(e: any) => {
                            setFieldValue(
                              "customer",

                              e.map((item: any) => item.value),
                            );
                          }}
                          value={customerOptions.filter((item: any) =>
                            values.customer.includes(item.value),
                          )}
                          closeMenuOnSelect={false}
                          theme={(theme) => ({
                            ...theme,

                            colors: {
                              ...theme.colors,

                              primary: "#33426a",
                            },
                          })}
                          components={animatedComponents}
                          isMulti
                          options={customerOptions}
                          isLoading={customerOptions.length === 0}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <div className="custom_label">
                          <label htmlFor="inspection_type">Inspection Type</label>
                        </div>

                        <Select
                          name="inspection_type"
                          onChange={(e: any) => {
                            setFieldValue(
                              "inspection_type",
                              e.map((item: any) => item.value),
                            );
                          }}
                          closeMenuOnSelect={false}
                          theme={(theme) => ({
                            ...theme,

                            colors: {
                              ...theme.colors,

                              primary: "#33426a",
                            },
                          })}
                          components={animatedComponents}
                          isMulti
                          value={inspectionOptions.filter((item: any) =>
                            values?.inspection_type.includes(item.value),
                          )}
                          options={inspectionOptions}
                          isLoading={inspectionOptions.length === 0}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <div className="custom_label">
                          <label htmlFor="inspection_status">Inspection Status</label>
                        </div>

                        <Select
                          name="inspection_status"
                          onChange={(e: any) => {
                            setFieldValue(
                              "inspection_status",

                              e.map((item: any) => item.value),
                            );
                          }}
                          value={inspectionStatusOptions.filter((item: any) =>
                            values.inspection_status.includes(item.value),
                          )}
                          closeMenuOnSelect={false}
                          theme={(theme) => ({
                            ...theme,

                            colors: {
                              ...theme.colors,

                              primary: "#33426a",
                            },
                          })}
                          components={animatedComponents}
                          isMulti
                          options={inspectionStatusOptions}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <div className="custom_label">
                          <label htmlFor="activity_status">Activity Status</label>
                        </div>

                        <Select
                          name="activity_status"
                          onChange={(e: any) => {
                            setFieldValue(
                              "activity_status",

                              e.map((item: any) => item.value),
                            );
                          }}
                          value={activityOptions.filter((item: any) =>
                            values.activity_status.includes(item.value),
                          )}
                          closeMenuOnSelect={false}
                          theme={(theme) => ({
                            ...theme,

                            colors: {
                              ...theme.colors,

                              primary: "#33426a",
                            },
                          })}
                          components={animatedComponents}
                          isMulti
                          options={activityOptions}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <div className="custom_label">
                          <label htmlFor="booking_status">Booking Status</label>
                        </div>

                        <Select
                          name="booking_status"
                          onChange={(e: any) => {
                            setFieldValue(
                              "booking_status",

                              e.map((item: any) => item.value),
                            );
                          }}
                          value={bookingStatusOptions.filter((item: any) =>
                            values.booking_status.includes(item.value),
                          )}
                          closeMenuOnSelect={false}
                          theme={(theme) => ({
                            ...theme,

                            colors: {
                              ...theme.colors,

                              primary: "#33426a",
                            },
                          })}
                          components={animatedComponents}
                          isMulti
                          options={bookingStatusOptions}
                          isLoading={bookingStatusOptions.length === 0}
                        />
                      </Grid>

                      {/* <Grid item xs={6}>
                        <div className="custom_label">
                          <label htmlFor="country">Region</label>
                        </div>

                        <Select
                          name="region"
                          onChange={(e: any) => {
                            setFieldValue(
                              'region',

                              e.map((item: any) => item.value),
                            );
                          }}
                          closeMenuOnSelect={false}
                          theme={(theme) => ({
                            ...theme,

                            colors: {
                              ...theme.colors,

                              primary: '#33426a',
                            },
                          })}
                          components={animatedComponents}
                          isMulti
                          options={regionOptions}
                          isLoading={regionOptions.length === 0}
                          value={regionOptions.filter((item: any) =>
                            values.region.includes(item.value),
                          )}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <div className="custom_label">
                          <label htmlFor="country">Country</label>
                        </div>

                        <Select
                          name="country"
                          onChange={(e: any) => {
                            setFieldValue(
                              'country',

                              e.map((item: any) => item.value),
                            );
                          }}
                          closeMenuOnSelect={false}
                          theme={(theme) => ({
                            ...theme,

                            colors: {
                              ...theme.colors,

                              primary: '#33426a',
                            },
                          })}
                          components={animatedComponents}
                          isMulti
                          options={countryOptions}
                          isLoading={countryOptions.length === 0}
                          value={countryOptions.filter((item: any) =>
                            values.country.includes(item.value),
                          )}
                        />
                      </Grid> */}
                      {/* <Grid item xs={6}>
                        <div className="custom_label">
                          <label htmlFor="territory">Territory</label>
                        </div>

                        <Select
                          name="territory"
                          onChange={(e: any) => {
                            setFieldValue(
                              'territory',

                              e.map((item: any) => item.value),
                            );
                          }}
                          closeMenuOnSelect={false}
                          theme={(theme) => ({
                            ...theme,

                            colors: {
                              ...theme.colors,

                              primary: '#33426a',
                            },
                          })}
                          components={animatedComponents}
                          isMulti
                          options={territoryOptions}
                          isLoading={territoryOptions.length === 0}
                          value={territoryOptions.filter((item: any) =>
                            values.territory.includes(item.value),
                          )}
                        />
                      </Grid> */}

                      <Grid item xs={6}>
                        <div className="custom_label">
                          <label htmlFor="location">Location</label>
                        </div>

                        <Select
                          name="location"
                          onChange={(e: any) => {
                            setFieldValue(
                              "location",

                              e.map((item: any) => item.value),
                            );
                          }}
                          value={locationOptions.filter((item: any) =>
                            values.location.includes(item.value),
                          )}
                          closeMenuOnSelect={false}
                          theme={(theme) => ({
                            ...theme,

                            colors: {
                              ...theme.colors,

                              primary: "#33426a",
                            },
                          })}
                          components={animatedComponents}
                          isMulti
                          options={locationOptions}
                          isLoading={locationOptions.length === 0}
                        />
                      </Grid>
                    </Grid>
                  </div>

                  {checkPermission({
                    permissions,

                    permission: [permissionList.EventFilter.add],
                  }) && filterName == "" ? (
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      disabled={appliedFilterCount === 0}
                      onClick={() => {
                        setOpenFilterSavingModal(true);

                        setFilterValue(values);
                      }}
                      style={{
                        margin: "20px 0",

                        marginBottom: "20px",
                      }}
                    >
                      {/* {filterName === '' ? 'Save Filter' : 'Update Filter'} */}
                      Save Filter
                    </Button>
                  ) : checkPermission({
                      permissions,

                      permission: [permissionList.EventFilter.edit],
                    }) ? (
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      disabled={appliedFilterCount === 0}
                      onClick={() => {
                        setOpenFilterSavingModal(true);

                        setFilterValue(values);
                      }}
                      style={{
                        margin: "20px 0",

                        marginBottom: "20px",
                      }}
                    >
                      {"Update Filter"}

                      {/* Save Filter */}
                    </Button>
                  ) : null}
                </Card>
              </>
            );
          }}
        </Formik>

        <ConfirmationModal
          openModal={openFilterSavingModal}
          setOpenModal={setOpenFilterSavingModal}
          confirmationIcon={SaveIcon}
          handelConfirmation={handleSaveFilter}
          confirmationHeading={`Do you want to ${filterName ? "update" : "save"}  this filter?`}
          confirmationDesc={`${
            filterName
              ? filterName + " filter will be updated."
              : "This filter will be saved for future use."
          }`}
          status={"Normal"}
          IsSingleBtn={false}
          children={
            <Box>
              <TextField
                fullWidth
                style={{
                  marginTop: "20px",
                }}
                defaultValue={filterName}
                label="Filter Name"
                onChange={(e) => setInternalFilterName(e.target.value)}
                variant="standard"
              />
            </Box>
          }
        />
      </Box>
    </div>
  );
};

export default CalendarFilter;
