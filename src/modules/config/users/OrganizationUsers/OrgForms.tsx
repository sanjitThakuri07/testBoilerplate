import { Box } from "@mui/system";
import { Field, Form, Formik, FormikProps } from "formik";
import { OrgUsersSchema } from "src/components/validationSchema";
import {
  Alert,
  Button,
  Chip,
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
import { useEffect, useState } from "react";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import ButtonLoaderSpinner from "src/components/ButtonLoaderSpinner/ButtonLoaderSpinner";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ExclamationTooltip from "src/assets/iconsexclamationIcon.svg";
import styled from "@emotion/styled";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import useAppStore from "src/store/zustand/app";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface UsersFormI {
  full_name: string;
  login_id: string;
  role_id: string | number;
  user_department_id: string | number;
  region_id: string | number;
  country_id: string | number;
  territory_id: string | number;
  location_id: string | number;
  status: string;
  password: string;
  confirm_password: string;
}

const OrgForms: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const param = useParams<{ userId: string }>();
  const location = useLocation();
  const [showPasswordOld, setShowPasswordOld] = useState<boolean>(false);
  const [showPasswordNew, setShowPasswordNew] = useState<boolean>(false);
  const { userSecurity, loading: SystemLoading }: any = useAppStore();

  const [initialValues, setInitialValues] = useState<UsersFormI>({
    full_name: "",
    login_id: "",
    role_id: "",
    user_department_id: "",
    region_id: "",
    country_id: "",
    territory_id: "",
    location_id: "",
    status: "Inactive",
    password: "",
    confirm_password: "",
  });
  const [userEmailId, setUserEmailId] = useState<string>("");
  const [can_set_pw, setCanSetPassword] = useState<boolean>(true);
  const [openPasswordBox, setOpenPasswordBox] = useState<boolean>(false);

  // initial states for all the config datas
  const [allConfigStore, setAllConfigStore] = useState({
    userRole: [],
    userDepartment: [],
    regions: [],
    country: [],
    territory: [],
    locationData: [],
  });
  const { userRole, userDepartment, regions, country, territory, locationData } = allConfigStore;

  const [error, setError] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [addAnother, setAddAnother] = useState(false);

  const SaveProceedHandler = async (values: any, actions: any) => {
    const {
      login_id,
      full_name,
      password,
      confirm_password,
      user_department_id,
      region_id,
      country_id,
      territory_id,
      location_id,
      role_id,
      status,
      can_set_pw,
    } = values;
    let payload = {
      login_id,
      full_name,
      password,
      confirm_password,
      user_department_id: user_department_id ? user_department_id : null,
      region_id: region_id ? region_id : null,
      country_id: country_id ? country_id : null,
      territory_id: territory_id ? territory_id : null,
      location_id: location_id ? location_id : null,
      role_id: role_id ? role_id : null,
      status,
      can_set_pw,
    };

    actions.setSubmitting(true);
    setUserEmailId(values?.login_id);
    if (param.userId) {
      await putAPI(`organization-user/${param.userId}`, payload)
        .then((res: { data: any; status: any }) => {
          if (res.status === 200) {
            actions.setSubmitting(false);
            actions.resetForm();
            // navigate('/password-reset-link');
            setOpenModal(true);
          }
        })
        .catch((err) => {
          setError(err?.response?.data?.detail?.message || "Cannot process your request");
          setOpenAlert(true);
          actions.setSubmitting(false);
        });
    } else {
      await postAPI(`/organization-user/`, [payload])
        .then((res: { data: any; status: any }) => {
          if (res.status === 200) {
            actions.setSubmitting(false);
            actions.resetForm();
            setOpenModal(true);
          }
        })
        .catch((err) => {
          setError(err?.response?.data?.detail?.message || "Cannot process your request");
          setOpenAlert(true);
          actions.setSubmitting(false);
        });
    }
  };

  const getAllOrganizationUsers = async () => {
    await getAPI(`user-department/${param.userId}`)
      .then((res: { data: any; status: any }) => {
        if (res.status === 200) {
          setInitialValues({ ...res.data });
        }
      })
      .catch((err: any) => {
        enqueueSnackbar(err?.response?.data?.detail?.message || "Something went wrong!", {
          variant: "error",
        });
        navigate("/config/users/user-department");
      });
  };

  const getAllUserRole = async () => {
    await getAPI(`user-role/`).then((res: { data: any; status: any }) => {
      if (res.status === 200) {
        setAllConfigStore((prev) => {
          return {
            ...prev,
            userRole: res?.data?.items,
          };
        });
      }
    });
  };

  const getAllUserDepartment = async () => {
    await getAPI(`user-department/`).then((res: { data: any; status: any }) => {
      if (res.status === 200) {
        setAllConfigStore((prev) => {
          return {
            ...prev,
            userDepartment: res?.data?.items,
          };
        });
      }
    });
  };

  const getAllRegions = async () => {
    await getAPI(`region/`).then((res: { data: any; status: any }) => {
      if (res.status === 200) {
        setAllConfigStore((prev) => {
          return {
            ...prev,
            regions: res?.data?.items,
          };
        });
      }
    });
  };

  const getAllCountry = async () => {
    await getAPI(`country/`).then((res: { data: any; status: any }) => {
      if (res.status === 200) {
        setAllConfigStore((prev) => {
          return {
            ...prev,
            country: res?.data?.items,
          };
        });
      }
    });
  };

  const getAllTerritory = async () => {
    await getAPI(`territory/`).then((res: { data: any; status: any }) => {
      if (res.status === 200) {
        setAllConfigStore((prev) => {
          return {
            ...prev,
            territory: res?.data?.items,
          };
        });
      }
    });
  };

  const getAllLocations = async () => {
    await getAPI(`location/`).then((res: { data: any; status: any }) => {
      if (res.status === 200) {
        setAllConfigStore((prev) => {
          return {
            ...prev,
            locationData: res?.data?.items,
          };
        });
      }
    });
  };

  useEffect(() => {
    // getting user role, departments, region, country, territory, location
    getAllUserRole();
    getAllUserDepartment();
    getAllRegions();
    getAllCountry();
    getAllTerritory();
    getAllLocations();

    // getting all the individual departments for editing the org users
    if (!param.userId) {
      return;
    } else {
      getAllOrganizationUsers();
    }
  }, [location.pathname, param.userId]);

  // hiding the snackbar toaster

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  const scrollToValidationSection = () => {
    const formContainer = document.querySelector(".region-form-holder");
    if (formContainer) {
      formContainer.scrollIntoView({ behavior: "smooth" });
    }
  };

  // custom tooltip
  const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: `#384874`,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: `#384874`,
      borderRadius: "8px",
    },
  }));

  // region tooltip
  const toolTipHandler = () => {
    return (
      <>
        <Box>Amongst Region, Country, Territory,</Box>
        <Box>Location any one of the section to be filled.</Box>
      </>
    );
  };
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
    <>
      <div className="region-form-holder">
        <ConfirmationModal
          openModal={openModal}
          setOpenModal={() => setOpenModal(!openModal)}
          handelConfirmation={() => {
            setOpenModal(false);
            navigate(-1);
          }}
          confirmationHeading={`Sign up link sent successfully`}
          confirmationDesc={`An email that consists of sign up link has been sent to ${userEmailId}`}
          status="success"
          confirmationIcon="src/assets/icons/icon-success.svg"
          isSuccess
          IsSingleBtn
          btnText="Go to Home Page"
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

        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={SaveProceedHandler}
          validationSchema={OrgUsersSchema({ validationData: userSecurity || {} })}
        >
          {(props: FormikProps<UsersFormI>) => {
            const {
              values,
              touched,
              errors,
              handleBlur,
              handleChange,
              isValid,
              dirty,
              isSubmitting,
            } = props;

            // removing the values from the errors object when password box is opened
            if (can_set_pw && (errors?.password || errors?.confirm_password)) {
              delete errors?.password;
              delete errors?.confirm_password;
            }
            if (!can_set_pw) {
              values.status = "Active";
            } else {
              values.status = "Inactive";
            }

            // scrolling to top when error occured
            if (Object.keys(errors).length !== 0) {
              // scrollToValidationSection();
            }

            return (
              <Form className="region-form">
                <div className="region-fieldset">
                  {/* User Department Name */}
                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="name">
                        <div className="label-heading">
                          Full Name <sup>*</sup>
                        </div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
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
                            className="form_input"
                            value={values.full_name}
                            error={errors.full_name && touched.full_name ? true : false}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Box>
                        <Box>
                          {errors?.full_name && touched?.full_name && (
                            <FormHelperText style={{ color: "red" }}>
                              {errors?.full_name}
                            </FormHelperText>
                          )}
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>

                  {/* email Id */}
                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="name">
                        <div className="label-heading">
                          Email ID <sup>*</sup>
                        </div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <Stack direction="column" sx={{ width: "100%" }}>
                        <Box>
                          <Field
                            as={OutlinedInput}
                            name="login_id"
                            id="login_id"
                            type="text"
                            placeholder="Enter here"
                            size="small"
                            fullWidth
                            data-testid="login_id"
                            autoComplete="off"
                            value={values.login_id || ""}
                            error={errors.login_id && touched.login_id ? true : false}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Box>
                        <Box>
                          {errors?.login_id && touched?.login_id && (
                            <FormHelperText style={{ color: "red" }}>
                              {errors?.login_id}
                            </FormHelperText>
                          )}
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>

                  {/* User role */}
                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="role_id">
                        <div className="label-heading">
                          User Role <sup>*</sup>
                        </div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <FormGroup className="input-holder">
                        <Select
                          MenuProps={{
                            PaperProps: { style: { maxHeight: 200 } },
                          }}
                          id="role_id"
                          size="small"
                          fullWidth
                          placeholder="Select a user role"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name="role_id"
                          value={values.role_id}
                          error={Boolean(touched.role_id && errors.role_id)}
                        >
                          {userRole?.map((user: any) => {
                            return (
                              <MenuItem value={user?.id} key={user?.id}>
                                {user?.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        {Boolean(touched.role_id && errors.role_id) && (
                          <FormHelperText error style={{ color: "red" }}>
                            {errors.role_id}
                          </FormHelperText>
                        )}
                      </FormGroup>
                    </Grid>
                  </Grid>

                  {/* User department */}
                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="user_department_id">
                        <div className="label-heading">
                          User Department <sup>*</sup>
                        </div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <FormGroup className="input-holder">
                        <Select
                          MenuProps={{
                            PaperProps: { style: { maxHeight: 200 } },
                          }}
                          id="user_department_id"
                          size="small"
                          fullWidth
                          placeholder="Active"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name="user_department_id"
                          value={values.user_department_id}
                          error={Boolean(touched.user_department_id && errors.user_department_id)}
                        >
                          {userDepartment?.map((department: any) => {
                            return (
                              <MenuItem value={department?.id} key={department?.id}>
                                {department?.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        {Boolean(touched.user_department_id && errors.user_department_id) && (
                          <FormHelperText error style={{ color: "red" }}>
                            {errors.user_department_id}
                          </FormHelperText>
                        )}
                      </FormGroup>
                    </Grid>
                  </Grid>

                  {/* Region */}
                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="region_id">
                        <div className="label-heading">Region</div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <FormGroup className="input-holder">
                        <Select
                          MenuProps={{
                            PaperProps: { style: { maxHeight: 200 } },
                          }}
                          id="region_id"
                          size="small"
                          fullWidth
                          placeholder="Active"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name="region_id"
                          value={values.region_id}
                          error={Boolean(touched.region_id && errors.region_id)}
                        >
                          {regions?.map((region: any) => {
                            return (
                              <MenuItem value={region?.id} key={region?.id}>
                                {region?.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        {Boolean(touched.region_id && errors.region_id) && (
                          <FormHelperText error>{errors.region_id}</FormHelperText>
                        )}
                      </FormGroup>
                    </Grid>
                    {/* <Box sx={{ mt: 4, ml: 2 }}>
                      <img
                        src={ExclamationTooltip}
                        alt="tooltip"
                        style={{ height: '17px', width: '17px', cursor: 'pointer' }}
                      />
                    </Box> */}
                    <Box sx={{ mt: 4, ml: 2, cursor: "pointer" }}>
                      <BootstrapTooltip
                        placement="right"
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        arrow
                        title={toolTipHandler()}
                      >
                        <Box color="#475467">
                          <img
                            src={ExclamationTooltip}
                            alt="tooltip"
                            style={{ height: "17px", width: "17px" }}
                          />
                        </Box>
                      </BootstrapTooltip>
                    </Box>
                  </Grid>

                  {/* country */}
                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="country_id">
                        <div className="label-heading">Country</div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <FormGroup className="input-holder">
                        <Select
                          MenuProps={{
                            PaperProps: { style: { maxHeight: 200 } },
                          }}
                          id="country_id"
                          size="small"
                          fullWidth
                          placeholder="Active"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name="country_id"
                          value={values.country_id}
                          error={Boolean(touched.country_id && errors.country_id)}
                        >
                          {country?.map((coun: any) => {
                            return (
                              <MenuItem value={coun?.id} key={coun?.id}>
                                {coun?.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        {Boolean(touched.country_id && errors.country_id) && (
                          <FormHelperText error>{errors.country_id}</FormHelperText>
                        )}
                      </FormGroup>
                    </Grid>
                  </Grid>

                  {/* territory */}
                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="territory_id">
                        <div className="label-heading">Territory</div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <FormGroup className="input-holder">
                        <Select
                          MenuProps={{
                            PaperProps: { style: { maxHeight: 200 } },
                          }}
                          id="territory_id"
                          size="small"
                          fullWidth
                          placeholder="Active"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name="territory_id"
                          value={values.territory_id}
                          error={Boolean(touched.territory_id && errors.territory_id)}
                        >
                          {territory?.map((terr: any) => {
                            return (
                              <MenuItem value={terr?.id} key={terr?.id}>
                                {terr?.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        {Boolean(touched.territory_id && errors.territory_id) && (
                          <FormHelperText error>{errors.territory_id}</FormHelperText>
                        )}
                      </FormGroup>
                    </Grid>
                  </Grid>

                  {/* location */}
                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="location_id">
                        <div className="label-heading">Location</div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <FormGroup className="input-holder">
                        <Select
                          MenuProps={{
                            PaperProps: { style: { maxHeight: 200 } },
                          }}
                          id="location_id"
                          size="small"
                          fullWidth
                          placeholder="Active"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name="location_id"
                          value={values.location_id}
                          error={Boolean(touched.location_id && errors.location_id)}
                        >
                          {locationData?.map((loca: any) => {
                            return (
                              <MenuItem value={loca?.id} key={loca?.id}>
                                {loca?.location}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        {Boolean(touched.location_id && errors.location_id) && (
                          <FormHelperText error>{errors.location_id}</FormHelperText>
                        )}
                      </FormGroup>
                    </Grid>
                  </Grid>

                  {/* status */}
                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="status">
                        <div className="label-heading">
                          Status <sup>*</sup>
                        </div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <FormGroup className="input-holder">
                        <Select
                          MenuProps={{
                            PaperProps: { style: { maxHeight: 200 } },
                          }}
                          id="status"
                          size="small"
                          fullWidth
                          placeholder="Active"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name="status"
                          disabled={true}
                          value={values.status}
                          error={Boolean(touched.status && errors.status)}
                        >
                          <MenuItem value="Active">Active</MenuItem>
                          <MenuItem value="Inactive">Inactive</MenuItem>
                        </Select>
                        {Boolean(touched.status && errors.status) && (
                          <FormHelperText error>{errors.status}</FormHelperText>
                        )}
                      </FormGroup>
                    </Grid>
                  </Grid>

                  {/* can set password */}
                  <Grid container spacing={4} className="formGroupItem" id="can_set_pw">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="can_set_pw">
                        <div className="label-heading">Allow users to set their own password</div>
                        <p style={{ color: "#475467", fontWeight: "300" }}>
                          Instructions on how to set a password will be sent to the user on invite
                        </p>
                      </InputLabel>
                    </Grid>

                    <Grid item xs={7} className="multiple_email_address_id">
                      <Switch
                        checked={can_set_pw}
                        onChange={() => setCanSetPassword(!can_set_pw)}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </Grid>
                  </Grid>

                  {/* set password toggle */}
                  {/* <Grid container spacing={4} className="formGroupItem" id="can_set_pw">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="can_set_pw">
                        <div className="label-heading">Set password for this user</div>
                        <p style={{ color: '#475467', fontWeight: '300' }}>
                          Create a password for this user with all the password requirements{' '}
                        </p>
                      </InputLabel>
                    </Grid>

                    <Grid item xs={7} className="multiple_email_address_id">
                      <Switch
                        checked={openPasswordBox}
                        onChange={() => setOpenPasswordBox(!openPasswordBox)}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Grid>
                  </Grid> */}

                  {/* set password toggle */}
                  {!can_set_pw && (
                    <Grid
                      container
                      id="can_set_pw"
                      className="passwordMainContainer"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                        // height: openPasswordBox ? '220px' : '0px',
                        overflow: "hidden",
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        sx={{
                          width: "100%",
                          display: "flex",
                          alignItems: " end",
                          justifyContent: "end",
                        }}
                      >
                        <Box
                          component="form"
                          autoComplete="off"
                          sx={{ width: "100%" }}
                          className="passwordContainerBox"
                        >
                          <Stack direction="column">
                            {/* password content header */}
                            <Stack direction="row" spacing={1}>
                              <Box
                                sx={{
                                  fontSize: "15px",
                                  color: "#384874",
                                  fontWeight: 500,
                                }}
                              >
                                Set a Password to the user
                              </Box>
                              <Chip size="small" label="Security" />
                            </Stack>
                            <Box
                              sx={{
                                color: "#475467",
                                fontSize: "12px",
                                fontWeight: "300",
                                mt: 1,
                              }}
                            >
                              A password would be set along with the details above for signing up
                            </Box>
                            {/* password forms */}
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
                                      className="form_input"
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
                                      id="confirm_password"
                                      type={showPasswordNew ? "text" : "password"}
                                      fullWidth
                                      sx={{ marginTop: "5px" }}
                                      placeholder="Re-enter your password here"
                                      className="form_input"
                                      value={values.confirm_password}
                                      error={
                                        errors.confirm_password && touched.confirm_password
                                          ? true
                                          : false
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
                                      {errors?.confirm_password && touched?.confirm_password && (
                                        <div
                                          style={{
                                            color: "red",
                                            lineHeight: 1.6,
                                            paddingTop: "8px",
                                          }}
                                        >
                                          {errors?.confirm_password
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
                            </Stack>
                          </Stack>
                        </Box>
                      </Grid>
                    </Grid>
                  )}
                </div>
                {/* submit button */}

                <Stack
                  direction="row"
                  spacing={2}
                  paddingTop={5}
                  paddingBottom={3}
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <div className="add_another_btn">
                    <Grid item>
                      <Button
                        variant="outlined"
                        type="submit"
                        disabled={!isValid || !dirty || isSubmitting}
                      >
                        Add Another User
                      </Button>
                    </Grid>
                  </div>
                  <Grid item>
                    <Button
                      disabled={isSubmitting ? true : false}
                      variant="contained"
                      type="submit"
                      sx={{ width: "160px" }}
                    >
                      {isSubmitting ? <ButtonLoaderSpinner /> : "Send Sign Up Link"}
                    </Button>
                  </Grid>
                </Stack>
              </Form>
            );
          }}
        </Formik>
      </div>
    </>
  );
};

export default OrgForms;
