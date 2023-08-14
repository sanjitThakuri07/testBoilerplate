import React from "react";
import {
  Alert,
  Box,
  Button,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Snackbar,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { Link } from "react-router-dom";
import "../../../styles/authentication.scss";
import KeyIcon from "../../../assets/icons/key_icon.svg";
import LeftArrow from "../../../assets/icons/left_arrow.svg";
import AuthFooter from "../../../components/AuthFooter";
import { Field, Form, Formik, FormikProps } from "formik";
import { validEmailSchema } from "src/components/validationSchema";
import { postAPI } from "src/lib/axios";
import { AuthApis } from "../constants";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

interface IForgotPasswordForm {
  email: string;
}
const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState("");

  const { enqueueSnackbar } = useSnackbar();

  let initialValues = {
    email: "",
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const submitHandler = async (values: any, actions: any) => {
    const { email } = values;
    actions.setSubmitting(true);
    await postAPI(AuthApis.FORGOT_PASSWORD, {
      user_id: email,
    })
      .then((res: { data: any; status: any }) => {
        actions.setSubmitting(false);
        if (res.status === 200) {
          actions.resetForm();
          navigate("/password-reset-link");
          enqueueSnackbar("Password reset link sent to your email", {
            variant: "success",
          });
        } else {
        }
      })
      .catch((err) => {
        setError(err?.response?.data?.detail?.message || "Cannot process your request");
        setOpen(true);
        actions.setSubmitting(false);
      });
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
      <Box className="main_container">
        <Box className="forgot_password_inner">
          <Box sx={{ width: "60%" }}>
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
                Forgot Password?
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
                Enter your email and we’ll send you instructions on how to reset your password.
              </Typography>
              <Box sx={{ width: "100%" }}>
                <Formik
                  initialValues={initialValues}
                  onSubmit={submitHandler}
                  validationSchema={validEmailSchema}
                >
                  {(props: FormikProps<IForgotPasswordForm>) => {
                    const { values, touched, errors, handleBlur, handleChange, isSubmitting } =
                      props;
                    return (
                      <Form style={{ marginTop: "30px" }}>
                        <InputLabel htmlFor="email" className="input_label">
                          Email ID
                        </InputLabel>
                        <Field
                          as={OutlinedInput}
                          size="small"
                          id="email"
                          type="text"
                          fullWidth
                          sx={{ marginTop: "5px" }}
                          placeholder="Enter your email"
                          className="form_input"
                          value={values.email}
                          error={errors.email && touched.email ? true : false}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors?.email && touched?.email && (
                          <FormHelperText style={{ color: "red" }}>{errors?.email}</FormHelperText>
                        )}
                        <Button
                          variant="contained"
                          className="login_button"
                          data-testid="login_button"
                          disabled={isSubmitting ? true : false}
                          fullWidth
                          type="submit"
                        >
                          {isSubmitting ? "Sending..." : "Send Reset Link "}
                        </Button>
                      </Form>
                    );
                  }}
                </Formik>
              </Box>
              <div className="back_to_login_btn">
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
              </div>
            </Stack>
          </Box>
          {/* auth footer */}

          <div className="auth_footer">
            <AuthFooter />
          </div>
        </Box>
      </Box>
    </>
  );
};
export default ForgotPassword;
