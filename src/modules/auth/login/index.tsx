import * as React from "react";
import Box from "@mui/material/Box";
import BrandLogo from "src/assets/images/logo.svg";
import LoginStar from "src/assets/images/login_stars.svg";
import UserImages from "src/assets/images/login_avatars.png";
import RoundedArrow from "src/assets/images/rounded_arrow.svg";
import { v4 as uuidv4 } from "uuid";
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
import { Link, Navigate, useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import "../../../styles/authentication.scss";
import { useAuthStore } from "src/store/zustand/globalStates/auth";
import AuthFooter from "../../../components/AuthFooter";
import { Form } from "formik";
import { Formik, Field, FormikProps } from "formik";
import { SignInSchema } from "src/components/validationSchema";
import { getAPI, postAPI } from "src/lib/axios/src/lib/axios";
import { userDataStore } from "src/store/zustand/globalStates/userData";
import jwtDecode from "jwt-decode";
import { loggedUserDataStore } from "src/store/zustand/globalStates/loggedUserData";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import useAppStore from "src/store/zustand/app";
import { useSnackbar } from "notistack";
import ButtonLoaderSpinner from "src/components/ButtonLoaderSpinner/ButtonLoaderSpinner";

interface ISignUpForm {
  login_id: string;
  password: string;
}
const Login: React.FC = () => {
  const { setUserData } = userDataStore();
  const { loginInUser, error: ERROR, setError }: any = useAppStore();
  const { setOrgData } = loggedUserDataStore();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  // const [error, setError] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const [errorMessage, setErrorMessage] = React.useState("");
  const [count, setCount] = React.useState(10);
  const param = window.location.pathname;
  const { enqueueSnackbar } = useSnackbar();

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  let initialValues = {
    login_id: "",
    password: "",
  };

  const submitHandler = async (values: any, actions: any) => {
    const { login_id, password, remember } = values;

    let formData = new FormData();
    formData.append("username", login_id);
    formData.append("password", password);
    formData.append("scope", remember && remember[0] === "on" ? "1" : "0");

    actions.setSubmitting(true);

    const apiResponse = await loginInUser({ values: formData, navigate });
    if (!apiResponse) {
      setOpen(true);
    }
  };

  React.useEffect(() => {
    if (Number(ERROR?.block_time) > 0) {
      // let t = Number(ERROR?.block_time);
      const timer = setTimeout(() => {
        if (count > 0) {
          setCount((prev: number) => prev - 1);
        } else {
          setError({});
        }
      }, 1000);
    }
  }, [count]);

  React.useEffect(() => {
    if (ERROR?.block_time) {
      setCount(Number(ERROR?.block_time));
    }
  }, [ERROR]);

  const handleErrorMessage = () => {
    if (typeof ERROR?.remaining_attempts === "number" && !ERROR?.block_time) {
      return <>{`${ERROR?.message}. Remaining Attempts:${ERROR?.remaining_attempts}`}</>;
    } else if (typeof ERROR?.block_time === "number" && ERROR?.block_time > 0) {
      // setCount(ERROR?.block_time);
      return <>{`${ERROR?.message} Please try again after: ${count}`}</>;
    } else {
      return <>{`${ERROR?.message} `}</>;
    }
    return <></>;
  };

  return (
    <>
      <Box className="main_container">
        <Box className="main_inner_container">
          <Box className="flex_container">
            {/* left */}
            <Box className="left_container">
              <Box sx={{ width: "100%" }}>
                <Box sx={{ padding: "0 22%" }}>
                  <Box>
                    <img src={BrandLogo} alt="bas" style={{ height: "50px", width: "50px" }} />
                    <Box sx={{ marginTop: "26px" }}>
                      <Typography
                        variant="h4"
                        component="h4"
                        sx={{ fontWeight: "600", color: "#384874" }}
                      >
                        Log In
                      </Typography>
                      <Typography
                        variant="body2"
                        component="p"
                        sx={{ marginTop: "8px", color: "#475467" }}
                      >
                        Welcome! Please enter your details
                      </Typography>
                    </Box>
                  </Box>
                  {/* forms */}
                  <Formik
                    initialValues={initialValues}
                    onSubmit={submitHandler}
                    validationSchema={SignInSchema}
                  >
                    {(props: FormikProps<ISignUpForm>) => {
                      const { values, touched, errors, handleBlur, handleChange, isSubmitting } =
                        props;

                      return (
                        <Form style={{ marginTop: "30px" }}>
                          {Object.keys(ERROR)?.length > 0 && (
                            <Box sx={{ width: "100%", marginBottom: "10px" }}>
                              <Alert
                                severity="error"
                                action={
                                  <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                      setError("");
                                    }}
                                  >
                                    <CloseOutlinedIcon fontSize="inherit" />
                                  </IconButton>
                                }
                                sx={{ mb: 2 }}
                              >
                                {handleErrorMessage()}
                              </Alert>
                            </Box>
                          )}

                          <InputLabel htmlFor="login_id" className="input_label">
                            Email ID
                          </InputLabel>
                          <Field
                            as={OutlinedInput}
                            size="small"
                            id="login_id"
                            name="login_id"
                            type="text"
                            fullWidth
                            sx={{ marginTop: "5px" }}
                            placeholder="Enter your email"
                            className="form_input"
                            value={values.login_id}
                            error={errors.login_id && touched.login_id ? true : false}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors?.login_id && touched?.login_id && (
                            <FormHelperText style={{ color: "red" }}>
                              {errors?.login_id}
                            </FormHelperText>
                          )}
                          <InputLabel
                            htmlFor="password"
                            className="input_label"
                            sx={{ marginTop: "17px" }}
                          >
                            Password
                          </InputLabel>
                          <Field
                            as={OutlinedInput}
                            size="small"
                            id="password"
                            name="password"
                            className="form_input"
                            value={values.password}
                            error={errors.password && touched.password ? true : false}
                            placeholder="Enter you password"
                            fullWidth
                            type={showPassword ? "text" : "password"}
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

                          <Box mt={2}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Stack direction="row" justifyContent="center" alignItems="center">
                                <Field
                                  as={Checkbox}
                                  size="small"
                                  id="remember"
                                  name="remember"
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
                                  Remember for 30 days
                                </Box>
                              </Stack>
                              <Link to="/forgot-password" className="link_style">
                                <Box>Forgot Password?</Box>
                              </Link>
                            </Stack>
                          </Box>

                          <Button
                            variant="contained"
                            className="login_button"
                            disabled={isSubmitting || (ERROR.block_time && count > 0)}
                            fullWidth
                            type="submit"
                          >
                            {isSubmitting ? <ButtonLoaderSpinner /> : "Log in "}
                          </Button>
                        </Form>
                      );
                    }}
                  </Formik>
                </Box>
              </Box>
              <AuthFooter />
            </Box>

            {/* For platform login right  */}

            {param === "/tenant/login" && (
              <>
                <Box className="tenant_right_containerr"></Box>
              </>
            )}
            {param === "/organization/login" && (
              <>
                <Box className="organization_right_container"></Box>
              </>
            )}

            {param === "/" && (
              <>
                <Box className="right_container">
                  <Box sx={{ padding: "0 10%" }}>
                    <Box>
                      <img src={LoginStar} alt="stars" style={{ height: "55px", width: "55px" }} />
                    </Box>
                    <Box sx={{ position: "relative" }}>
                      <Typography
                        component="h2"
                        variant="h2"
                        my={3}
                        className="login_image_inner_text"
                      >
                        We help you do the best inspections.
                      </Typography>
                      <Typography
                        component="h6"
                        variant="h6"
                        fontSize={14}
                        my={2}
                        sx={{ color: "#EAECF0" }}
                      >
                        Create a free account and get full access to all templates.
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ width: "100%" }}>
                        <Box>
                          <img
                            src={UserImages}
                            alt="users"
                            style={{
                              height: "30px",
                              width: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                        <Box fontSize={12} color="#EAECF0">
                          Join 40,000+ Users
                        </Box>
                      </Stack>

                      <Box
                        sx={{
                          position: "absolute",
                          left: "-34%",
                          bottom: "-55%",
                        }}
                      >
                        <img
                          src={RoundedArrow}
                          alt="rouded_arrow"
                          style={{ height: "65%", width: "65%" }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </>
            )}

            {/* For tenant login */}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Login;
