import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import ModalLayout from "src/components/ModalLayout";
import { Field, Formik, FormikProps } from "formik";
import React, { useRef, ChangeEvent, useEffect } from "react";
import "./AddEvent.scss";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { deleteAPI, getAPI, postAPI, putAPI } from "src/lib/axios";
import EmailTextEditor from "src/components/TextEditor/EmailTextEditor";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import ButtonLoaderSpinner from "src/components/ButtonLoaderSpinner/ButtonLoaderSpinner";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import {
  DaysInMonth,
  EventValidation,
  RepeatOptions,
  WeekDays,
} from "validationSchemas/EventSchema";
import CreatableSelect from "react-select/creatable";
import moment from "moment";
import FullPageLoader from "src/components/FullPageLoader";
import { checkPermission } from "src/utils/permission";
import TextEditor from "src/components/MyTextEditor/MyEditor";

interface EventModalProps {
  openModal: boolean;
  setOpenModal: () => void;
  eventId?: number;
  fetchData: () => void;
  permissions?: any;
  permission?: any;
  clearObj?: any;
  // resetValues: () => void;
}

interface EventFormProps {
  id?: number;
  title: string;
  type: string;
  location: any;
  start_date: string;
  end_date: string;
  description: string;
  attendees?: any;
  attachments?: any;
  repeat_status?: string;
  repeat_start_date?: string;
  repeat_end_date?: string;
  repeat_every?: any;
  repeat_days?: any;
  repeat_weeks?: any;
  repeat_months?: any;
  repeat_year?: boolean;
  repeat_every_weeks_number?: any;
  repeat_months_date?: any;
  content: string;
}

const animatedComponents = makeAnimated();

function base64toBlob(base64Data: string) {
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: "application/pdf" });
}

const AddEvent = ({
  openModal,
  setOpenModal,
  eventId,
  fetchData,
  permissions,
  permission,
  clearObj,
}: // resetValues,
EventModalProps) => {
  const [locationOptions, setLocationOptions] = React.useState<{ label: string; value: string }[]>(
    [],
  );
  const [customerOptions, setCustomerOptions] = React.useState<{ label: string; value: string }[]>(
    [],
  );

  const [openRepeatForm, setOpenRepeatForm] = React.useState<boolean>(false);

  const [contentState, setContentState] = React.useState<string | null>(null);
  const [collectionOfBackendFields, setCollectionOfBackendFields] = React.useState<any>([]);
  const [backendTags, setBackEndTags] = React.useState([]);
  const [selectedText, setSelectedText] = React.useState("");
  const [fileList, setFileList] = React.useState([]);
  const [uploadedFiles, setUploadedFiles] = React.useState([]);
  const [base64, setBase64] = React.useState<Array<{}>>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isViewOnly, setIsViewOnly] = React.useState<boolean>(false);
  const [reinitializeEditor, setReinitializeEditor] = React.useState<boolean>(false);

  const [fileUploadLoading, setFileUploadLoading] = React.useState(false);

  const initialEventFormValues: EventFormProps = {
    id: 0,
    title: "",
    type: "",
    location: [],
    start_date: "",
    end_date: "",
    description: "",
    attendees: [],
    attachments: [],
    repeat_status: "no_repeat",
    repeat_start_date: "",
    repeat_end_date: "",
    repeat_every: "",
    repeat_days: [],
    repeat_weeks: null,
    repeat_months: null,
    repeat_year: false,
    repeat_every_weeks_number: null,
    repeat_months_date: [],
    content: "<p></p>\n",
  };

  const [initialValues, setInitialValues] = React.useState<EventFormProps>(initialEventFormValues);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const refContainer = useRef<HTMLDivElement>(null);
  const { enqueueSnackbar } = useSnackbar();

  const focusEditor = () => {
    return refContainer?.current?.focus();
  };

  useEffect(() => {
    if (!clearObj?.clearData) return;
    setInitialValues((prev: any) => ({
      ...initialEventFormValues,
      content: "<p></p>\n",
    }));
  }, [clearObj?.clearData]);

  const handleFileUpload = () => {
    const convertToBase64 = (file: any) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

    const convertFilesToBase64 = async (files: any) => {
      try {
        const base64Files = await Promise.all(
          Array.from(files).map(
            async (file: any) =>
              file.size / 1000 + " KB--" + file.name + ";" + (await convertToBase64(file)),
          ),
        );

        // setBase64(base64Files);
        setBase64((prev: any) => [...prev, ...base64Files]);
      } catch (error) {
        console.log(error);
      }
    };

    convertFilesToBase64(fileList);
  };

  const handleDeleteAttachment = (id: number) => {
    deleteAPI(`calendar/event-attachments/${eventId}/`, [id])
      .then((res) => {
        if (res.status === 200) {
          enqueueSnackbar(res?.data?.message, { variant: "success" });
        }
      })
      .catch((err) => {
        enqueueSnackbar("Something went wrong", { variant: "error" });
      });
  };

  React.useEffect(() => {
    if (fileList?.length > 0) handleFileUpload();
  }, [fileList]);

  const getFilterOptions = async () => {
    const { status: statusLocation, data: dataLocation } = await getAPI("location/");
    if (statusLocation === 200) {
      setLocationOptions(
        dataLocation.items.map((item: any) => ({
          value: item.id,
          label: item.location + " - " + item.city,
        })),
      );
    }

    const { status: statusCustomer, data: dataCustomer } = await getAPI("organization-user/");
    if (statusCustomer === 200) {
      setCustomerOptions(
        dataCustomer.items.map((item: any) => ({
          value: item.id,
          label: item.full_name,
        })),
      );
    }
  };

  React.useEffect(() => {
    getFilterOptions();
  }, []);

  React.useEffect(() => {
    setBase64([]);
    setIsViewOnly(false);
  }, [openModal]);

  React.useEffect(() => {
    if (eventId) {
      setIsViewOnly(true);
      setLoading(true);
      getAPI(`calendar/${eventId}`)
        .then((res) => {
          setContentState(res.data.description);
          setInitialValues({
            id: res.data.id,
            title: res.data.title,
            type: res.data.type,
            location: res.data.location,
            start_date: moment(res.data.start_date).format("YYYY-MM-DDTHH:mm:ss"),
            end_date: moment(res.data.end_date).format("YYYY-MM-DDTHH:mm:ss"),
            description: res.data.description,
            attendees: res.data.assigned_users,
            attachments: res.data.files,
            repeat_status: res.data.repeat_status,
            repeat_start_date: res.data.repeat_start_date
              ? moment(res.data.repeat_start_date).format("YYYY-MM-DDTHH:mm:ss")
              : "",
            repeat_end_date: res.data.repeat_end_date
              ? moment(res.data.repeat_end_date).format("YYYY-MM-DDTHH:mm:ss")
              : "",
            repeat_every: res.data.repeat_every,
            repeat_days: res.data.repeat_days,
            repeat_weeks: res.data.repeat_weeks,
            repeat_months: res.data.repeat_months,
            repeat_year: res.data.repeat_year,
            repeat_every_weeks_number: res.data.repeat_every_weeks_number,
            repeat_months_date: res.data.repeat_months_date,
            content: res.data.description,
          });
          setLoading(false);
        })
        .then(() => {
          setReinitializeEditor(true);
        })

        .catch((err) => {
          setLoading(false);
          enqueueSnackbar("Something went wrong", { variant: "error" });
        });
    } else {
      setContentState(null);
      setBase64([]);
      setInitialValues(initialEventFormValues);
      setInitialValues((prev) => ({ ...prev, content: "<p></p>\n" }));
    }
  }, [eventId]);

  const handleSubmit = async (values: EventFormProps, actions: any) => {
    let internal_location: number[] = [];
    let location: string[] = [];
    values.location.forEach((value: any) => {
      if (typeof value === "number") {
        internal_location.push(value);
      } else if (typeof value === "string") {
        location.push(value);
      } else if (typeof value === "object" && value.value) {
        location.push(value.value);
      }
    });

    let internal_attendees: number[] = [];
    let attendees: string[] = [];
    values.attendees.forEach((value: any) => {
      if (typeof value === "number") {
        internal_attendees.push(value);
      } else if (typeof value === "string") {
        attendees.push(value);
      } else if (typeof value === "object" && value.value) {
        attendees.push(value.value);
      }
    });

    let payload = {
      ...values,
      attachments: base64,
      // description: contentState,
      description: values?.description,

      start_date: values.start_date,
      end_date: values.end_date,
      repeat_start_date: values.repeat_start_date,
      repeat_end_date: values.repeat_end_date,
      repeat_status: values.repeat_status || "no_repeat",
      repeat_days: values.repeat_status === "monthly" ? [] : values.repeat_days || [],
      repeat_weeks: values.repeat_status === "monthly" ? [] : values.repeat_weeks || null,
      location,
      internal_location,
      attendees,
      internal_attendees,
    };
    // console.log(payload, 'jirefcuier');
    // return;

    if (values.repeat_status === "yearly") {
      delete payload.repeat_days;
      delete payload.repeat_weeks;
      delete payload.repeat_months;
      delete payload.repeat_every_weeks_number;
      delete payload.repeat_months_date;
      delete payload.repeat_every;
      delete payload.repeat_every_weeks_number;
    }

    if (values.repeat_status === "daily") {
      delete payload.repeat_year;
      delete payload.repeat_months;
      delete payload.repeat_every_weeks_number;
      delete payload.repeat_months_date;
      delete payload.repeat_weeks;
      delete payload.repeat_every;
    }

    if (values.repeat_status === "weekly") {
      delete payload.repeat_year;
      delete payload.repeat_months;
      delete payload.repeat_every_weeks_number;
      delete payload.repeat_months_date;
      delete payload.repeat_every_weeks_number;
    }

    if (values.repeat_status === "monthly") {
      delete payload.repeat_year;
      delete payload.repeat_days;
      delete payload.repeat_weeks;
      delete payload.repeat_every_weeks_number;
      delete payload.repeat_every;
    }

    // console.log(payload, 'payload');

    // return;

    if (eventId && values && !isViewOnly) {
      await putAPI(`calendar/${eventId}`, payload)
        .then((res) => {
          enqueueSnackbar(res?.data?.message, { variant: "success" });
          actions.setSubmitting(false);
          actions.resetForm();
          setOpenModal();
          fetchData();
          return res;
        })
        .catch((err) => {
          actions.setSubmitting(false);
          enqueueSnackbar(err?.response?.data?.detail?.message, {
            variant: "error",
          });
        });
    } else if (values) {
      await postAPI("/calendar/", payload)
        .then((res) => {
          enqueueSnackbar(res?.data?.message, { variant: "success" });
          actions.setSubmitting(false);
          actions.resetForm();
          setOpenModal();
          fetchData();
          return res;
        })
        .catch((err) => {
          actions.setSubmitting(false);
          enqueueSnackbar(err?.response?.data?.detail?.message, {
            variant: "error",
          });
        });
    }
  };

  return (
    <div id="AddEvent">
      <ModalLayout
        id="AddEventModal"
        large={true}
        children={
          <>
            <div
              className="config_modal_form_css user__department-field"
              style={{
                maxHeight: "calc(100vh - 70px)",
                overflow: "hidden auto",
              }}
            >
              <div className="config_modal_heading">
                <div className="config_modal_title">
                  {" "}
                  {eventId && !isViewOnly ? "Edit" : eventId ? "View" : "New"} Event
                </div>
                <div className="config_modal_text">
                  <div>
                    {eventId && !isViewOnly
                      ? "Edit Event details"
                      : eventId
                      ? "View event details"
                      : "Create a new event."}{" "}
                  </div>
                </div>
              </div>
              <Divider variant="middle" />

              <div
                className="event_form_coantainer"
                // style={{
                //   maxHeight: 'calc(100vh - 70px)',
                //   overflow: 'hidden auto',
                // }}
              >
                <Formik
                  key={"add event"}
                  enableReinitialize={true}
                  initialValues={initialValues}
                  onSubmit={(values, actions) => {
                    handleSubmit(values, actions);
                  }}
                  validationSchema={EventValidation}
                >
                  {(props: FormikProps<EventFormProps>) => {
                    const {
                      values,
                      touched,
                      errors,
                      handleBlur,
                      handleSubmit,
                      handleChange,
                      setFieldValue,
                      setFieldTouched,
                      isSubmitting,
                      resetForm,
                      initialTouched,
                    } = props;

                    const handleSwitchChange = (ev: ChangeEvent<HTMLInputElement>): void => {
                      const name = ev.target.name as keyof EventFormProps;
                      const status = ev.target.checked;
                      setFieldValue(name, status ? values.repeat_every : "no_repeat");
                      setFieldTouched(name);
                    };

                    return (
                      <>
                        <form className="event-form" onSubmit={handleSubmit}>
                          {loading && <FullPageLoader />}
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <InputLabel htmlFor="title">
                                <div className="label-heading  align__label">
                                  Event title <sup>*</sup>
                                </div>
                              </InputLabel>
                              <Field
                                as={TextField}
                                name="title"
                                disabled={isViewOnly}
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
                            <Grid item xs={5.5}>
                              <InputLabel htmlFor="start_date">
                                <div className="label-heading  align__label">
                                  Start Date <sup>*</sup>
                                </div>
                              </InputLabel>
                              <Field
                                as={TextField}
                                name="start_date"
                                id="start_date"
                                type="datetime-local"
                                placeholder="Enter here"
                                size="small"
                                data-testid="start_date"
                                fullWidth
                                disabled={isViewOnly}
                                autoComplete="off"
                                value={values?.start_date || ""}
                                error={errors?.start_date && touched?.start_date ? true : false}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                inputProps={{
                                  min: eventId ? "" : new Date().toISOString().slice(0, 16),
                                }}
                              />

                              {errors?.start_date && touched?.start_date && (
                                <div className="input-feedback" style={{ color: "red" }}>
                                  {errors?.start_date}
                                </div>
                              )}
                            </Grid>

                            <Grid item xs={5.5}>
                              <InputLabel htmlFor="end_date">
                                <div className="label-heading  align__label">
                                  End Date <sup>*</sup>
                                </div>
                              </InputLabel>
                              <Field
                                as={TextField}
                                name="end_date"
                                id="end_date"
                                type="datetime-local"
                                placeholder="Enter here"
                                size="small"
                                data-testid="end_date"
                                fullWidth
                                disabled={isViewOnly}
                                autoComplete="off"
                                value={values?.end_date || ""}
                                error={errors?.end_date && touched?.end_date ? true : false}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                inputProps={{
                                  min: values?.start_date || "",
                                }}
                              />

                              {errors?.end_date && touched?.end_date && (
                                <div className="input-feedback" style={{ color: "red" }}>
                                  {errors?.end_date}
                                </div>
                              )}
                            </Grid>

                            <Grid item xs={1}>
                              <InputLabel htmlFor="location">
                                <div className="label-heading  align__label"> &nbsp;</div>
                              </InputLabel>

                              <IconButton
                                aria-label="repeat-event-s-a-d-i-s-h"
                                onClick={() => setOpenRepeatForm(true)}
                                style={{
                                  marginTop: "-2px",
                                }}
                              >
                                <EventRepeatIcon />
                              </IconButton>
                            </Grid>

                            <Grid item xs={6}>
                              <InputLabel htmlFor="location">
                                <div className="label-heading  align__label">Location</div>
                              </InputLabel>

                              <CreatableSelect
                                name="location"
                                onChange={(e: any) => {
                                  setFieldValue(
                                    "location",
                                    e?.map((item: any) => item?.value),
                                  );
                                }}
                                onCreateOption={(newOption) => {
                                  const normalizedNewOption = newOption.trim(); // Normalize the new option value

                                  setFieldValue("location", [
                                    ...values?.location,
                                    normalizedNewOption,
                                  ]);
                                }}
                                theme={(theme) => ({
                                  ...theme,
                                  colors: {
                                    ...theme.colors,
                                    primary: "#33426a",
                                  },
                                })}
                                styles={{
                                  control: (baseStyles, state) => ({
                                    ...baseStyles,

                                    zIndex: "999",
                                  }),
                                  menu: (base) => ({
                                    ...base,
                                    zIndex: "999",
                                  }),
                                }}
                                value={[
                                  ...locationOptions.filter((option) =>
                                    values?.location?.includes(option.value),
                                  ),
                                  ...values?.location
                                    ?.filter((value: any) =>
                                      locationOptions.every((option) => option.value !== value),
                                    )
                                    .map((item: string) => {
                                      return { value: item, label: item };
                                    }),
                                ]}
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                isMulti
                                isDisabled={isViewOnly}
                                options={locationOptions}
                                isLoading={locationOptions.length === 0}
                              />
                              {errors?.location && touched?.location && (
                                <div className="input-feedback" style={{ color: "red" }}>
                                  {errors?.location.toString()}
                                </div>
                              )}
                            </Grid>

                            <Grid item xs={6}>
                              <InputLabel htmlFor="attendees">
                                <div className="label-heading  align__label">
                                  Attendees <sup>*</sup>
                                </div>
                              </InputLabel>

                              <CreatableSelect
                                name="attendees"
                                onChange={(e: any) => {
                                  setFieldValue(
                                    "attendees",
                                    e?.map((item: any) => item?.value),
                                  );
                                }}
                                onCreateOption={(newOption) => {
                                  const normalizedNewOption = newOption.trim(); // Normalize the new option value

                                  setFieldValue("attendees", [
                                    ...values?.attendees,
                                    normalizedNewOption,
                                  ]);
                                }}
                                theme={(theme) => ({
                                  ...theme,
                                  colors: {
                                    ...theme.colors,
                                    primary: "#33426a",
                                  },
                                })}
                                styles={{
                                  control: (baseStyles, state) => ({
                                    ...baseStyles,

                                    zIndex: "999",
                                  }),
                                  menu: (base) => ({
                                    ...base,
                                    zIndex: "999",
                                  }),
                                }}
                                isDisabled={isViewOnly}
                                value={[
                                  ...customerOptions.filter((option) =>
                                    values?.attendees?.includes(option.value),
                                  ),
                                  ...values?.attendees
                                    ?.filter((value: any) =>
                                      customerOptions.every((option) => option.value !== value),
                                    )
                                    .map((item: string) => {
                                      return { value: item, label: item };
                                    }),
                                ]}
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                isMulti
                                options={customerOptions}
                                isLoading={customerOptions.length === 0}
                              />

                              {errors?.attendees && touched?.attendees && (
                                <div className="input-feedback" style={{ color: "red" }}>
                                  {errors?.attendees.toString()}
                                </div>
                              )}
                            </Grid>

                            <Grid item xs={12}>
                              <InputLabel htmlFor="attendees">
                                <div className="label-heading  align__label">Description</div>
                              </InputLabel>
                              <div
                                className="event_editor_container"
                                style={{
                                  // minHeight: '100px',
                                  // border: '1px solid #D0D5DD',
                                  borderRadius: "4px",
                                  padding: "10px",
                                  margin: "7px 0",
                                  // maxHeight: '180px',
                                }}
                              >
                                {/* <EmailTextEditor
                                  setContentState={setContentState}
                                  selectOptionWhole={collectionOfBackendFields}
                                  selectedText={selectedText}
                                  setSelectedText={setSelectedText}
                                  setSelectOptionWhole={setCollectionOfBackendFields}
                                  backendFields={backendTags}
                                  templateHeight={true}
                                  contentValueState={contentState}
                                  values={values}
                                  simpleTextEditor={true}
                                  disabled={isViewOnly}
                                /> */}
                                <TextEditor
                                  name="description"
                                  disabled={isViewOnly}
                                  initialContent={values?.description}
                                  reinitialize={values.title} //to reinitialize the editor, when the title is changed  the editor is reinitialized
                                />
                              </div>

                              <div onClick={focusEditor} className="editor__content"></div>

                              <LoadingButton
                                // onClick={handleClick}
                                loadingPosition="end"
                                startIcon={<AttachFileIcon />}
                                loading={false}
                                style={{
                                  // borderRadius: '18px',
                                  minHeight: "33px",
                                }}
                                onClick={() => {
                                  inputRef.current?.click();
                                }}
                                variant="outlined"
                              >
                                <span>
                                  Add Attachment{" "}
                                  <span
                                    style={{
                                      color: "#D0D5DD",
                                    }}
                                  >
                                    {" "}
                                    (max. 15MB){" "}
                                  </span>{" "}
                                </span>
                                <input
                                  type="file"
                                  ref={inputRef}
                                  disabled={isViewOnly}
                                  style={{ display: "none" }}
                                  multiple
                                  onChange={(e: any) => {
                                    setFileList(e?.target?.files);
                                  }}
                                  max={10}
                                />
                              </LoadingButton>

                              {base64?.map((e, index) => {
                                return (
                                  <>
                                    <Chip
                                      key={index}
                                      style={{
                                        margin: "5px 5px 0 0",
                                      }}
                                      label={(e as string).split("--").pop()?.split(";")[0]}
                                      variant="outlined"
                                      onClick={() => {}}
                                      onDelete={() => {
                                        let filteredValues = base64.filter(
                                          (val: any, i: any) => i !== index,
                                        );
                                        setBase64(filteredValues);
                                      }}
                                    />
                                  </>
                                );
                              })}
                              {values?.attachments?.map((e: any, index: number) => {
                                return (
                                  <>
                                    {/* TODO */}
                                    <Chip
                                      key={index}
                                      style={{
                                        margin: "5px 5px 0 0",
                                      }}
                                      label={e.file.split("--").pop()}
                                      variant="outlined"
                                      onClick={() => {
                                        // delete base64[index];
                                        window.open(
                                          `${process.env.VITE_HOST_URL}/` + e.file,
                                          "_blank",
                                        );
                                      }}
                                      onDelete={() => {
                                        let filteredValues = values?.attachments?.filter(
                                          (val: any, i: any) => i !== index,
                                        );
                                        setFieldValue("attachments", filteredValues);
                                        handleDeleteAttachment(e.id);
                                      }}
                                    />
                                  </>
                                );
                              })}
                            </Grid>

                            <Grid item xs={12}>
                              {isViewOnly &&
                              checkPermission({
                                permissions,
                                permission: [permission?.edit],
                              }) ? (
                                <Button
                                  variant="contained"
                                  onClick={() => {
                                    setIsViewOnly(false);
                                    clearObj?.setClearData(false);
                                  }}
                                >
                                  Edit Event
                                </Button>
                              ) : null}

                              {!isViewOnly && (
                                <Button
                                  variant="contained"
                                  disabled={isSubmitting}
                                  type="submit"
                                  sx={{ width: "160px" }}
                                >
                                  {isSubmitting ? (
                                    <>
                                      {" "}
                                      Saving event &nbsp; <ButtonLoaderSpinner />{" "}
                                    </>
                                  ) : eventId ? (
                                    "Update"
                                  ) : (
                                    "Save"
                                  )}
                                </Button>
                              )}
                            </Grid>
                          </Grid>

                          <ModalLayout
                            id="RepeatEventModal"
                            large={false}
                            children={
                              <>
                                <div className="config_modal_form_css user__department-field">
                                  <div className="config_modal_heading">
                                    <div className="config_modal_title">Repeat Event</div>
                                    <div className="config_modal_text">
                                      <div>Here you can repeat this event.</div>
                                    </div>
                                  </div>
                                  <Divider variant="middle" />

                                  <div
                                    className="repeat_form"
                                    style={{
                                      marginTop: "10px",
                                      padding: "20px",
                                    }}
                                  >
                                    <Grid container spacing={2}>
                                      <>
                                        <Grid item xs={9}></Grid>
                                        <Grid item xs={6}>
                                          <InputLabel htmlFor="repeat_start_date">
                                            <div className="label-heading  align__label">
                                              Start Date <sup>*</sup>
                                            </div>
                                          </InputLabel>
                                          <Field
                                            as={TextField}
                                            name="start_date"
                                            disabled={isViewOnly}
                                            id="start_date"
                                            type="datetime-local"
                                            placeholder="Enter here"
                                            size="small"
                                            data-testid="start_date"
                                            fullWidth
                                            autoComplete="off"
                                            value={values?.start_date || ""}
                                            error={
                                              errors?.start_date && touched?.start_date
                                                ? true
                                                : false
                                            }
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                          />

                                          {errors?.start_date && touched?.start_date && (
                                            <div
                                              className="input-feedback"
                                              style={{ color: "red" }}
                                            >
                                              {errors?.start_date}
                                            </div>
                                          )}
                                        </Grid>
                                        <Grid item xs={6}>
                                          <InputLabel htmlFor="end_date">
                                            <div className="label-heading  align__label">
                                              End Date <sup>*</sup>
                                            </div>
                                          </InputLabel>
                                          <Field
                                            as={TextField}
                                            name="end_date"
                                            id="end_date"
                                            type="datetime-local"
                                            placeholder="Enter here"
                                            size="small"
                                            disabled={isViewOnly}
                                            data-testid="end_date"
                                            fullWidth
                                            autoComplete="off"
                                            value={values?.end_date || ""}
                                            error={
                                              errors?.end_date && touched?.end_date ? true : false
                                            }
                                            inputProps={{
                                              min: values?.start_date || "",
                                            }}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                          />

                                          {errors?.end_date && touched?.end_date && (
                                            <div
                                              className="input-feedback"
                                              style={{ color: "red" }}
                                            >
                                              {errors?.end_date}
                                            </div>
                                          )}
                                        </Grid>
                                        <Grid item xs={12}>
                                          <InputLabel htmlFor="repeat_every">
                                            <div className="label-heading  align__label">
                                              Repeat Every
                                            </div>
                                          </InputLabel>

                                          <Select
                                            name="repeat_status"
                                            onChange={(e: any) => {
                                              setFieldValue("repeat_status", e?.value);
                                            }}
                                            theme={(theme) => ({
                                              ...theme,
                                              colors: {
                                                ...theme.colors,
                                                primary: "#33426a",
                                              },
                                            })}
                                            value={{
                                              label: values?.repeat_status,
                                              value: values?.repeat_status,
                                            }}
                                            isDisabled={isViewOnly}
                                            closeMenuOnSelect={true}
                                            components={animatedComponents}
                                            options={RepeatOptions}
                                            isLoading={RepeatOptions.length === 0}
                                          />
                                          {errors?.repeat_status && touched?.repeat_status && (
                                            <div
                                              className="input-feedback"
                                              style={{ color: "red" }}
                                            >
                                              {errors?.repeat_status.toString()}
                                            </div>
                                          )}
                                        </Grid>

                                        {values?.repeat_status === "daily" && (
                                          <Grid item xs={12}>
                                            <InputLabel htmlFor="repeat_days">
                                              <div className="label-heading  align__label">
                                                Repeat Days
                                              </div>
                                            </InputLabel>

                                            <Select
                                              name="repeat_days"
                                              onChange={(e: any) => {
                                                setFieldValue(
                                                  "repeat_days",
                                                  e?.map((item: any) => item?.value),
                                                );
                                              }}
                                              theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                  ...theme.colors,
                                                  primary: "#33426a",
                                                },
                                              })}
                                              value={[
                                                ...WeekDays?.filter((item: any) =>
                                                  values?.repeat_days?.includes(item?.value),
                                                ),
                                              ]}
                                              isDisabled={isViewOnly}
                                              closeMenuOnSelect={false}
                                              components={animatedComponents}
                                              isMulti
                                              options={WeekDays}
                                              isLoading={WeekDays.length === 0}
                                            />

                                            {errors?.repeat_days && touched?.repeat_days && (
                                              <div
                                                className="input-feedback"
                                                style={{ color: "red" }}
                                              >
                                                {errors?.repeat_days.toString()}
                                              </div>
                                            )}
                                          </Grid>
                                        )}

                                        {values?.repeat_status === "weekly" && (
                                          <>
                                            <Grid item xs={3}>
                                              <InputLabel htmlFor="repeat_weeks">
                                                <div className="label-heading  align__label">
                                                  Repeat Every
                                                </div>
                                              </InputLabel>
                                              <div className="repeat_weeks">
                                                <TextField
                                                  name="repeat_weeks"
                                                  disabled={isViewOnly}
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                  value={values?.repeat_weeks}
                                                  className="repeat_weeks"
                                                  size="small"
                                                  style={{ width: "100%" }}
                                                  type="number"
                                                  inputProps={{
                                                    min: 1,
                                                    max: 52,
                                                  }}
                                                  InputProps={{
                                                    startAdornment: (
                                                      <InputAdornment position="start">
                                                        week
                                                      </InputAdornment>
                                                    ),
                                                  }}
                                                />
                                                week
                                              </div>
                                            </Grid>

                                            <Grid item xs={9}>
                                              <InputLabel htmlFor="repeat_days">
                                                <div className="label-heading  align__label">
                                                  Repeat On
                                                </div>
                                              </InputLabel>
                                              <Select
                                                name="repeat_days"
                                                onChange={(e: any) => {
                                                  setFieldValue(
                                                    "repeat_days",
                                                    e?.map((item: any) => item?.value),
                                                  );
                                                }}
                                                theme={(theme) => ({
                                                  ...theme,
                                                  colors: {
                                                    ...theme.colors,
                                                    primary: "#33426a",
                                                  },
                                                })}
                                                value={[
                                                  ...WeekDays?.filter((item: any) =>
                                                    values?.repeat_days?.includes(item?.value),
                                                  ),
                                                ]}
                                                isDisabled={isViewOnly}
                                                closeMenuOnSelect={false}
                                                components={animatedComponents}
                                                options={WeekDays}
                                                isMulti
                                                isLoading={WeekDays.length === 0}
                                              />
                                            </Grid>
                                          </>
                                        )}

                                        {values?.repeat_status === "monthly" && (
                                          <>
                                            <Grid item xs={6}>
                                              <InputLabel htmlFor="repeat_months">
                                                <div className="label-heading  align__label">
                                                  Repeat Every
                                                </div>
                                              </InputLabel>
                                              <Select
                                                name="repeat_months"
                                                onChange={(e: any) => {
                                                  setFieldValue("repeat_months", e?.value);
                                                }}
                                                theme={(theme) => ({
                                                  ...theme,
                                                  colors: {
                                                    ...theme.colors,
                                                    primary: "#33426a",
                                                  },
                                                })}
                                                value={{
                                                  label: values?.repeat_months,
                                                  value: values?.repeat_months,
                                                }}
                                                isDisabled={isViewOnly}
                                                closeMenuOnSelect={true}
                                                components={animatedComponents}
                                                options={DaysInMonth}
                                                isLoading={DaysInMonth.length === 0}
                                              />
                                              months
                                            </Grid>
                                            <Grid item xs={6}>
                                              <InputLabel htmlFor="repeat_months_date">
                                                <div className="label-heading  align__label">
                                                  Repeat On
                                                </div>
                                              </InputLabel>
                                              <Select
                                                name="repeat_months_date"
                                                onChange={(e: any) => {
                                                  setFieldValue(
                                                    "repeat_months_date",
                                                    e?.map((item: any) => item?.value),
                                                  );
                                                }}
                                                theme={(theme) => ({
                                                  ...theme,
                                                  colors: {
                                                    ...theme.colors,
                                                    primary: "#33426a",
                                                  },
                                                })}
                                                value={[
                                                  ...DaysInMonth?.filter(
                                                    (item: any) =>
                                                      values?.repeat_months_date?.includes(
                                                        item?.value,
                                                      ),
                                                    // .map((item: any) => {
                                                    //   return {
                                                    //     label: item?.label,
                                                    //     value: item?.value,
                                                    //   };
                                                    // }),
                                                  ),
                                                ]}
                                                isDisabled={isViewOnly}
                                                closeMenuOnSelect={false}
                                                components={animatedComponents}
                                                options={DaysInMonth}
                                                isMulti
                                                isLoading={DaysInMonth.length === 0}
                                              />
                                            </Grid>

                                            {/* <CustomMenuItem repeatEvent="month" /> */}
                                          </>
                                        )}
                                        {values?.repeat_status === "yearly" && (
                                          <>
                                            <Grid item xs={12}>
                                              <InputLabel htmlFor="repeat_year">
                                                <div className="label-heading  align__label">
                                                  Repeat Year on
                                                </div>
                                              </InputLabel>

                                              <Field
                                                as={TextField}
                                                name="repeat_year"
                                                id="repeat_year"
                                                type="date"
                                                placeholder="Enter here"
                                                size="small"
                                                disabled={isViewOnly}
                                                data-testid="repeat_year"
                                                fullWidth
                                                autoComplete="off"
                                                value={values?.repeat_year || ""}
                                                error={
                                                  errors?.repeat_year && touched?.repeat_year
                                                    ? true
                                                    : false
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                              />

                                              {errors?.repeat_year && touched?.repeat_year && (
                                                <div
                                                  className="input-feedback"
                                                  style={{ color: "red" }}
                                                >
                                                  {errors?.repeat_year}
                                                </div>
                                              )}
                                            </Grid>
                                          </>
                                        )}

                                        <Grid item xs={12}>
                                          <Button
                                            variant="contained"
                                            disabled={isViewOnly}
                                            onClick={() => {
                                              setOpenRepeatForm(false);
                                            }}
                                            style={{
                                              marginLeft: "10px",
                                            }}
                                          >
                                            {eventId ? "Update" : "Save"}
                                          </Button>

                                          <Button
                                            variant="outlined"
                                            onClick={() => {
                                              setOpenRepeatForm(false);
                                              setFieldValue("repeat_status", false);
                                            }}
                                          >
                                            Cancel
                                          </Button>
                                        </Grid>
                                      </>
                                    </Grid>
                                  </div>
                                </div>
                              </>
                            }
                            // openModal={openRepeatForm}
                            openModal={openRepeatForm}
                            setOpenModal={setOpenRepeatForm}
                          />
                        </form>
                      </>
                    );
                  }}
                </Formik>
              </div>
            </div>
          </>
        }
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </div>
  );
};

export default AddEvent;
