import React from "react";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import {
  InputLabel,
  Typography,
  OutlinedInput,
  Button,
  Stack,
  Checkbox,
  InputAdornment,
  IconButton,
  FormHelperText,
  Snackbar,
  Alert,
} from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import BrandLogo from "src/assets/images/logo.svg";
import { ReactComponent as TickIcon } from "src/assets/icons/step_icon_tick.svg";
import { ReactComponent as StepBlankIcon } from "src/assets/icons/step_icon_blank.svg";
import EmailIcon from "src/assets/icons/email_icon.svg";
import { Form } from "formik";
import { Formik, Field, FormikProps } from "formik";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { setNewPasswordSchema } from "src/components/validationSchema";
import ButtonLoaderSpinner from "src/components/ButtonLoaderSpinner/ButtonLoaderSpinner";
import { postAPI } from "src/lib/axios";
import { useSearchParams } from "react-router-dom";
import CheckIcon from "src/assets/icons/check_icon.svg";
import { Link } from "react-router-dom";
import { AuthApis } from "src/modules/auth/constants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface ISignUpForm {
  login_id: string | null;
  password: string;
  confirmPassword: string;
}

export default function TenantRegister() {
  const [searchParams] = useSearchParams();
  // getting the serach params
  const token = searchParams.get("token");
  const user_id = searchParams.get("login_id");
  const full_name = searchParams.get("full_name");

  // stepper content
  const [activeStep, setActiveStep] = React.useState(1);
  const steps = [
    {
      label: "Set password",
      description: `Choose a strong password so as to keep your account safe and secure.`,
    },
    {
      label: "Completed",
      description: "Congratulations, you have created an account.",
    },
  ];

  //   password visibility
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [checked, setChecked] = React.useState(false);
  // snackbar error handling
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>("");
  // displaying the success component after setting up password
  const [accountCreateSuccess, setAccountCreateSuccess] = React.useState<boolean>(false);

  // form initial values
  let initialValues = {
    login_id: user_id,
    password: "",
    confirmPassword: "",
  };

  const QontoStepIcon = (props: any) => {
    const { completed } = props;

    return <>{completed ? <TickIcon /> : <StepBlankIcon />}</>;
  };

  const path = window.location.pathname;

  console.log({ path });

  const postAPIPath = (path: string) => {
    if (path === "/organization-register") {
      return AuthApis.ORGANIZATION_SIGNUP;
    } else if (path === "/tenant-register") {
      return AuthApis.TENANT_SIGNUP;
    }
  };

  const submitHandler = (values: any, actions: any) => {
    const { login_id, password, confirmPassword } = values;

    actions.setSubmitting(true);
    postAPI(
      path === "/organization-register"
        ? AuthApis.ORGANIZATION_SIGNUP
        : path === "/tenant-register"
        ? AuthApis.TENANT_SIGNUP
        : path === "/customer-register"
        ? AuthApis.CUSTOMER_SIGNUP
        : path === "/organization-user-register"
        ? AuthApis.ORGANIZATION_USER_SIGNUP
        : "",
      {
        login_id,
        password,
        confirm_password: confirmPassword,
        token: token && token,
      },
    )
      .then((res: { data: any; status: any }) => {
        actions.setSubmitting(false);
        if (res.status === 201) {
          setActiveStep(() => activeStep + 1);
          setAccountCreateSuccess(true);
          actions.resetForm();
        }
      })
      .catch((err) => {
        setOpen(true);
        setError(err?.response?.detail?.message || "Cannot process your request");
        actions.setSubmitting(false);
      });
  };

  // closing the snackbar
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      {/* error toaster  */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
      <Grid container sx={{ height: "100vh" }}>
        {/* step container */}
        <Grid
          item
          xs={5}
          md={3}
          sx={{ background: "#1D2939", color: "#fff", position: "relative" }}
        >
          <Stack direction="column" sx={{ padding: "5% 10%" }}>
            {/* image container */}
            <Box sx={{ mt: 2 }}>
              <img src={BrandLogo} alt="bas" style={{ height: "50px", width: "50px" }} />
            </Box>
            {/* password steps container */}
            <Box sx={{ mt: 8 }}>
              <Stepper activeStep={activeStep} orientation="vertical" className="stepper_container">
                {steps.map((step, index) => (
                  <Step key={index} active={index === 0 || index === 1}>
                    <StepLabel
                      StepIconComponent={QontoStepIcon}
                      className="tenant_password_step_label"
                    >
                      {step.label}
                    </StepLabel>
                    <StepContent className="tenant_step_content">
                      <Typography sx={{ fontWeight: "400", fontSize: "16px" }}>
                        {step.description}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Stack>

          <Stack
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "absolute",
              width: "100%",
              bottom: "2%",
            }}
            direction="row"
            color=" #D0D5DD"
            fontSize="11px"
          >
            <div style={{ paddingLeft: "20px" }}>&copy; BAS Copyright 2022 - Propel Marine</div>
            <div style={{ paddingRight: "20px" }}>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <img src={EmailIcon} alt="email" style={{ height: "12px", width: "12px" }} />
                <Box>help@bas.com</Box>
              </Stack>
            </div>
          </Stack>
        </Grid>
        {/* form container */}
        <Grid
          item
          xs={7}
          md={9}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Box className="left_container">
            <Box sx={{ width: "100%" }}>
              {accountCreateSuccess ? (
                <Box sx={{ padding: "0 20%" }}>
                  <Stack
                    direction="column"
                    sx={{
                      justifyContent: "center",
                      // alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <div className="password_reset_success">
                      <img src={CheckIcon} alt="check" />
                    </div>
                    <Typography
                      mt={2}
                      variant="h6"
                      component="h6"
                      sx={{
                        fontWeight: "600",
                        color: "#384874",
                      }}
                    >
                      You have created an account successfully!
                    </Typography>
                    <Typography
                      sx={{
                        color: "#475467",
                      }}
                      variant="body2"
                      component="p"
                      mt={1}
                    >
                      Please login with the updated credentials to enter the platform.
                    </Typography>
                    <Box mt={4} width="100%">
                      <Link to="/">
                        <Button
                          variant="contained"
                          className="login_button"
                          fullWidth
                          type="submit"
                        >
                          Back to Log in
                        </Button>
                      </Link>
                    </Box>
                  </Stack>
                </Box>
              ) : (
                <Box sx={{ padding: "0 20%" }}>
                  <Box>
                    <Box sx={{ marginTop: "26px" }}>
                      <Typography
                        variant="h4"
                        component="h4"
                        sx={{ fontWeight: "600", color: "#384874" }}
                      >
                        Sign Up
                      </Typography>
                      <Typography
                        variant="body2"
                        component="p"
                        sx={{ marginTop: "8px", color: "#475467" }}
                      >
                        <span>Welcome, </span>
                        <span style={{ fontWeight: "600" }}>
                          {full_name ? `${full_name}!` : "N/A"}
                        </span>
                      </Typography>
                    </Box>
                  </Box>
                  {/* forms */}
                  <Formik
                    initialValues={initialValues}
                    onSubmit={submitHandler}
                    validationSchema={setNewPasswordSchema({})}
                  >
                    {(props: FormikProps<ISignUpForm>) => {
                      const { values, touched, errors, handleBlur, handleChange, isSubmitting } =
                        props;
                      return (
                        <Form style={{ marginTop: "40px" }}>
                          <InputLabel htmlFor="login_id" className="input_label">
                            Email Address
                          </InputLabel>
                          <Field
                            as={OutlinedInput}
                            disabled
                            size="small"
                            id="login_id"
                            name="login_id"
                            type="text"
                            fullWidth
                            sx={{ marginTop: "5px" }}
                            placeholder="Enter your email address"
                            className="form_input"
                            value={values.login_id}
                          />

                          {/* password set up */}
                          {/* password */}
                          <InputLabel
                            htmlFor="password"
                            className="input_label"
                            sx={{ marginTop: "17px", marginBottom: "5px" }}
                          >
                            Choose a Password*
                          </InputLabel>
                          <Field
                            as={OutlinedInput}
                            size="small"
                            id="password"
                            className="form_input"
                            value={values.password}
                            error={errors.password && touched.password ? true : false}
                            placeholder="Enter your password"
                            fullWidth
                            type={showPassword ? "text" : "password"}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            endAdornment={
                              <InputAdornment position="start">
                                <IconButton
                                  onClick={() => setShowPassword((show) => !show)}
                                  edge="end"
                                  sx={{ color: "#667085" }}
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            }
                          />
                          {errors?.password && touched?.password && (
                            <FormHelperText style={{ color: "red" }}>
                              {errors?.password}
                            </FormHelperText>
                          )}

                          <Box sx={{ mt: 0.5, fontSize: "13px", color: "#475467" }}>
                            Make sure it’s atleast 8 characters{" "}
                          </Box>

                          {/* confirm password */}
                          <InputLabel
                            htmlFor="password"
                            className="input_label"
                            sx={{ marginTop: "17px", marginBottom: "5px" }}
                          >
                            Confirm Password*
                          </InputLabel>
                          <Field
                            as={OutlinedInput}
                            size="small"
                            id="confirmPassword"
                            className="form_input"
                            value={values.confirmPassword}
                            error={errors.confirmPassword && touched.confirmPassword ? true : false}
                            placeholder="Confirm your password"
                            fullWidth
                            type={showConfirmPassword ? "text" : "password"}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            endAdornment={
                              <InputAdornment position="start">
                                <IconButton
                                  onClick={() => setShowConfirmPassword((show) => !show)}
                                  edge="end"
                                  sx={{ color: "#667085" }}
                                >
                                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            }
                          />
                          {errors?.confirmPassword && touched?.confirmPassword && (
                            <FormHelperText style={{ color: "red" }}>
                              {errors?.confirmPassword}
                            </FormHelperText>
                          )}

                          <Box mt={2}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Stack direction="row" justifyContent="center" alignItems="center">
                                <Field
                                  as={Checkbox}
                                  id="remember"
                                  name="remember"
                                  checked={checked}
                                  onChange={() => setChecked(!checked)}
                                  size="small"
                                  sx={{
                                    color: "#D0D5DD",
                                    "&.Mui-checked": {
                                      color: "#33426A",
                                    },
                                  }}
                                />
                                <Box
                                  sx={{
                                    fontSize: "13px",
                                    fontWeight: "500",
                                    color: "#344054",
                                  }}
                                >
                                  <span>I agree to the </span>
                                  <a
                                    href="/privacy-policy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    online evaluation license
                                  </a>
                                  <span>*.</span>
                                </Box>
                              </Stack>

                              <div
                                className="back_to_home"
                                style={{
                                  float: "right",
                                }}
                              >
                                <Link to="/">
                                  <Button
                                    variant="text"
                                    startIcon={<ArrowBackIcon />}
                                    sx={{
                                      fontSize: "13px",
                                      fontWeight: "500",
                                      color: "#344054",
                                    }}
                                  >
                                    Back to Log in
                                  </Button>
                                </Link>
                              </div>
                            </Stack>
                          </Box>

                          <Button
                            variant="contained"
                            className="login_button"
                            disabled={
                              isSubmitting || !(Object.keys(errors).length === 0 && checked)
                                ? true
                                : false
                            }
                            fullWidth
                            type="submit"
                          >
                            {isSubmitting ? <ButtonLoaderSpinner /> : "Get started"}
                          </Button>
                        </Form>
                      );
                    }}
                  </Formik>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
