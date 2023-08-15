import React from "react";
import { Box, Button, FormHelperText, InputLabel, OutlinedInput, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "../../../styles/authentication.scss";
import KeyIcon from "src/assets/icons/key_icon.svg";
import LeftArrow from "src/assets/icons/left_arrow.svg";
import AuthFooter from "../../../components/AuthFooter";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Field, Form, Formik, FormikProps } from "formik";
import { setNewPasswordSchema } from "src/components/validationSchema";
import { postAPI } from "src/lib/axios";
import { AuthApis } from "../constants";
import { useSnackbar } from "notistack";

interface IConfirmPassword {
  password: string;
  confirmPassword: string;
}

const SetNewPassword: React.FC = () => {
  const navigate = useNavigate();
  // getting the serach params
  const [searchParams] = useSearchParams();
  // getting the user token and user_id
  const token = searchParams.get("token");
  const user_id = searchParams.get("user_id");

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const submitHandler = (values: any, actions: any) => {
    const { password, confirmPassword } = values;
    actions.setSubmitting(true);
    postAPI(AuthApis.SETNEW_PASSWORD, {
      login_id: user_id && user_id,
      password,
      confirm_password: confirmPassword,
      token: token && token,
    })
      .then((res: { data: any; status: any }) => {
        actions.setSubmitting(false);
        if (res.status === 201) {
          actions.resetForm();
          navigate("/password-reset-success");
        }
      })
      .catch((err) => {
        enqueueSnackbar(err?.response?.data?.detail?.message || "Cannot process your request", {
          variant: "error",
        });

        actions.setSubmitting(false);
      });
  };

  return (
    <>
      {/* error toaster  */}
      {/* <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar> */}
      <Box className="main_container">
        <Box className="forgot_password_inner">
          <Box sx={{ width: "40%" }}>
            <Stack
              sx={{
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <div className="forgot_password_key_cotainer">
                <img src={KeyIcon} alt="key" />
              </div>
              <Typography
                mt={3}
                variant="h4"
                component="h4"
                sx={{ fontWeight: "600", color: "#384874", textAlign: "center" }}
              >
                Set New Password?
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  color: "#475467",
                }}
                variant="body2"
                component="p"
                mt={2}
              >
                Your new password must be different to previously used passwords.
              </Typography>

              <Box sx={{ width: "100%" }}>
                <Formik
                  initialValues={{
                    password: "",
                    confirmPassword: "",
                  }}
                  onSubmit={submitHandler}
                  validationSchema={setNewPasswordSchema({})}
                >
                  {(props: FormikProps<IConfirmPassword>) => {
                    const { values, touched, errors, handleBlur, handleChange, isSubmitting } =
                      props;
                    return (
                      <Form style={{ marginTop: "30px" }}>
                        {/* password */}
                        <InputLabel
                          htmlFor="password"
                          className="input_label"
                          sx={{ marginTop: "17px", marginBottom: "5px" }}
                        >
                          New Password
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

                        {/* confirm password */}
                        <InputLabel
                          htmlFor="password"
                          className="input_label"
                          sx={{ marginTop: "17px", marginBottom: "5px" }}
                        >
                          Confirm Password
                        </InputLabel>
                        <Field
                          as={OutlinedInput}
                          size="small"
                          id="confirmPassword"
                          className="form_input"
                          value={values.confirmPassword}
                          error={errors.confirmPassword && touched.confirmPassword ? true : false}
                          placeholder="Re enter your password"
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

                        <Box sx={{ marginTop: "10px" }}>
                          <Button
                            variant="contained"
                            className="login_button"
                            fullWidth
                            disabled={isSubmitting ? true : false}
                            type="submit"
                          >
                            {isSubmitting ? "Resetting..." : "Reset Password"}
                          </Button>
                        </Box>
                      </Form>
                    );
                  }}
                </Formik>
              </Box>

              <Link to="/" className="link_style">
                <Stack
                  spacing={1}
                  mt={5}
                  direction="row"
                  alignContent="center"
                  justifyContent="center"
                >
                  <Box>
                    <img
                      src={LeftArrow}
                      alt="left"
                      style={{
                        height: "12px",
                        width: "12px",
                        marginTop: "2px",
                      }}
                    />
                  </Box>
                  <Box> Back to Log In</Box>
                </Stack>
              </Link>
            </Stack>
          </Box>
          {/* auth footer */}
          <AuthFooter />
        </Box>
      </Box>
    </>
  );
};

export default SetNewPassword;
