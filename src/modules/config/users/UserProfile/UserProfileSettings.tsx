import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormGroup,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Snackbar,
  Stack,
  Switch,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Field, Form, Formik, FormikProps } from "formik";
import ButtonLoaderSpinner from "src/components/ButtonLoaderSpinner/ButtonLoaderSpinner";
import {
  UserProfileSchema,
  setNewPasswordSchema,
  CustomerUserProfileSchema,
} from "src/components/validationSchema";
import PhoneNumberInput from "containers/setting/profile/PhoneNumberInput";
// import SendIcon from 'src/assets/icons/sendIcon.svg';
import { ReactComponent as SendIcon } from "src/assets/icons/sendIcon.svg";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import ProfilePicture from "containers/setting/profile/ProfilePicture";
import {
  fetchApI,
  fetchInitialValues,
} from "src/modules/config/contractors/contractor/Form/apiRequest";
import { useSnackbar } from "notistack";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import UserProfileLayout from "./UserProfileLayout";
import FullPageLoader from "src/components/FullPageLoader";
import useAppStore from "src/store/zustand/app";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface UserProfileI {
  photo: string;
  full_name: string;
  country: string;
  time_zone: string;
  role: string;
  designation: string;
  org_owner_email: string;
  phone: string;
}

interface PasswordInterface {
  password: string;
  confirmPassword: string;
  // email_password: boolean;
  // not_email_password: boolean;
}

interface UserProfileSettingsProps {
  isCustomersUser?: boolean;
}

const UserProfileSettings = ({ isCustomersUser }: UserProfileSettingsProps) => {
  const { profileId, customerId, userId, customerUserId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  // initial input for user profile
  const [profileInputs, setProfileInputs] = useState({
    photo: "",
    full_name: "",
    country: "",
    role: "",
    time_zone: "",
    designation: "",
    org_owner_email: "",
    phone: "",
  });

  const [userPassword, setUserPassword] = useState({
    password: "",
    confirmPassword: "",
    // email_password: false,
    // not_email_password: false,
  });
  const [emailPassword, setEmailPassword] = useState<boolean>(false);
  const [countryPhoneData, setCountryPhoneData] = useState<any>([]);
  const [timeZone, setTimeZone] = useState<any>([]);
  const [designationDatas, setDesignationDatas] = useState<any>([]);
  const [countryDatas, setCountryDatas] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [rolesDatas, setRolesDatas] = useState<any>([]);

  const [error, setError] = useState<string>("");
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [disableEntireField, setDisableEntireField] = useState(
    location.pathname.includes("view") ? true : false,
  );
  const [userProfileModal, setUserProfileModal] = useState<boolean>(false);
  const [passworddModal, setPasswordModal] = useState<boolean>(false);
  const [showPasswordOld, setShowPasswordOld] = useState<boolean>(false);
  const [showPasswordNew, setShowPasswordNew] = useState<boolean>(false);

  // two factor authentication
  const [twoFactorAuthentication, setTwoFactorAuthentication] = useState<boolean>(false);

  let profileUrl = "";
  let pathRoute = "";
  const readOnly = location.pathname.includes("view");

  if (customerUserId) {
    profileUrl = `customers/profile/${customerUserId}`;
    pathRoute = `customers`;
  } else if (profileId) {
    profileUrl = `organization-user/profile/${profileId}`;
    pathRoute = `organization-user`;
  } else {
    profileUrl = `organization-user/profile/${profileId}`;
    pathRoute = `organization-user`;
  }

  // user profile forms
  const SaveProceedHandler = async (values: any, actions: any) => {
    const { photo, full_name, country, time_zone, designation, phone, role } = values;
    let payload = {
      profile: {
        designation: designation || null,
        country: country || null,
        phone: phone?.length
          ? [
              {
                code: phone?.[0]?.code,
                phone: phone?.[0]?.phone,
              },
            ]
          : null,
        role: role || null,
        photo: photo ? `${process.env.VITE_HOST_URL}/${photo}` : null,
        full_name: full_name || "",
      },
      profile_format: {
        time_zone: time_zone || null,
      },
    };
    actions.setSubmitting(true);
    await putAPI(`${pathRoute}/profile/${profileId || userId || customerUserId}`, payload)
      .then((res: { data: any; status: any }) => {
        if (res.status === 201) {
          actions.setSubmitting(true);
          // setOpenModal(true);
          setUserProfileModal(true);
        }
      })
      .catch((err) => {
        setError(err?.response?.data?.detail?.message || "Cannot process your request");
        setOpenAlert(true);
        actions.setSubmitting(false);
      });
  };

  // change password
  const PasswordProceedhandler = async (values: any, actions: any) => {
    let payload = {
      password: values?.password,
      confirm_password: values?.confirmPassword,
      send_mail: emailPassword,
    };
    actions.setSubmitting(true);
    await putAPI(`${pathRoute}/change_password/${profileId || userId || customerUserId}`, payload)
      .then((res: { data: any; status: any }) => {
        if (res.status === 200) {
          actions.setSubmitting(true);
          actions.resetForm();
          // setOpenModal(true);
          setPasswordModal(true);
        }
      })
      .catch((err) => {
        setError(err?.response?.data?.detail?.message || "Cannot process your request");
        setOpenAlert(true);
        actions.setSubmitting(false);
      });
  };

  const scrollToValidationSection = () => {
    const formContainer = document.querySelector(".region-form-holder");
    if (formContainer) {
      formContainer.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  // fetching data for both with and without ids
  const fetchInitialValues = async () => {
    setLoading(true);
    await getAPI(profileUrl)
      .then((res: { data: any; status: any }) => {
        const { full_name, login_id, country, designation, time_zone, photo, phone, role } =
          res?.data;
        if (res.status === 200) {
          setProfileInputs({
            photo,
            full_name,
            country,
            designation,
            time_zone,
            org_owner_email: login_id,
            phone,
            role,
          });
          setLoading(false);
        }
      })
      .catch((err: any) => {
        enqueueSnackbar(err?.response?.data?.detail?.message || "Something went wrong!", {
          variant: "error",
        });
        // navigate(isCustomersUser ? `customer/view/${customerId}` : '/config/users/user');
      });
  };

  const fetchChooseFields = async () => {
    await fetchApI({
      setterFunction: setCountryPhoneData,
      url: "config/country",
      enqueueSnackbar,
      queryParam: `size=99`,
    });
    await fetchApI({
      setterFunction: setTimeZone,
      url: "config/time-zone",
      enqueueSnackbar,
      queryParam: `size=99`,
    });
    await fetchApI({
      setterFunction: setCountryDatas,
      url: "config/country",
      enqueueSnackbar,
      queryParam: `size=99`,
    });
    await fetchApI({
      setterFunction: setRolesDatas,
      url: "user-role/",
      enqueueSnackbar,
      queryParam: `size=99`,
    });

    await fetchApI({
      setterFunction: setDesignationDatas,
      url: "config/designation/",
      enqueueSnackbar,
      queryParam: `size=99`,
    });
  };

  useEffect(() => {
    fetchChooseFields();

    // fetching the previous values
    // if (!profileId) {
    //   return;
    // } else {
    //   fetchInitialValues();
    // }

    if (profileId || userId || customerUserId) {
      fetchInitialValues();
    }
  }, [location.pathname, profileId, userId, customerUserId]);

  // toggle 2fa authentication
  const toggleTwoFactorAuthentication = async (e: any) => {
    try {
      const { data } = await getAPI(
        `${pathRoute}/change-2fc-authentication/${profileId || userId}`,
      );
      setTwoFactorAuthentication((prev) => !prev);
      enqueueSnackbar(data?.message || "Status updated successfully!", {
        variant: "success",
      });
    } catch (error) {}
  };

  const getTwoFactorStatus = async () => {
    try {
      const { data } = await getAPI(
        `${pathRoute}/get-2fc-authentication-status/${profileId || userId}`,
      );
      setTwoFactorAuthentication(data);
    } catch {}
  };

  // useEffect(() => {
  //   getTwoFactorStatus();
  // }, []);

  const { sendResetPassword, userSecurity, loading: SystemLoading }: any = useAppStore();

  const handleClickShowPasswordOld = () => {
    setShowPasswordOld((show) => !show);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleClickShowPasswordNew = () => {
    setShowPasswordNew((show) => !show);
  };

  return (
    <UserProfileLayout>
      <Box sx={{ paddingBottom: 9 }}>
        {/* user profile success modal */}
        <ConfirmationModal
          openModal={userProfileModal}
          setOpenModal={() => setUserProfileModal(!userProfileModal)}
          handelConfirmation={() => {
            setUserProfileModal(false);
            navigate(isCustomersUser ? `/customer/users/view/${customerId}` : "/config/users/user");
          }}
          confirmationHeading={`Profile Updated Successfully`}
          confirmationDesc={`Profile Updated Successfully`}
          status="success"
          confirmationIcon="/assets/icons/icon-success.svg"
          isSuccess
          IsSingleBtn
          btnText="Go to Users"
        />

        {/* user profile password success modal; */}
        <ConfirmationModal
          openModal={passworddModal}
          setOpenModal={() => setPasswordModal(!passworddModal)}
          handelConfirmation={() => {
            setPasswordModal(false);
            navigate(isCustomersUser ? `/customer/users/view/${customerId}` : "/config/users/user");
          }}
          confirmationHeading={`Password Updated Successfully`}
          confirmationDesc={`Password Updated Successfully`}
          status="success"
          confirmationIcon="/assets/icons/icon-success.svg"
          isSuccess
          IsSingleBtn
          btnText="Go to Users"
        />

        {/* catching the error message from db */}
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={openAlert}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>

        <Stack direction="column" sx={{ mt: 2.5 }}>
          <Box sx={{ color: "#384874", fontSize: "17px", fontWeight: 500 }}>Profile Details</Box>
          <Box sx={{ color: "#475467", mt: 0.3, fontWeight: 400 }}>
            {(profileId || userId) && !readOnly ? "Update " : readOnly ? "View " : "Add "} your{" "}
            {customerUserId ? "user" : "organization"} photo and other details here.
          </Box>
        </Stack>
        <Box sx={{ my: 2 }}>
          <Divider />
        </Box>
        {/* main form container */}
        <Formik
          initialValues={profileInputs}
          enableReinitialize
          onSubmit={SaveProceedHandler}
          validationSchema={customerUserId ? CustomerUserProfileSchema : UserProfileSchema}
        >
          {(props: FormikProps<UserProfileI>) => {
            const {
              values,
              touched,
              errors,
              handleBlur,
              handleChange,
              setFieldValue,
              setFieldTouched,
              isSubmitting,
            } = props;
            // scrolling to top when error occured
            if (Object.keys(errors).length !== 0) {
              scrollToValidationSection();
            }

            return (
              <Form>
                {loading && <FullPageLoader />}
                <div style={{ marginTop: "4%" }}>
                  {/* profile picture */}
                  <Grid container className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="profile">
                        <div className="label-heading">Profile Photo</div>
                        <p style={{ color: "#475467", fontWeight: "300" }}>
                          This is the preview of profile photo
                        </p>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <ProfilePicture
                        profilePicture={values?.photo}
                        isViewOnly={disableEntireField}
                        handleUploadImage={(image: File) => {
                          return new Promise((res) => {
                            const reader = new FileReader();
                            reader.readAsDataURL(image);

                            reader.onload = (theFile) => {
                              const image = theFile.target?.result;
                              setFieldValue("photo", image);
                              setFieldTouched("photo");
                              res();
                            };
                          });
                        }}
                      />
                    </Grid>
                  </Grid>

                  {/* full name */}
                  <Grid container className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="name">
                        <div className="label-heading">
                          Full Name <sup>*</sup>
                        </div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={5}>
                      <Stack direction="column" sx={{ width: "100%" }}>
                        <Box>
                          <Field
                            as={OutlinedInput}
                            size="small"
                            id="full_name"
                            type="text"
                            fullWidth
                            sx={{ marginTop: "5px" }}
                            placeholder="Enter here"
                            className={`form_input ${readOnly ? "disabled" : ""}`}
                            value={values.full_name}
                            error={errors.full_name && touched.full_name ? true : false}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={disableEntireField}
                          />
                          <FormHelperText error style={{ color: "red" }}>
                            {errors.full_name}
                          </FormHelperText>{" "}
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>

                  {!customerUserId && (
                    <Grid container className="formGroupItem">
                      <Grid item xs={4}>
                        <InputLabel htmlFor="name">
                          <div className="label-heading">
                            Roles <sup>*</sup>
                          </div>
                        </InputLabel>
                      </Grid>
                      <Grid item xs={5}>
                        <Stack direction="column" sx={{ width: "100%" }}>
                          <Box>
                            <FormGroup className="input-holder">
                              <Select
                                MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                id="role"
                                size="small"
                                fullWidth
                                placeholder="Select a role"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name="role"
                                disabled={disableEntireField}
                                className={readOnly ? "disabled" : ""}
                                value={values.role}
                              >
                                {rolesDatas?.map((coun: any) => {
                                  return (
                                    <MenuItem value={coun?.id} key={coun?.id}>
                                      {coun?.name}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                              {Boolean(touched.role && errors.role) && (
                                <FormHelperText error style={{ color: "red" }}>
                                  {errors.role}
                                </FormHelperText>
                              )}
                            </FormGroup>
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  )}

                  {/* country */}
                  <Grid container className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="name">
                        <div className="label-heading">Country</div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={5}>
                      <Stack direction="column" sx={{ width: "100%" }}>
                        <Box>
                          <FormGroup className="input-holder">
                            <Select
                              MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                              id="country"
                              size="small"
                              fullWidth
                              placeholder="Select a time zone"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name="country"
                              disabled={disableEntireField}
                              className={readOnly ? "disabled" : ""}
                              value={values.country}
                            >
                              {countryDatas?.map((coun: any) => {
                                return (
                                  <MenuItem value={coun?.id} key={coun?.id}>
                                    {coun?.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormGroup>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>

                  {!customerUserId && (
                    <>
                      {/* time zone */}
                      <Grid container className="formGroupItem">
                        <Grid item xs={4}>
                          <InputLabel htmlFor="name">
                            <div className="label-heading">Time Zone</div>
                          </InputLabel>
                        </Grid>
                        <Grid item xs={5}>
                          <Stack direction="column" sx={{ width: "100%" }}>
                            <Box>
                              <FormGroup className="input-holder">
                                <Select
                                  MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                  id="time_zone"
                                  size="small"
                                  fullWidth
                                  placeholder="Select a time zone"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  name="time_zone"
                                  disabled={disableEntireField}
                                  className={readOnly ? "disabled" : ""}
                                  value={values.time_zone}
                                >
                                  {timeZone?.map((time: any) => {
                                    return (
                                      <MenuItem value={time?.id} key={time?.id}>
                                        {time?.timezone}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormGroup>
                            </Box>
                          </Stack>
                        </Grid>
                      </Grid>

                      {/* designation */}
                      <Grid container className="formGroupItem">
                        <Grid item xs={4}>
                          <InputLabel htmlFor="name">
                            <div className="label-heading">
                              Designation <sup>*</sup>
                            </div>
                          </InputLabel>
                        </Grid>
                        <Grid item xs={5}>
                          <Stack direction="column" sx={{ width: "100%" }}>
                            <Box>
                              <FormGroup className="input-holder">
                                <Select
                                  MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                  id="designation"
                                  size="small"
                                  fullWidth
                                  placeholder="Select a time zone"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  name="designation"
                                  disabled={disableEntireField}
                                  className={readOnly ? "disabled" : ""}
                                  value={values.designation}
                                >
                                  {designationDatas?.map((desig: any) => {
                                    return (
                                      <MenuItem value={desig?.id} key={desig?.id}>
                                        {desig?.title}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                                {Boolean(touched.designation && errors.designation) && (
                                  <FormHelperText error style={{ color: "red" }}>
                                    {errors.designation}
                                  </FormHelperText>
                                )}
                              </FormGroup>
                            </Box>
                          </Stack>
                        </Grid>
                      </Grid>
                    </>
                  )}

                  {/* email Id */}
                  <Grid container className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="name">
                        <div className="label-heading">
                          {isCustomersUser ? "User Email" : "Organization User Email "} <sup>*</sup>
                        </div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={5}>
                      <Stack direction="column" sx={{ width: "100%" }}>
                        <Box>
                          <Field
                            as={OutlinedInput}
                            name="org_owner_email"
                            id="org_owner_email"
                            type="text"
                            placeholder="Enter here"
                            size="small"
                            fullWidth
                            disabled
                            data-testid="org_owner_email"
                            autoComplete="off"
                            value={values.org_owner_email}
                            error={errors.org_owner_email && touched.org_owner_email ? true : false}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={readOnly ? "disabled" : ""}
                          />
                        </Box>
                        <Box>
                          {errors?.org_owner_email && touched?.org_owner_email && (
                            <FormHelperText style={{ color: "red" }}>
                              {errors?.org_owner_email}
                            </FormHelperText>
                          )}
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>

                  {/* phone number */}
                  <Grid container className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="name">
                        <div className="label-heading">Phone</div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={5}>
                      <Stack direction="column" sx={{ width: "100%" }}>
                        <Box>
                          <PhoneNumberInput
                            countryOptions={countryPhoneData}
                            formikBag={props as any}
                            isViewOnly={disableEntireField}
                            disableAdd={true}
                            addButtonClassName="add__more-group"
                            className="group__fields"
                          />
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </div>
                {/* submit button */}
                {!readOnly && (
                  <Grid item padding={3} display="flex" alignItems="end" justifyContent="end">
                    <Button
                      disabled={isSubmitting ? true : false}
                      type="submit"
                      sx={{ width: "120px", background: "#C1C6D4" }}
                    >
                      {isSubmitting ? <ButtonLoaderSpinner /> : "Edit Details"}
                    </Button>
                  </Grid>
                )}
                {!readOnly && (
                  <Box>
                    <Stack direction="column" sx={{ mt: 2.5 }}>
                      <Box sx={{ color: "#384874", fontSize: "17px", fontWeight: 500 }}>
                        Password Settings
                      </Box>
                      <Box sx={{ color: "#475467", mt: 0.3, fontWeight: 400 }}>
                        Update your password preferences and other details here.
                      </Box>
                    </Stack>

                    <Box sx={{ my: 2 }}>
                      <Divider />
                    </Box>

                    {/* Two factor authentication */}
                    {/* <Grid container spacing={4} className="formGroupItem" id="can_set_pw">
                      <Grid item xs={4}>
                        <InputLabel htmlFor="can_set_pw">
                          <div className="label-heading">Two Factor Authentication</div>
                        </InputLabel>
                      </Grid>

                      <Grid item xs={7} className="multiple_email_address_id">
                        <Stack direction="row">
                          <Switch
                            checked={twoFactorAuthentication}
                            onChange={(e) => toggleTwoFactorAuthentication(e)}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#344054',
                              fontWeight: 500,
                            }}>
                            {twoFactorAuthentication ? 'On' : 'Off'}
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid> */}

                    {/* password reset email */}
                    {/* <Box
                  sx={{
                    boxShadow: 1,
                    borderRadius: 2,
                  }}>

                </Box> */}
                    <Box
                      component="form"
                      autoComplete="off"
                      className="box-shadow-wrapper"
                      sx={{ width: "100%", backgroundColor: "#fff" }}
                    >
                      <Stack direction="column" sx={{ p: 2 }}>
                        {/* password content header */}
                        <Stack direction="row" spacing={1}>
                          <Box sx={{ fontSize: "15px", color: "#384874", fontWeight: 500 }}>
                            Email password reset instructions to the user
                          </Box>
                          <Chip size="small" label="Security" />
                        </Stack>
                        <Box
                          sx={{
                            color: "#475467",
                            fontSize: "12px",
                            fontWeight: "300",
                            display: "flex",
                          }}
                        >
                          <p>Password reset instructions will be emailed to</p>
                          <p
                            style={{
                              marginLeft: "5px",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                          >
                            {values?.org_owner_email}
                          </p>
                        </Box>
                      </Stack>
                      <Box>
                        <Divider />
                      </Box>
                      {/* send password reset email button */}
                      <Box
                        sx={{
                          p: 0.5,
                          display: "flex",
                          alignItems: "end",
                          justifyContent: "end",
                          width: "100%",
                        }}
                      >
                        <Button
                          sx={{ mr: 1.5 }}
                          endIcon={<SendIcon />}
                          onClick={async () => {
                            await sendResetPassword({
                              values: {
                                user_id: profileInputs?.org_owner_email,
                              },
                              enqueueSnackbar,
                            });
                          }}
                        >
                          Send password reset email
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Form>
            );
          }}
        </Formik>

        {/* password form container */}
        {!readOnly && (
          <Formik
            initialValues={userPassword}
            enableReinitialize
            onSubmit={PasswordProceedhandler}
            validationSchema={setNewPasswordSchema({ validationData: userSecurity || {} })}
          >
            {(props: FormikProps<PasswordInterface>) => {
              const { values, touched, errors, handleBlur, handleChange, isSubmitting } = props;
              return (
                <Form>
                  <Box
                    // component="form"
                    // autoComplete="off"
                    className="box-shadow-wrapper"
                    sx={{ width: "100%", mt: 3, backgroundColor: "#fff" }}
                  >
                    <Stack direction="column" sx={{ p: 2 }}>
                      {/* password content header */}
                      <Stack direction="row" spacing={1}>
                        <Box sx={{ fontSize: "15px", color: "#384874", fontWeight: 500 }}>
                          Set a password to the user field
                        </Box>
                        <Chip size="small" label="Security" />
                      </Stack>
                      <Box
                        sx={{
                          color: "#475467",
                          fontSize: "12px",
                          fontWeight: "300",
                          display: "flex",
                        }}
                      >
                        <p>A new password would be set and a mail will be send to the user.</p>
                      </Box>
                      {/* password form */}
                      <Box component="form" autoComplete="off">
                        <Stack direction="column" sx={{ mt: 2.5 }}>
                          <Stack direction="row" spacing={1.5}>
                            <Box sx={{ width: "100%" }}>
                              <Box sx={{ fontSize: "13px" }}>New Password</Box>
                              <Box>
                                <Field
                                  as={OutlinedInput}
                                  size="small"
                                  id="password"
                                  type={showPasswordOld ? "text" : "password"}
                                  fullWidth
                                  sx={{ marginTop: "5px" }}
                                  placeholder="Enter your password here"
                                  className={`form_input ${readOnly ? "disabled" : ""}`}
                                  value={values.password}
                                  error={errors.password && touched.password ? true : false}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  endAdornment={
                                    <InputAdornment position="end" sx={{ paddingRight: "6px" }}>
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPasswordOld}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                      >
                                        {showPasswordOld ? <VisibilityOff /> : <Visibility />}
                                      </IconButton>
                                    </InputAdornment>
                                  }
                                />
                                <Box>
                                  {errors?.password && touched?.password && (
                                    <div
                                      style={{
                                        color: "red",
                                        lineHeight: 1.6,
                                        paddingTop: "8px",
                                      }}
                                    >
                                      {errors?.password?.split("<br/>")?.map((mssg: string) => {
                                        return <p style={{ margin: 0 }}>{mssg}</p>;
                                      })}
                                    </div>
                                  )}
                                </Box>
                              </Box>
                            </Box>
                            <Box sx={{ width: "100%" }}>
                              <Box sx={{ fontSize: "13px" }}>Confirm New Password</Box>
                              <Box>
                                <Field
                                  as={OutlinedInput}
                                  size="small"
                                  id="confirmPassword"
                                  type={showPasswordNew ? "text" : "password"}
                                  fullWidth
                                  sx={{ marginTop: "5px" }}
                                  placeholder="Re-enter your password here"
                                  className={`form_input ${readOnly ? "disabled" : ""}`}
                                  value={values.confirmPassword}
                                  error={
                                    errors.confirmPassword && touched.confirmPassword ? true : false
                                  }
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  endAdornment={
                                    <InputAdornment position="end" sx={{ paddingRight: "6px" }}>
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPasswordNew}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                      >
                                        {showPasswordNew ? <VisibilityOff /> : <Visibility />}
                                      </IconButton>
                                    </InputAdornment>
                                  }
                                />
                                <Box>
                                  {errors?.confirmPassword && touched?.confirmPassword && (
                                    <div
                                      style={{
                                        color: "red",
                                        lineHeight: 1.6,
                                        paddingTop: "8px",
                                      }}
                                    >
                                      {errors?.confirmPassword
                                        ?.split("<br/>")
                                        ?.map((mssg: string) => {
                                          return <p style={{ margin: 0 }}>{mssg}</p>;
                                        })}
                                    </div>
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          </Stack>
                          {/* checkbox container */}
                          <Box sx={{ mt: 2.5 }}>
                            <Stack direction="row" alignItems="center" spacing={0.4}>
                              <Checkbox
                                color="primary"
                                checkedIcon={<img src="/assets/icons/icon-check.svg" alt="check" />}
                                icon={<img src="/assets/icons/icon-uncheck.svg" alt="uncheck" />}
                                checked={emailPassword}
                                onChange={() => setEmailPassword(!emailPassword)}
                              />
                              <Box>Email this new password to ther user.</Box>
                            </Stack>
                            {/* <Stack direction="row" alignItems="center" spacing={0.4}>
                          <Checkbox
                            color="primary"
                            checkedIcon={<img src="/assets/icons/icon-check.svg" alt="check" />}
                            icon={<img src="/assets/icons/icon-uncheck.svg" alt="uncheck" />}
                            checked={values?.not_email_password}
                            onChange={() =>
                              setUserPassword((prev) => {
                                return {
                                  ...prev,
                                  not_email_password: !values?.not_email_password,
                                };
                              })
                            }
                          />
                          <Box>Do not email this new password to ther user.</Box>
                        </Stack> */}
                          </Box>
                        </Stack>
                      </Box>
                    </Stack>
                    <Box>
                      <Divider />
                    </Box>
                    {/* send password reset email button */}
                    <Box
                      sx={{
                        py: 1.5,
                        display: "flex",
                        alignItems: "end",
                        justifyContent: "end",
                        width: "100%",
                      }}
                    >
                      <Button
                        type="submit"
                        disabled={isSubmitting ? true : false}
                        sx={{ mr: 1.5, background: "#C1C6D4" }}
                        endIcon={isSubmitting ? "" : <SendIcon />}
                      >
                        {isSubmitting ? <ButtonLoaderSpinner /> : "Set & send E-mail"}
                      </Button>
                    </Box>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        )}
      </Box>
    </UserProfileLayout>
  );
};

export default UserProfileSettings;
