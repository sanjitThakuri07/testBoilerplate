import { AuthRoute } from "constants/variables";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { IPasswordCriteria, validatePassword } from "utils/validatePassword";
import { ChangeEvent } from "react";
import { useFormik } from "formik";
import PasswordSchema from "validationSchemas/Password";
import SettingFooter from "src/components/footer/SettingFooter";
import { FormikFormHelpers } from "interfaces/utils";
import { postAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import { PasswordPayload } from "interfaces/passwordValidation";
import ModalLayout from "src/components/ModalLayout";
import ForgotPassword from "src/modules/auth/forgotPassword";
import useAppStore from "src/store/zustand/app";

const initialValues: PasswordPayload = {
  old_password: "",
  new_password: "",
  confirm_password: "",
};

const ChangePassword = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [showPasswordOld, setShowPasswordOld] = useState<boolean>(false);
  const [showPasswordNew, setShowPasswordNew] = useState<boolean>(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isViewOnly, setIsViewOnly] = useState<boolean>(true);
  const [openFormModal, setOpenFormModal] = useState(false);
  const { sendResetPassword, userSecurity, loading: SystemLoading }: any = useAppStore();

  const [passwordCriteria, setPasswordCriteria] = useState<IPasswordCriteria[]>([
    {
      value: "Atleast 8 characters.",
      key: "minEight",
    },
    {
      value: "Atleast 1 Digit.",
      key: "atLeastNumber",
    },
    {
      value: "Cannot use space.",
      key: "isSpace",
    },
  ]);
  const handleClickShowPasswordOld = () => {
    if (isViewOnly) return;
    setShowPasswordOld((show) => !show);
  };
  const handleClickShowPasswordNew = () => {
    if (isViewOnly) return;
    setShowPasswordNew((show) => !show);
  };
  const handleClickShowPasswordConfirm = () => {
    if (isViewOnly) return;
    setShowPasswordConfirm((show) => !show);
  };
  const handleChangePassword = async (values: PasswordPayload) => {
    try {
      setLoading(true);
      const { data, ...res } = await postAPI("/user/profile/change-password/", values);
      setIsViewOnly(true);
      setLoading(false);
      enqueueSnackbar(res?.message || "updated successfully", {
        variant: "success",
      });
    } catch (error: any) {
      setLoading(false);
      // resetForm();
      enqueueSnackbar(error?.detail || "Error on changing the password", {
        variant: "error",
      });
    }
  };
  const formik = useFormik({
    enableReinitialize: true,
    onSubmit: handleChangePassword,
    initialValues,
    validationSchema: PasswordSchema({ validationData: userSecurity }),
  });

  const {
    touched,
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    isValid,
    dirty,
  } = formik;

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handlePasswordChange = (ev: ChangeEvent<HTMLInputElement>): void => {
    const password = ev.target.value || "";
    handleChange(ev);
    const pw = validatePassword(passwordCriteria, password);
    setPasswordCriteria(pw);
  };

  const handleViewOnly = () => {
    setIsViewOnly(!isViewOnly);
    resetForm();
  };

  const formikHelpers: FormikFormHelpers = {
    isValid,
    dirty,
    touched: Object.values(touched).length > 0,
  };

  return (
    <>
      <ModalLayout
        children={
          <>
            <div className="config_modal_form_css">
              <div id="FORGET_PASSWORD_INNER_CONTAINER">
                <ForgotPassword />
              </div>
            </div>
          </>
        }
        openModal={openFormModal}
        setOpenModal={() => {
          setOpenFormModal(!openFormModal);
        }}
      />

      <form className={`profile-form ${isViewOnly ? "edit-mode" : ""}`} onSubmit={handleSubmit}>
        {loading && <CircularProgress className="page-loader" />}

        <Grid container spacing={4} className="formGroupItem">
          <Grid item xs={4}>
            <InputLabel htmlFor="oldPassword">
              <div className="label-heading">Old Password</div>
            </InputLabel>
          </Grid>
          <Grid item xs={7}>
            <OutlinedInput
              name="old_password"
              type={showPasswordOld ? "text" : "password"}
              size="small"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.old_password}
              error={Boolean(touched.old_password && errors.old_password)}
              disabled={isViewOnly}
              placeholder="*******"
              endAdornment={
                !isViewOnly && (
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
                )
              }
              fullWidth
            />
            {Boolean(touched.old_password && errors.old_password) && (
              <FormHelperText error>{errors.old_password}</FormHelperText>
            )}
            {/* <Link to={AuthRoute.FORGOT_PASSWORD}>Forgot Password?</Link> */}
            <a
              href=""
              onClick={(e) => {
                e.preventDefault();
                setOpenFormModal(!openFormModal);
              }}
            >
              {" "}
              Forgot Password?{" "}
            </a>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={4}
          className="formGroupItem"
          display={isViewOnly ? "none" : "flex"}
        >
          <Grid item xs={4}>
            <InputLabel htmlFor="newPassword">
              <div className="label-heading">New Password</div>
            </InputLabel>
          </Grid>
          <Grid item xs={7}>
            <OutlinedInput
              name="new_password"
              type={showPasswordNew ? "text" : "password"}
              size="small"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.new_password}
              error={Boolean(
                passwordCriteria.some((pw) => pw.valid === false) ||
                  (touched.new_password && errors.new_password),
              )}
              disabled={isViewOnly}
              placeholder="Enter your password"
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
              fullWidth
            />

            {errors?.new_password && touched?.new_password && (
              <div
                style={{
                  color: "red",
                  lineHeight: 1.6,
                  paddingTop: "8px",
                }}
              >
                {errors?.new_password?.split("<br/>")?.map((mssg: string) => {
                  return <p style={{ margin: 0 }}>{mssg}</p>;
                })}
              </div>
            )}
            {/* <div className="mt-1 mb-h">
              {passwordCriteria?.map((pc) => (
                <Typography
                  variant="caption"
                  component="p"
                  sx={{
                    color:
                      pc.valid !== undefined
                        ? pc.valid
                          ? 'success.main'
                          : 'error.main'
                        : 'text.primary',
                  }}
                  key={pc.key}>
                  {pc.value}
                </Typography>
              ))}
            </div> */}
          </Grid>
        </Grid>
        <Grid
          container
          spacing={4}
          className="formGroupItem"
          display={isViewOnly ? "none" : "flex"}
        >
          <Grid item xs={4}>
            <InputLabel htmlFor="confirmNewPassword">
              <div className="label-heading">Confirm New Password</div>
            </InputLabel>
          </Grid>
          <Grid item xs={7}>
            <OutlinedInput
              name="confirm_password"
              type={showPasswordConfirm ? "text" : "password"}
              size="small"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.confirm_password}
              error={Boolean(touched.confirm_password && errors.confirm_password)}
              disabled={isViewOnly}
              placeholder="Re enter your new password"
              endAdornment={
                <InputAdornment position="end" sx={{ paddingRight: "6px" }}>
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPasswordConfirm}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              fullWidth
            />
            {errors?.confirm_password && touched?.confirm_password && (
              <div
                style={{
                  color: "red",
                  lineHeight: 1.6,
                  paddingTop: "8px",
                }}
              >
                {errors?.confirm_password?.split("<br/>")?.map((mssg: string) => {
                  return <p style={{ margin: 0 }}>{mssg}</p>;
                })}
              </div>
            )}
            {/* {values.confirm_password.length >= 1 &&
              values.confirm_password === values.new_password && (
                <FormHelperText
                  sx={{
                    color: 'success.main',
                  }}>
                  Matched.
                </FormHelperText>
              )} */}
          </Grid>
        </Grid>
        <SettingFooter
          isViewOnly={isViewOnly}
          loading={loading}
          handleViewOnly={handleViewOnly}
          formikHelpers={formikHelpers}
        />
      </form>
    </>
  );
};

export default ChangePassword;
