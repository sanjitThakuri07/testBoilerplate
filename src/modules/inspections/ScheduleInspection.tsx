import BackButton from "src/components/buttons/back";
import {
  Breadcrumbs,
  Button,
  CircularProgress,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  Link,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Field, Formik, FormikProps } from "formik";
import React, { ChangeEvent, useState } from "react";
import { Link as Href, useNavigate, useParams } from "react-router-dom";
import DynamicSelectField from "src/modules/setting/profile/DynamicSelectField";
import * as yup from "yup";
import CustomSelectWithProfile from "src/components/CustomSelectWithProfile/CustomSelectWithProfile";
import NewCustomMultiSelect from "src/components/NewCustomMultiSelect/NewCustomMultiSelect";
import { IOSSwitch } from "src/components/switch/IosSwitch";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import Select from "react-select";
import { monthYearChoose, RepeatStatus, WeekDays } from "src/validationSchemas/EventSchema";
import makeAnimated from "react-select/animated";
import moment from "moment";
import { useSnackbar } from "notistack";
import FullPageLoader from "src/components/FullPageLoader";

interface ScheduleInspectionProps {
  template_id: number;
  location_id: number;
  assigned_to: string[];
  start_date: string;
  end_date: string;
  repeat_status: string;
  submit_after_due_date: boolean;
  repeat_days: string;
  repeat_weeks: any;
  repeat_months: string;
  repeat_year: string;
  custom_options: string;
  custom_selected_field: string;
  custom_selected_option: string;
  title?: string;
}

interface Option {
  label: string;
  value: string;
}

const animatedComponents = makeAnimated();

const ScheduleInspection = () => {
  const [initialValues, setInitialValues] = useState<ScheduleInspectionProps>({
    template_id: 0,
    location_id: 0,
    assigned_to: [],
    start_date: "",
    end_date: "",
    repeat_status: "",
    submit_after_due_date: false,
    repeat_days: "",
    repeat_weeks: [],
    repeat_months: "",
    repeat_year: "",

    custom_options: "",
    custom_selected_field: "",
    custom_selected_option: "",
    title: "",
  });
  const [loading, setLoading] = useState(false);
  const [configName, setConfigName] = useState({
    singular: "Templates",
    plural: "",
    pathname: "",
    parent_path: "template",
  });
  const [selectedVal, setSelected] = useState<string[]>([]);

  const [templateOptions, setTemplateOptions] = useState<any>([]);
  const [locationOptions, setLocationOptions] = useState<any>([]);
  const [customerOptions, setCustomerOptions] = useState<Option[]>([]);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { templateId, scheduleId } = useParams<any>();

  const getFilterOptions = async () => {
    if (scheduleId) {
      setLoading(true);
      const { status: statusSchedule, data: dataSchedule } = await getAPI(
        `template-schedule/get_template_schedule/${scheduleId}/`,
      );
      if (statusSchedule === 200) {
        setInitialValues(dataSchedule);
        setSelected(dataSchedule.assigned_to);
        initialValues.custom_selected_option = dataSchedule.repeat_weeks;
        // initialValues.repeat_weeks
        //   ? (initialValues.repeat_weeks = dataSchedule.custom_selected_option)
        //   : (initialValues.repeat_weeks = []);
        setLoading(false);
      }
    }

    const { status: statusTemplate, data: dataTemplate } = await getAPI("templates/dropdown");
    if (statusTemplate === 200) {
      setTemplateOptions(dataTemplate.map((item: any) => item));
    }

    const { status: statusLocation, data: dataLocation } = await getAPI("location/");
    if (statusLocation === 200) {
      setLocationOptions(
        dataLocation.items.map((item: any) => ({
          value: item.id,
          label: `${item?.location}-${item.city}`,
        })),
      );
    }

    const { status: statusCustomer, data: dataCustomer } = await getAPI("organization-user/");
    if (statusCustomer === 200) {
      setCustomerOptions(
        dataCustomer.items.map((item: any) => ({ value: item.id, label: item.full_name })),
      );
    }
  };

  React.useEffect(() => {
    getFilterOptions();
  }, []);

  const breadcrumbs = [
    <Link key="0" href="/">
      <img src="/src/assets/icons/home.svg" alt="home" />
    </Link>,
    <Link underline="hover" key="2" color="inherit">
      <Href
        style={{
          textDecoration: "none",
        }}
        to={`/${configName.parent_path}`}
      >
        {configName.singular}
      </Href>
    </Link>,
    <Typography key="3" color="text.primary">
      Schedule Inspection
    </Typography>,
  ];

  const validationSchema = yup.object().shape({
    template_id: yup.number().required("Template is required"),
    location_id: yup.number().required("Location is required"),
    // assigned_to: yup.array().min(1, 'At least one assignee is required'),
    // start_date: yup.date().required('Start Date is required'),
    // end_date: yup.date().required('End Date is required'),
  });

  let weekOptions: any = [];
  let monthOptions: any = [];

  const numberOptions = () => {
    for (let i = 0; i < 52; i += 1) {
      weekOptions.push({
        label: `${i + 1}`,
        value: `${i + 1}`,
      });
    }

    for (let i = 0; i < 12; i += 1) {
      monthOptions.push({
        label: `${i + 1}`,
        value: `${i + 1}`,
      });
    }
  };
  numberOptions();

  return (
    <div id="ScheduleInspection">
      {loading && <FullPageLoader></FullPageLoader>}
      <div
        className="ScheduleInspection_container"
        style={{
          padding: "20px",
        }}
      >
        <div
          className="header-block"
          style={{
            paddingLeft: "020px",
          }}
        >
          <BackButton />
          <div
            className="breadcrumbs-holder"
            style={{
              margin: "20px 0",
            }}
          >
            <Breadcrumbs
              separator={<img src="/src/assets/icons/chevron-right.svg" alt="right" />}
              aria-label="breadcrumb"
            >
              {breadcrumbs}
            </Breadcrumbs>
          </div>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            style={{
              marginTop: "20px",
            }}
          >
            <div className="left">
              <Typography variant="h3" color="primary">
                Schedule Inspection
              </Typography>
              <Typography variant="body1" component="p">
                You can schedule inspection ofor a smooth inspection
                {/* {configName.plural.toLowerCase()} here. */}
              </Typography>
            </div>
          </Stack>
        </div>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={async (values, formikHelpers) => {
            const { custom_options, ...rest } = values;

            // get todays date in utc format
            const today = moment().utc().format();

            if (selectedVal.length === 0) {
              enqueueSnackbar("At least one assignee is required", { variant: "error" });
              return;
            }

            const payload = {
              ...rest,
              template_id: templateId || values.template_id,
              assigned_to: selectedVal,
              repeat_weeks: values.custom_selected_option ? values.custom_selected_option : null,
              repeat_days: values.repeat_weeks ? values.repeat_weeks : null,
              repeat_months: values.custom_selected_option ? values.custom_selected_option : null,
              repeat_year: false,
              start_date: values.start_date ? moment(values.start_date).utc().format() : today,
              end_date: values.end_date ? moment(values.end_date).utc().format() : null,
            };

            if (scheduleId) {
              const { status: statusSchedule, data: dataSchedule } = await putAPI(
                `template-schedule/${scheduleId}/`,
                { ...payload, id: scheduleId },
              );
              if (statusSchedule === 200) {
                enqueueSnackbar(dataSchedule.message, { variant: "success" });
                navigate(-1);
              } else {
                enqueueSnackbar("Something went wrong", { variant: "error" });
              }
              return;
            } else {
              postAPI("/template-schedule/", payload)
                .then((res) => {
                  if (res.status === 200) {
                    enqueueSnackbar(res?.data.message, { variant: "success" });
                    formikHelpers.resetForm();
                    setSelected([]);
                    navigate(-1);
                  } else {
                    enqueueSnackbar("Something went wrong", { variant: "error" });
                  }
                })
                .catch((err) => {
                  enqueueSnackbar(err?.message, { variant: "error" });
                });
            }
          }}
        >
          {/* {(props: FormikProps<ScheduleInspection>) => { */}
          {(props) => {
            const {
              values,
              touched,
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isValid,
              dirty,
              isSubmitting,
              setFieldValue,
              setFieldTouched,
            } = props;

            const handleSwitchChange = (ev: ChangeEvent<HTMLInputElement>): void => {
              const name = ev.target.name;
              const status = ev.target.checked;
              setFieldValue(name, status);
              setFieldTouched(name);
            };

            return (
              <form className="region-form" onSubmit={handleSubmit}>
                {loading && <CircularProgress className="page-loader" />}
                <div className="region-fieldset">
                  <Grid container spacing={1} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="name">
                        <div className="label-heading">
                          Forms <sup>*</sup>
                        </div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={8}>
                      <FormGroup className="input-holder">
                        <DynamicSelectField
                          isViewOnly={false}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          handleSelectTouch={() => setFieldTouched("template_id", true)}
                          id="template_id"
                          menuOptions={templateOptions}
                          value={templateId || values.template_id}
                          error={errors.template_id}
                          touched={touched.template_id}
                        />
                      </FormGroup>
                    </Grid>
                  </Grid>
                  <Grid container spacing={1} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="location">
                        <div className="label-heading">Location</div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={8}>
                      <FormGroup className="input-holder">
                        <DynamicSelectField
                          isViewOnly={false}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          handleSelectTouch={() => setFieldTouched("location_id", true)}
                          id="location_id"
                          menuOptions={locationOptions}
                          value={values.location_id}
                          error={errors.location_id}
                          touched={touched.location_id}
                        />
                      </FormGroup>
                    </Grid>
                  </Grid>

                  <Grid container spacing={1} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="assigned_to">
                        <div className="label-heading">Assigned to</div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={8}>
                      <NewCustomMultiSelect
                        selected={selectedVal}
                        menuOptions={customerOptions}
                        setSelected={setSelected}
                        menuLabel="All users"
                        labelKey="label"
                        valueKey="value"
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={1} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="assigned_to">
                        <div className="label-heading">How often</div>
                        <p>First Schedule will start on 23rd March, 2023</p>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={3}>
                      <FormGroup className="input-holder">
                        <DynamicSelectField
                          isViewOnly={false}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          handleSelectTouch={() => setFieldTouched("repeat_status", true)}
                          id="repeat_status"
                          menuOptions={RepeatStatus}
                          value={values.repeat_status}
                          error={errors.repeat_status}
                          touched={touched.repeat_status}
                        />
                      </FormGroup>
                    </Grid>
                    <Grid item xs={2.5}>
                      <FormGroup className="input-holder">
                        {/* <DynamicSelectField
                          isViewOnly={false}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          handleSelectTouch={() => setFieldTouched('template_id', true)}
                          id="template_id"
                          menuOptions={TemplateOptions}
                          value={values.template_id}
                          error={errors.template_id}
                          touched={touched.template_id}
                        /> */}

                        {values.repeat_status === "custom" ? (
                          <>
                            <DynamicSelectField
                              isViewOnly={false}
                              handleChange={handleChange}
                              handleBlur={handleBlur}
                              handleSelectTouch={() =>
                                setFieldTouched("custom_selected_field", true)
                              }
                              id="custom_selected_field"
                              menuOptions={monthYearChoose}
                              value={values.custom_selected_field}
                              error={errors.custom_selected_field}
                              touched={touched.custom_selected_field}
                            />
                          </>
                        ) : (
                          <>
                            <Field
                              as={TextField}
                              name="start_date"
                              id="start_date"
                              type="datetime-local"
                              size="small"
                              data-testid="start_date"
                              fullWidth
                              autoComplete="off"
                              value={values?.start_date || ""}
                              error={errors?.start_date && touched?.start_date ? true : false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />

                            {errors?.start_date && touched?.start_date && (
                              <div className="input-feedback" style={{ color: "red" }}>
                                {errors?.start_date}
                              </div>
                            )}
                          </>
                        )}
                      </FormGroup>
                    </Grid>

                    <Grid item xs={2.5}>
                      <FormGroup className="input-holder">
                        {values.repeat_status === "custom" ? (
                          <>
                            <DynamicSelectField
                              isViewOnly={false}
                              handleChange={handleChange}
                              handleBlur={handleBlur}
                              handleSelectTouch={() =>
                                setFieldTouched("custom_selected_option", true)
                              }
                              id="custom_selected_option"
                              menuOptions={
                                values.custom_selected_field === "week" ? weekOptions : monthOptions
                              }
                              value={values.custom_selected_option}
                              error={errors.custom_selected_option}
                              touched={touched.custom_selected_option}
                            />
                          </>
                        ) : (
                          <>
                            <Field
                              as={TextField}
                              name="end_date"
                              id="end_date"
                              type="datetime-local"
                              placeholder="Enter here"
                              size="small"
                              data-testid="end_date"
                              fullWidth
                              autoComplete="off"
                              inputProps={{
                                min: values?.start_date || "",
                              }}
                              value={values?.end_date || ""}
                              error={errors?.end_date && touched?.end_date ? true : false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />

                            {errors?.end_date && touched?.end_date && (
                              <div className="input-feedback" style={{ color: "red" }}>
                                {errors?.end_date}
                              </div>
                            )}
                          </>
                        )}
                      </FormGroup>
                    </Grid>

                    {values.custom_selected_field === "week" && (
                      <>
                        <Grid item xs={4}></Grid>
                        <Grid item xs={8}>
                          <div
                            style={{
                              width: "100%",
                            }}
                          >
                            <Select
                              name="repeat_weeks"
                              onChange={(e: any) => {
                                setFieldValue(
                                  "repeat_weeks",
                                  e.map((item: any) => item.value),
                                );
                              }}
                              theme={(theme) => ({
                                ...theme,
                                colors: {
                                  ...theme.colors,
                                  primary: "#33426a",
                                },
                              })}
                              defaultValue={values?.repeat_weeks}
                              closeMenuOnSelect={false}
                              components={animatedComponents}
                              isMulti
                              options={WeekDays}
                              isLoading={WeekDays.length === 0}
                            />
                          </div>
                        </Grid>
                      </>
                    )}

                    <Grid item xs={4}>
                      <InputLabel htmlFor="title">
                        <div className="label-heading  align__label">
                          Event title <sup>*</sup>
                        </div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={8}>
                      <Field
                        as={TextField}
                        name="title"
                        id="title"
                        type="text"
                        placeholder="Enter here"
                        size="small"
                        data-testid="title"
                        fullWidth
                        autoComplete="off"
                        value={values?.title || ""}
                        error={errors?.title && touched?.title ? true : false}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />

                      {errors?.title && touched?.title && (
                        <div className="input-feedback" style={{ color: "red" }}>
                          {errors?.title}
                        </div>
                      )}
                    </Grid>
                  </Grid>

                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="allow inspection">
                        <div className="label-heading">Allow Inspection</div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={8}>
                      <FormGroup className="input-holder">
                        <IOSSwitch
                          disableText
                          checked={values?.submit_after_due_date}
                          name="submit_after_due_date"
                          onChange={handleSwitchChange}
                        />
                      </FormGroup>
                    </Grid>
                  </Grid>
                </div>
                <div className="action-button-holder">
                  <Grid container spacing={2} justifyContent="flex-end">
                    <div className="add_another_btn">
                      <Grid item>
                        <Button variant="outlined">Clear all</Button>
                      </Grid>
                    </div>

                    <Grid item>
                      <Button
                        variant="contained"
                        type="submit"
                        disabled={!isValid || !dirty || isSubmitting}
                      >
                        {scheduleId ? "Update" : "Create"}
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default ScheduleInspection;
