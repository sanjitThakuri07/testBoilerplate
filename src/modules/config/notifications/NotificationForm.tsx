import React, { useState, useEffect } from "react";
import { Formik, FieldArray, Field, getIn } from "formik";
import {
  Button,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { IOSSwitch } from "src/components/switch/IosSwitch";
import MultiEmailAdd from "src/components/MultiEmail/MultiEmailAdd";
import { useNavigate, useParams } from "react-router-dom";
import { fetchApI, postApiData, putApiData } from "src/modules/apiRequest/apiRequest";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useSnackbar, SnackbarKey, SnackbarMessage, OptionsObject } from "notistack";
import EmailPopUpBox from "./EmailPopUpBox";
import { useAlertPopup } from "src/store/zustand/globalStates/alertPopup";
import FullPageLoader from "src/components/FullPageLoader/index";
import useNotificationConfigStore from "src/store/zustand/notification-config";

interface commonFieldProps {
  is_app?: boolean;
  email?: boolean;
  notification_email?: string[];
  email_subject?: string;
  email_content?: string;
  trigger_type?: string;
  perference_id?: number | null;
}

interface formValues {
  id?: any;
  name?: string;
  status?: string;
  common_fields: commonFieldProps[];
}

const resetInitialValue = {
  name: "",
  status: "Active",
  perference_id: null,
  common_fields: [
    {
      is_app: false,
      email: false,
      notification_email: [""],
      email_subject: "",
      email_content: "",
      trigger_type: "",
    },
  ],
};

const EmailOpenBox = ({
  parentFormik,
  values,
  index,
  setFieldValue,
  disabled,
  emailOpen,
  setEmailOpen,
}: any) => {
  const { backendFields, fetchBackendFields }: any = useNotificationConfigStore();

  const { selectedSearchModule } = useAlertPopup();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <>
      <EmailPopUpBox
        parentFormik={parentFormik}
        setEmailOpen={setEmailOpen}
        emailOpen={emailOpen}
        backendFieldsForEmail={backendFields}
        values={{
          id: values?.id,
          to: values?.common_fields?.[`${index}`]?.notification_email,
          subject: values?.common_fields?.[`${index}`]?.email_subject,
          content: values?.common_fields?.[`${index}`]?.email_content,
        }}
        fetchAPIFunction={async () => {
          (values?.perference?.tag || selectedSearchModule?.tag) &&
            (await fetchBackendFields({
              enqueueSnackbar,
              query: {
                tag: values?.perference?.tag || selectedSearchModule?.tag,
              },
            }));
        }}
        setInForm={(data: any) => {
          setFieldValue(`common_fields.${index}.notification_email`, data?.values?.emailTo);
          setFieldValue(`common_fields.${index}.email_subject`, data?.values?.subject);
          setFieldValue(`common_fields.${index}.email_content`, data?.content);
        }}
        disabled={disabled}
      />
    </>
  );
};

const TriggerComponent = ({
  setFieldValue,
  values,
  index,
  disabled,
  newTitle,
  handleChange,
  errors,
  touched,
  handleBlur,
  props,
  clearData,
  setClearData,
  remove,
  push,
}: any) => {
  const [emailOpen, setEmailOpen] = useState(false);

  return (
    <div key={index} className={"trigger__block"}>
      <EmailOpenBox
        parentFormik={{ setFieldValue }}
        values={values}
        index={index}
        setFieldValue={setFieldValue}
        disabled={disabled}
        emailOpen={emailOpen}
        setEmailOpen={setEmailOpen}
      />

      <Grid container spacing={4} className="formGroupItem">
        {/* Trigger Notifications */}
        {/* need to change styling and add trigger button */}
        <Grid item xs={4}>
          <InputLabel htmlFor={`common_fields.${index}.trigger_type`}>
            <div className="label-heading  align__label">When {newTitle}</div>
          </InputLabel>
        </Grid>

        <Grid item xs={6}>
          <Select
            MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
            id={`common_fields.${index}.trigger_type`}
            size="small"
            fullWidth
            data-testid={`common_fields.${index}.trigger_type`}
            placeholder="Select here"
            autoComplete="off"
            className={disabled ? "disabled" : ""}
            disabled={disabled}
            name={`common_fields.${index}.trigger_type`}
            value={
              (values?.common_fields?.[`${index}`] &&
                values?.common_fields?.[`${index}`]?.trigger_type) ||
              ""
            }
            defaultValue={"Primary"}
            error={
              getIn(errors, `common_fields.${index}.trigger_type`) &&
              getIn(touched, `common_fields.${index}.trigger_type`)
                ? true
                : false
            }
            onChange={handleChange}
            onBlur={handleBlur}
          >
            {[
              { label: "is added", value: "is_added" },
              { label: "is updated", value: "is_updated" },
              { label: "is deleted", value: "is_deleted" },
            ]?.map((item: any, index: number) => (
              <MenuItem key={item} value={`${item?.value}`}>
                {item?.label}
              </MenuItem>
            ))}
          </Select>
          {getIn(errors, `common_fields.${index}.trigger_type`) &&
            getIn(touched, `common_fields.${index}.trigger_type`) && (
              <div className="input-feedback" style={{ color: "red" }}>
                {getIn(errors, `common_fields.${index}.trigger_type`)}
              </div>
            )}
        </Grid>
      </Grid>
      {/* notification -1 in app */}
      <div className="notifcation__container">
        <div className="label-heading  align__label container__heading">Notification</div>
        <Grid container spacing={4} className="formGroupItem switch__option">
          <Grid item xs={4}>
            <InputLabel htmlFor={`common_fields.${index}.is_app`}>
              <div className="label-heading  align__label">
                In app <sup>*</sup>
              </div>
            </InputLabel>
          </Grid>

          <Grid item xs={6}>
            <IOSSwitch
              value="app"
              id={`common_fields.${index}.is_app`}
              name={`common_fields.${index}.is_app`}
              checked={
                (values?.common_fields?.[`${index}`] &&
                  values?.common_fields?.[`${index}`]?.is_app) ||
                false
              }
              onChange={handleChange}
              // className={disabled ? 'disabled' : ''}
              disabled={disabled}
              disableText
            />
          </Grid>
        </Grid>

        {/* notification -2 email*/}
        <Grid container spacing={4} className="formGroupItem switch__option">
          <Grid item xs={4}>
            <InputLabel htmlFor={`common_fields.${index}.email`}>
              <div className="label-heading  align__label">
                Email Alert<sup>*</sup>
              </div>
            </InputLabel>
          </Grid>

          <Grid item xs={6}>
            <IOSSwitch
              value="app"
              id={`common_fields.${index}.email`}
              name={`common_fields.${index}.email`}
              checked={
                (values?.common_fields?.[`${index}`] &&
                  values?.common_fields?.[`${index}`]?.email) ||
                false
              }
              onChange={handleChange}
              // className={disabled ? 'disabled' : ''}
              disabled={disabled}
              disableText
            />
          </Grid>
        </Grid>
        {/* if email true add email  */}
        {/* organization  email */}
        {!!(
          values?.common_fields?.[`${index}`]?.email || values?.common_fields?.[`${index}`]?.is_app
        ) && (
          <Grid container spacing={4} className="formGroupItem emial__group">
            <Grid item xs={4}>
              <InputLabel htmlFor={`common_fields.${index}.notification_email`}>
                <div className="label-heading  align__label"></div>
              </InputLabel>
            </Grid>
            <Grid item xs={7} className="multiple_email_address_id notification__multi-email">
              <MultiEmailAdd
                formikBag={props as any}
                name={`common_fields.${index}.notification_email`}
                clearData={clearData}
                setClearData={setClearData}
                nestedName={values?.id ? true : false}
                disableAdd={disabled}
                isViewOnly={disabled || false}
                addAnotherButton={
                  <Button
                    onClick={() => {
                      //   navigate('/config/notifications/email-id-content');
                      setEmailOpen(true);
                    }}
                    startIcon={!disabled ? <img alt="" src="/src/assets/icons/plus.svg" /> : <></>}
                    className="link-icon"
                  >
                    {`${
                      values?.common_fields?.[`${index}`]?.email_content && !disabled
                        ? "Edit"
                        : disabled
                        ? "View"
                        : "Add"
                    } Email Content`}
                  </Button>
                }
              />
            </Grid>
          </Grid>
        )}
      </div>
      {!disabled && (
        <div className="actions">
          <div
            onClick={() => {
              remove(index);
            }}
            style={{ position: "absolute", right: "14px", top: "12px" }}
          >
            <IconButton>
              <CancelOutlinedIcon
                sx={{
                  fill: "#C1C6D4",
                  "&:hover": {
                    fill: "#FF0000",
                    cursor: "pointer",
                  },
                }}
              ></CancelOutlinedIcon>
            </IconButton>
          </div>
          {!!(values?.common_fields?.length - 1 === index && !values?.id) && (
            <Button
              onClick={() => {
                push({
                  is_app: false,
                  email: false,
                  notification_email: [""],
                  email_subject: "",
                  email_content: "",
                  trigger_type: "",
                });
              }}
              startIcon={<img alt="" src="/src/assets/icons/plus.svg" />}
              className="link-icon"
            >
              Add Trigger
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

const Form = ({
  values,
  closeBox,
  newTitle,
  setTableData,
  disabled,
  updateIndividualEmail,
}: any) => {
  const [initialValues, setInitialValues] = useState<any>({
    name: "",
    status: "Active",
    perference_id: null,
    common_fields: [
      {
        is_app: false,
        email: false,
        notification_email: [""],
        email_subject: "",
        email_content: "",
        trigger_type: "",
      },
    ],
  });

  const [disableEntireField, setDisableEntireField] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [clearData, setClearData] = useState(false);
  const { backendFields, fetchBackendFields }: any = useNotificationConfigStore();

  const [backendFieldsForEmail, setBackendFieldsForEmail] = useState([]);
  //   routing and getting params
  const navigate = useNavigate();
  const param = useParams();
  //   notification
  const { enqueueSnackbar } = useSnackbar();
  //   getting data from global state
  const { selectedSearchModule } = useAlertPopup();

  const submitHandler = async (values: any, actions: any) => {
    // setIsFormLoading?.(true);
    if (values?.[0].id) {
      updateIndividualEmail?.(values?.[0]?.email_content || "");
      const apiResponse = await putApiData({
        values: values?.[0],
        id: values?.[0].id,
        url: "alert",
        enqueueSnackbar: enqueueSnackbar,
        domain: "Alert",
        setterLoading: setIsFormLoading,
        setterFunction: (data: any) => {
          data?.data &&
            setTableData?.((prev: any) => ({
              ...prev,
              items: [data?.data, ...prev?.items?.filter((it: any) => it?.id !== data?.data?.id)],
            }));
        },
      });
      if (apiResponse) {
        closeBox?.();
        navigate("/config/notifications");
      }
    } else {
      const apiResponse = await postApiData({
        values,
        url: "/alert/",
        enqueueSnackbar: enqueueSnackbar,
        domain: "Alert",
        setterLoading: setIsFormLoading,
        setterFunction: (data: any) => {
          setTableData?.((prev: any) => ({
            ...prev,
            items: [...(data?.data || []), ...(prev?.items || [])],
          }));
        },
      });
      if (apiResponse) {
        closeBox?.();
        navigate("/config/notifications");
      }
    }
  };

  const fetchData = async ({ id }: any) => {
    setIsFormLoading?.(true);
    await fetchBackendFields({
      query: { tag: id },
    });
    // await fetchApI({
    //   setterFunction: setBackendFieldsForEmail,
    //   url: 'alert/field-list',
    //   // enqueueSnackbar,
    //   queryParam: `tag=${id}&size=99999999999999999`,
    // });
    setIsFormLoading?.(false);
  };

  useEffect(() => {
    if (selectedSearchModule?.tag || values?.perference?.id) {
      fetchData({ id: values?.perference?.tag || selectedSearchModule?.tag });
    }
  }, [selectedSearchModule?.tag || values?.perference?.id]);

  useEffect(() => {
    if (values?.id) {
      let {
        perferenceId,
        status,
        email,
        name,
        perference_id,
        email_content,
        email_subject,
        is_app,
        notification_email,
        trigger_type,
        id,
      } = values;
      setInitialValues((prev: any) => ({
        ...values,
        id: id,
        status: status,
        name: name,
        common_fields: [
          {
            is_app: is_app,
            email: email,
            notification_email: notification_email,
            email_subject: email_subject,
            email_content: email_content,
            trigger_type: trigger_type,
          },
        ],
      }));
    }
  }, [values?.id, values]);

  return (
    <>
      <>
        {!!isFormLoading && <FullPageLoader />}

        <Formik
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            if (disabled) return;
            let finalValue = [];
            let { name, perference_id, status, common_fields, ...rest } = values;
            if (!values?.id) {
              finalValue = common_fields.map((field: any) => ({
                name,
                perference_id: selectedSearchModule?.id,
                status,
                ...rest,
                ...field,
              }));
            } else {
              finalValue = [{ name, status, perference_id, ...rest, ...common_fields?.[0] }];
            }
            submitHandler(finalValue, actions);
          }}
          enableReinitialize={true}
        >
          {(props) => {
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
              initialTouched,
            } = props;

            return (
              <form onSubmit={handleSubmit} className="alert__form-fill">
                <FieldArray name="common_fields">
                  {({ push, remove }: any) => (
                    <div>
                      <Grid container spacing={4} className="formGroupItem">
                        <Grid item xs={4}>
                          <InputLabel htmlFor={`name`}>
                            <div className="label-heading  align__label">Name *</div>
                          </InputLabel>
                        </Grid>
                        {/* name field */}
                        <Grid item xs={6} sx={{ marginBottom: "24px" }}>
                          <Field
                            as={OutlinedInput}
                            name={`name`}
                            id={`name`}
                            data-testid={`name`}
                            type="text"
                            autoComplete="off"
                            placeholder="Enter here"
                            size="small"
                            fullWidth
                            required
                            value={(values && values?.name) || ""}
                            error={getIn(errors, `name`) && getIn(touched, `name`) ? true : false}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={disabled ? "disabled" : ""}
                            disabled={disabled}
                          />
                          {getIn(errors, `name`) && getIn(touched, `name`) && (
                            <div className="input-feedback" style={{ color: "red" }}>
                              {getIn(errors, `name`)}
                            </div>
                          )}
                        </Grid>
                      </Grid>
                      {values.common_fields?.map((user: any, index: number) => {
                        return (
                          <TriggerComponent
                            key={index}
                            setFieldValue={setFieldValue}
                            values={values}
                            index={index}
                            disabled={disabled}
                            newTitle={newTitle}
                            handleChange={handleChange}
                            errors={errors}
                            touched={touched}
                            handleBlur={handleBlur}
                            props={props}
                            clearData={clearData}
                            setClearData={setClearData}
                            remove={remove}
                            push={push}
                          />
                        );
                      })}

                      {/* status */}
                      <Grid container spacing={4} className="formGroupItem">
                        <Grid item xs={4}>
                          <InputLabel htmlFor={`status`}>
                            <div className="label-heading">
                              Status <sup>*</sup>
                            </div>
                          </InputLabel>
                        </Grid>
                        <Grid item xs={7}>
                          <FormGroup className="input-holder">
                            <Select
                              MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                              id={`status`}
                              name={`status`}
                              size="small"
                              fullWidth
                              placeholder="Active"
                              className={disabled ? "disabled" : ""}
                              disabled={disabled}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={(values && values?.status) || "Active"}
                              error={
                                getIn(errors, `status`) && getIn(touched, `status`) ? true : false
                              }
                            >
                              <MenuItem value="Active">Active</MenuItem>
                              <MenuItem value="Inactive">Inactive</MenuItem>
                            </Select>
                            {getIn(errors, `status`) && getIn(touched, `status`) && (
                              <div className="input-feedback" style={{ color: "red" }}>
                                {getIn(errors, `status`)}
                              </div>
                            )}
                          </FormGroup>
                        </Grid>
                      </Grid>
                    </div>
                  )}
                </FieldArray>
                <div className="actions final__actions" style={{ paddingTop: "24px" }}>
                  <Button
                    onClick={() => {
                      closeBox();
                    }}
                    variant="outlined"
                    className="close__button"
                  >
                    Close
                  </Button>
                  {!disabled && (
                    <Button type="submit" variant="contained">
                      {values?.id ? `Update ` : `Add `} Alert
                    </Button>
                  )}
                </div>
              </form>
            );
          }}
        </Formik>
      </>
    </>
  );
};

export default Form;
