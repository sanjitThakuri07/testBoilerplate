import { IOSSwitch } from "src/components/switch/IosSwitch";
import {
  Box,
  Button,
  CircularProgress,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { UserSecurityPayload } from "src/interfaces/userSecurity";
import { useFormik } from "formik";
import UserSecuritySchema from "src/validationSchemas/UserSecurity";
import { ChangeEvent, useState } from "react";
import SettingFooter from "src/components/footer/SettingFooter";
import { FormikFormHelpers } from "src/interfaces/utils";
import { getAPI, postAPI } from "src/lib/axios";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import HeightContainer from "src/components/FixHeightContainer";

const initialValues: UserSecurityPayload = {
  block_time_increment: 0,
  has_character: false,
  has_number: false,
  has_uppercase: false,
  login_attempt_counts: 0,
  min_password_length: 0,
  password_rotation: 0,
};

const UserSecurity = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isViewOnly, setIsViewOnly] = useState<boolean>(true);
  const [initialSecurityValues, setInitialSecurityValues] = useState<UserSecurityPayload | null>(
    null,
  );

  const { enqueueSnackbar } = useSnackbar();

  const handleUserSecurity = async (values: UserSecurityPayload) => {
    try {
      setLoading(true);
      const { data, ...res } = await postAPI("/security/", {
        ...values,
        has_character: Number(values?.has_character),
        has_number: Number(values?.has_number),
        has_uppercase: Number(values?.has_uppercase),
      });
      setInitialSecurityValues(values);
      setIsViewOnly(true);
      setLoading(false);
      enqueueSnackbar(res?.message || "updated successfully", {
        variant: "success",
      });
    } catch (error: any) {
      setLoading(false);
      resetForm();
      initialSecurityValues && setValues(initialSecurityValues);
      enqueueSnackbar(error?.detail || "Error on update the user security", {
        variant: "error",
      });
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    onSubmit: handleUserSecurity,
    initialValues,
    // validationSchema: UserSecuritySchema,
  });

  const {
    touched,
    values,
    errors,
    handleChange,
    handleBlur,
    setFieldTouched,
    setFieldValue,
    handleSubmit,
    resetForm,
    isValid,
    setValues,
    dirty,
  } = formik;

  const fetchUserSecurityDetails = async () => {
    try {
      setLoading(true);
      const { data } = await getAPI("security/");
      setValues(data);
      setInitialSecurityValues(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      resetForm();
      initialSecurityValues && setValues(initialSecurityValues);
    }
  };

  // no_of_rows: 0,
  // regions: false,
  // len_of_code: 0,
  // territory: false,
  // inspection_type: false,
  // customer: false,

  const handleSwitchChange = (ev: ChangeEvent<HTMLInputElement>): void => {
    const name = ev.target.name as keyof UserSecurityPayload;
    setFieldValue(name, !values[name]);
    setFieldTouched(name);
  };

  const handleViewOnly = () => {
    setIsViewOnly(!isViewOnly);
    resetForm();
    initialSecurityValues && setValues(initialSecurityValues);
  };

  const formikHelpers: FormikFormHelpers = {
    isValid,
    dirty,
    touched: Object.values(touched).length > 0,
  };

  useEffect(() => {
    fetchUserSecurityDetails();
  }, []);

  return (
    <Box className="">
      <form className="profile-form" onSubmit={handleSubmit}>
        <HeightContainer>
          <div className="align-Box">
            <div className="position-sticky-edit">
              <SettingFooter
                isViewOnly={isViewOnly}
                loading={loading}
                handleViewOnly={handleViewOnly}
                formikHelpers={formikHelpers}
              />
            </div>
          </div>
          <div style={{ paddingTop: "30px" }}>
            {loading && <CircularProgress className="page-loader" />}
            <Grid container spacing={4} className="formGroupItem">
              <Grid item xs={4}>
                <InputLabel htmlFor="login_attempt_counts">
                  <div className="label-heading">Allowed Login Attempts</div>
                  <Typography variant="body1" component="p">
                    Account will be blocked for some time after provided number of incorrect
                    attempts.
                  </Typography>
                </InputLabel>
              </Grid>
              <Grid item xs={7}>
                <FormGroup className="input-holder">
                  <OutlinedInput
                    name="login_attempt_counts"
                    id="login_attempt_counts"
                    type="text"
                    placeholder="000"
                    size="small"
                    fullWidth
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.login_attempt_counts}
                    error={Boolean(touched?.login_attempt_counts && errors?.login_attempt_counts)}
                    disabled={isViewOnly}
                  />
                  {Boolean(touched?.login_attempt_counts && errors?.login_attempt_counts) && (
                    <FormHelperText error>{errors?.login_attempt_counts}</FormHelperText>
                  )}
                </FormGroup>
              </Grid>
            </Grid>
            <Grid container spacing={4} className="formGroupItem">
              <Grid item xs={4}>
                <InputLabel htmlFor="block_time_increment">
                  <div className="label-heading">Incorrect Login Block Time Increment</div>
                  <Typography variant="body1" component="p">
                    Incremental period of time account is blocked after provided number of incorrect
                    attempts.
                  </Typography>
                </InputLabel>
              </Grid>
              <Grid item xs={7}>
                <FormGroup className="input-holder">
                  <OutlinedInput
                    name="block_time_increment"
                    id="block_time_increment"
                    type="text"
                    placeholder="000"
                    size="small"
                    fullWidth
                    onChange={handleChange}
                    onBlur={handleBlur}
                    startAdornment={<div className="indorment">Sec.</div>}
                    value={values?.block_time_increment}
                    error={Boolean(touched?.block_time_increment && errors?.block_time_increment)}
                    disabled={isViewOnly}
                  />
                  {Boolean(touched?.block_time_increment && errors?.block_time_increment) && (
                    <FormHelperText error>{errors?.block_time_increment}</FormHelperText>
                  )}
                </FormGroup>
              </Grid>
            </Grid>
            <div className="border-wrapper">
              <Grid container spacing={4} className="formGroupItem">
                <Grid item xs={4}>
                  <InputLabel htmlFor="min_password_length">
                    <div className="label-heading">Minimum Password Length</div>
                    <Typography variant="body1" component="p">
                      Minimum number of characters used in the password.
                    </Typography>
                  </InputLabel>
                </Grid>
                <Grid item xs={7}>
                  <FormGroup className="input-holder">
                    <OutlinedInput
                      name="min_password_length"
                      id="min_password_length"
                      type="text"
                      placeholder="Atleast 8 characters.."
                      size="small"
                      fullWidth
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.min_password_length}
                      error={Boolean(touched?.min_password_length && errors?.min_password_length)}
                      disabled={isViewOnly}
                    />
                    {Boolean(touched?.min_password_length && errors?.min_password_length) && (
                      <FormHelperText error>{errors?.min_password_length}</FormHelperText>
                    )}
                  </FormGroup>
                </Grid>
              </Grid>
              {/* <Grid container spacing={4} className="formGroupItem">
                <Grid item xs={4}>
                  <InputLabel htmlFor="password_rotation">
                    <div className="label-heading">Password Rotation</div>
                    <Typography variant="body1" component="p">
                      Amount of previous passwords user should not be able to reuse.
                    </Typography>
                  </InputLabel>
                </Grid>
                <Grid item xs={7}>
                  <FormGroup className="input-holder">
                    <OutlinedInput
                      name="password_rotation"
                      id="password_rotation"
                      type="text"
                      placeholder="00"
                      size="small"
                      fullWidth
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.password_rotation}
                      error={Boolean(touched?.password_rotation && errors?.password_rotation)}
                      disabled={isViewOnly}
                    />
                    {Boolean(touched?.password_rotation && errors?.password_rotation) && (
                      <FormHelperText error>{errors?.password_rotation}</FormHelperText>
                    )}
                  </FormGroup>
                </Grid>
              </Grid> */}
            </div>
            <div className="border-wrapper bottom">
              <Grid container spacing={4} className="formGroupItem">
                <Grid item xs={4}>
                  <InputLabel htmlFor="has_uppercase">
                    <div className="label-heading">
                      Password must contain an uppercase character
                    </div>
                    <Typography variant="body1" component="p">
                      If enabled, provided passwords must contain at least one uppercase character.
                    </Typography>
                  </InputLabel>
                </Grid>
                <Grid item xs={7}>
                  <FormGroup className="input-holder">
                    <IOSSwitch
                      checked={values?.has_uppercase}
                      name="has_uppercase"
                      onChange={handleSwitchChange}
                      disabled={isViewOnly}
                    />
                  </FormGroup>
                </Grid>
              </Grid>
              <Grid container spacing={4} className="formGroupItem">
                <Grid item xs={4}>
                  <InputLabel htmlFor="has_number">
                    <div className="label-heading">Password must contain a number</div>
                    <Typography variant="body1" component="p">
                      If enabled, provided passwords must contain at least one digit.
                    </Typography>
                  </InputLabel>
                </Grid>
                <Grid item xs={7}>
                  <FormGroup className="input-holder">
                    <IOSSwitch
                      checked={values?.has_number}
                      name="has_number"
                      onChange={handleSwitchChange}
                      disabled={isViewOnly}
                    />
                  </FormGroup>
                </Grid>
              </Grid>
              <Grid container spacing={4} className="formGroupItem">
                <Grid item xs={4}>
                  <InputLabel htmlFor="has_character">
                    <div className="label-heading">Password must contain a special character</div>
                    <Typography variant="body1" component="p">
                      If enabled, provided passwords must contain at least special character.
                    </Typography>
                  </InputLabel>
                </Grid>
                <Grid item xs={7}>
                  <FormGroup className="input-holder">
                    <IOSSwitch
                      checked={values?.has_character}
                      name="has_character"
                      onChange={handleSwitchChange}
                      disabled={isViewOnly}
                    />
                  </FormGroup>
                </Grid>
              </Grid>
            </div>
          </div>
        </HeightContainer>
      </form>
    </Box>
  );
};

export default UserSecurity;
