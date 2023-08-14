import { IOSSwitch } from "src/components/switch/IosSwitch";
import {
  Box,
  CircularProgress,
  FormGroup,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Notifications as NotificationsPayload } from "interfaces/notifications";
import { ChangeEvent, useState } from "react";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import NotificationSchema from "validationSchemas/Notifications";
import { FormikFormHelpers } from "interfaces/utils";
import SettingFooter from "src/components/footer/SettingFooter";
import { getAPI, postAPI } from "src/lib/axios";
import { useEffect } from "react";
import { userDataStore } from "src/store/zustand/globalStates/userData";

const initialValues: NotificationsPayload = {
  notify_tenant_signup_through: [],
  notify_when_tenant_change_billing_plans_through: [],
  notify_when_tenant_create_new_org_through: [],

  notify_when_tenant_create_new_organization: [],
  notify_when_organization_deactivated: [],
};

type getTextParams = {
  label: string;
  role: any;
};

type ObjectAcessor = {
  [key: string]: any;
};

// setting texts in notification settings
const getText = ({ label, role }: getTextParams) => {
  let obj: ObjectAcessor = {};

  switch (role) {
    case "Tenant":
      obj = {
        FIRST: {
          title: "Notification Settings",
          value: "Update your notification and alert terms here.",
        },
        SECOND: {
          fieldName: "notify_when_tenant_create_new_organization",
          title: "New Organization added",
          value: "Notify you when a new organization is added",
        },
        THIRD: {
          fieldName: "notify_when_organization_deactivated",
          title: "Organization deactivated",
          value: "Notify you when a organization is deactivated",
        },
      };
      break;
    case "Platform_owner":
      obj = {
        FIRST: {
          title: "Notification Settings",
          value: "Update your notification and alert terms here.",
        },
        SECOND: {
          fieldName: "notify_tenant_signup_through",
          title: "Tenant Sign Up",
          value: "Notify you when a tenant signs up to the platform.",
        },
        THIRD: {
          fieldName: "notify_when_tenant_create_new_org_through",
          title: "Tenant on creating a new organisation",
          value: "Notify you when a tenant create a new organisation.",
        },
        FOURTH: {
          fieldName: "notify_when_tenant_change_billing_plans_through",
          title: "Tenants on changing billing plans",
          value: "Notify you when tenants change their billing plans",
        },
      };
      break;
    case "Organization":
      obj = {
        FIRST: {
          title: "Notification Settings",
          value: "Update your notification and alert terms here.",
        },
        SECOND: {
          fieldName: "notify_when_tenant_create_new_organization",
          title: "New Organization added",
          value: "Notify you when a new organization is added",
        },
        THIRD: {
          fieldName: "notify_when_organization_deactivated",
          title: "Organization deactivated",
          value: "Notify you when a organization is deactivated",
        },
      };
      break;
    default:
      obj = {
        FIRST: {
          title: "Notification Settings",
          value: "Update your notification and alert terms here.",
        },
        SECOND: {
          title: "New Organization added",
          value: "Notify you when a new organization is added",
        },
        THIRD: {
          title: "Organization deactivated",
          value: "Notify you when a organization is deactivated",
        },
      };
  }
  return obj[`${label}`];
};

const Notifications = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [isViewOnly, setIsViewOnly] = useState<boolean>(true);

  const { userType } = userDataStore();

  const [initialNotifications, setInitialNotifications] =
    useState<NotificationsPayload>(initialValues);

  const handleNotifications = async (values: NotificationsPayload) => {
    try {
      setLoading(true);
      const { data, ...res } = await postAPI("/notification/", {
        ...values,
      });
      setInitialNotifications(values);
      setIsViewOnly(true);
      setLoading(false);
      enqueueSnackbar(res?.message || "updated successfully", {
        variant: "success",
      });
    } catch (error: any) {
      setLoading(false);
      resetForm();
      initialNotifications && setValues(initialNotifications);
      enqueueSnackbar(error?.detail || "Error on update the user notifications", {
        variant: "error",
      });
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    onSubmit: handleNotifications,
    initialValues,
    validationSchema: NotificationSchema,
  });

  const {
    touched,
    values,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldTouched,
    isValid,
    dirty,
    setValues,
  } = formik;

  const handleViewOnly = () => {
    setIsViewOnly(!isViewOnly);
    if (!isViewOnly) resetForm();
  };

  const formikHelpers: FormikFormHelpers = {
    isValid,
    dirty,
    touched: Object.values(touched).length > 0,
  };

  const handleSwitchChange = (ev: ChangeEvent<HTMLInputElement>): void => {
    // const name = ev.target.name as keyof NotificationsPayload;
    const name = ev.target.name;
    const currValue = ev.target.value;
    const prevValues = values[name] || [];
    const index = prevValues?.findIndex((pv: any) => pv === currValue);

    setFieldValue(
      name,
      index !== undefined && index > -1
        ? prevValues?.filter((pv: any) => pv !== currValue)
        : [...prevValues, currValue],
    );
    setFieldTouched(name);
  };

  const fetchUserNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await getAPI("notification/");
      if (!data) {
        setValues({ ...initialValues });
      } else {
        setValues(data);
      }

      setInitialNotifications(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      resetForm();
      initialNotifications && setValues(initialNotifications);
    }
  };

  useEffect(() => {
    fetchUserNotifications();
  }, []);

  return (
    <form className="profile-form notification-form" onSubmit={handleSubmit}>
      {loading && <CircularProgress className="page-loader" />}
      <Typography variant="h3" color="primary">
        {getText({ label: "FIRST", role: userType })?.title}
      </Typography>
      <Typography variant="body1" component="p">
        {getText({ label: "FIRST", role: userType })?.value}
      </Typography>
      <Box className="border-wrapper">
        <Grid container spacing={4} className="formGroupItem">
          <Grid item xs={4}>
            <InputLabel htmlFor="allowedLoginAttempt">
              <div className="label-heading">
                {getText({ label: "SECOND", role: userType })?.title}
              </div>
              <Typography variant="body1" component="p">
                {getText({ label: "SECOND", role: userType })?.value}
              </Typography>
            </InputLabel>
          </Grid>
          <Grid item xs={8}>
            <FormGroup className="input-holder">
              <List className="notification-toggle-lists">
                <ListItem>
                  <ListItemText id="switch-list-email" primary="Email" />
                  <IOSSwitch
                    value="email"
                    name={`${getText({ label: "SECOND", role: userType })?.fieldName}`}
                    checked={values[
                      `${getText({ label: "SECOND", role: userType })?.fieldName}`
                    ]?.includes("email")}
                    onChange={handleSwitchChange}
                    disabled={isViewOnly}
                    disableText
                  />
                </ListItem>
                <ListItem>
                  <ListItemText id="switch-list-sms" primary="SMS" />
                  <IOSSwitch
                    value="sms"
                    name={`${getText({ label: "SECOND", role: userType })?.fieldName}`}
                    checked={values[
                      `${getText({ label: "SECOND", role: userType })?.fieldName}`
                    ]?.includes("sms")}
                    onChange={handleSwitchChange}
                    disabled={isViewOnly}
                    disableText
                  />
                </ListItem>
                <ListItem>
                  <ListItemText id="switch-list-in-app" primary="In App" />
                  <IOSSwitch
                    value="app"
                    name={`${getText({ label: "SECOND", role: userType })?.fieldName}`}
                    checked={values[
                      `${getText({ label: "SECOND", role: userType })?.fieldName}`
                    ]?.includes("app")}
                    onChange={handleSwitchChange}
                    disabled={isViewOnly}
                    disableText
                  />
                </ListItem>
              </List>
            </FormGroup>
          </Grid>
        </Grid>
        <Grid container spacing={4} className="formGroupItem">
          <Grid item xs={4}>
            <InputLabel htmlFor="allowedLoginAttempt">
              <div className="label-heading">
                {getText({ label: "THIRD", role: userType })?.title}
              </div>
              <Typography variant="body1" component="p">
                {getText({ label: "THIRD", role: userType })?.value}
              </Typography>
            </InputLabel>
          </Grid>
          <Grid item xs={8}>
            <FormGroup className="input-holder">
              <List className="notification-toggle-lists">
                <ListItem>
                  <ListItemText id="switch-list-email" primary="Email" />
                  <IOSSwitch
                    value="email"
                    name={`${getText({ label: "THIRD", role: userType })?.fieldName}`}
                    checked={values[
                      `${getText({ label: "THIRD", role: userType })?.fieldName}`
                    ]?.includes("email")}
                    onChange={handleSwitchChange}
                    disabled={isViewOnly}
                    disableText
                  />
                </ListItem>
                <ListItem>
                  <ListItemText id="switch-list-sms" primary="SMS" />
                  <IOSSwitch
                    value="sms"
                    name={`${getText({ label: "THIRD", role: userType })?.fieldName}`}
                    checked={values[
                      `${getText({ label: "THIRD", role: userType })?.fieldName}`
                    ]?.includes("sms")}
                    onChange={handleSwitchChange}
                    disabled={isViewOnly}
                    disableText
                  />
                </ListItem>
                <ListItem>
                  <ListItemText id="switch-list-in-app" primary="In App" />
                  <IOSSwitch
                    value="app"
                    name={`${getText({ label: "THIRD", role: userType })?.fieldName}`}
                    checked={values[
                      `${getText({ label: "THIRD", role: userType })?.fieldName}`
                    ]?.includes("app")}
                    onChange={handleSwitchChange}
                    disabled={isViewOnly}
                    disableText
                  />
                </ListItem>
              </List>
            </FormGroup>
          </Grid>
        </Grid>
        {userType?.toString() === "Platform_owner" ? (
          <Grid container spacing={4} className="formGroupItem border-wrapper bottom">
            <Grid item xs={4}>
              <InputLabel htmlFor="allowedLoginAttempt">
                <div className="label-heading">
                  {getText({ label: "FOURTH", role: userType })?.title}
                </div>
                <Typography variant="body1" component="p">
                  {getText({ label: "FOURTH", role: userType })?.value}
                </Typography>
              </InputLabel>
            </Grid>
            <Grid item xs={8}>
              <FormGroup className="input-holder">
                <List className="notification-toggle-lists">
                  <ListItem>
                    <ListItemText id="switch-list-email" primary="Email" />
                    <IOSSwitch
                      value="email"
                      name={`${getText({ label: "FOURTH", role: userType })?.fieldName}`}
                      checked={values[
                        `${getText({ label: "FOURTH", role: userType })?.fieldName}`
                      ]?.includes("email")}
                      onChange={handleSwitchChange}
                      disabled={isViewOnly}
                      disableText
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText id="switch-list-sms" primary="SMS" />
                    <IOSSwitch
                      value="sms"
                      name={`${getText({ label: "FOURTH", role: userType })?.fieldName}`}
                      checked={values[
                        `${getText({ label: "FOURTH", role: userType })?.fieldName}`
                      ]?.includes("sms")}
                      onChange={handleSwitchChange}
                      disabled={isViewOnly}
                      disableText
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText id="switch-list-in-app" primary="In App" />
                    <IOSSwitch
                      value="app"
                      name={`${getText({ label: "FOURTH", role: userType })?.fieldName}`}
                      checked={values[
                        `${getText({ label: "FOURTH", role: userType })?.fieldName}`
                      ]?.includes("app")}
                      onChange={handleSwitchChange}
                      disabled={isViewOnly}
                      disableText
                    />
                  </ListItem>
                </List>
              </FormGroup>
            </Grid>
          </Grid>
        ) : (
          <></>
        )}
      </Box>
      <SettingFooter
        isViewOnly={isViewOnly}
        loading={loading}
        handleViewOnly={handleViewOnly}
        formikHelpers={formikHelpers}
      />
    </form>
  );
};

export default Notifications;
