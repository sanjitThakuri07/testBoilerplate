import React, { useState } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormGroup,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Slide,
  Typography,
} from "@mui/material";
import { Formik, FormikProps, Field, FieldArray } from "formik";
import { Form, useNavigate, useParams } from "react-router-dom";
import { postAPI } from "src/lib/axios";
import { customerProps } from "src/interfaces/configs";
import { useSnackbar } from "notistack";
import { AddCustomerValidation } from "validationSchemas/ContractorValidation";
import FullPageLoader from "src/components/FullPageLoader";
import "./form.style.scss";
import { useLocation } from "react-router-dom";
import { IOSSwitch } from "src/components/switch/IosSwitch";
import { Stack } from "@mui/system";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ButtonLoaderSpinner from "src/components/ButtonLoaderSpinner/ButtonLoaderSpinner";

interface Customer {
  full_name: string;
  login_email: string;
}

const CustomerAdd: React.FC<{
  proceedToNextPage?: Function;
  data?: Object;
  isFormLoading?: boolean;
  setIsFormLoading?: Function;
  updateCard?: any;
  modalState?: Function;
}> = ({ isFormLoading, modalState }) => {
  const [clearData, setClearData] = useState(false);
  const [startAnimation, setStartAnimation] = useState<boolean>(true);
  const [passwordAnimation, setPasswordAnimation] = useState<boolean>(true);
  const containerRef = React.useRef(null);
  const passwordRef = React.useRef(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [submitting, setSubmitting] = useState(false);
  // form initial values
  // const initialContractorValues: customerProps =

  const [initialValues, setInitialValues] = useState<customerProps>({
    customers: [
      {
        id: 1,
        confirm_password: "",
        password: "",
        can_set_pw: false,
        login_email: "",
        full_name: "",
      },
    ],
  });

  const { enqueueSnackbar } = useSnackbar();

  const [disableEntireField, setDisableEntireField] = useState(false);

  const navigate = useNavigate();
  const { customerId } = useParams();

  // const location = useLocation();
  // const params = new URLSearchParams(location.search);
  // const customerId = params.get('user');

  const submitHandler = async (values: any, actions: any) => {
    setSubmitting(true);
    const convertedPayload: any = values?.customers?.map((item: any, index: number) => {
      return {
        customer_id: Number(customerId),
        login_id: item.login_email,
        password: item.password,
        confirm_password: item.confirm_password,
        can_set_pw: item.can_set_pw,
        full_name: item.full_name,
      };
    });

    if (customerId) {
      await postAPI(`/customers/customer-user/`, convertedPayload)
        .then((res) => {
          if (res.status === 200) {
            enqueueSnackbar("Customer added successfully", {
              variant: "success",
            });
            actions.setSubmitting(false);
            modalState && modalState(false);
            navigate(`/customer/users/view/${customerId}`);
            setSubmitting(false);
          }
        })
        .catch((err) => {
          setSubmitting(false);
          enqueueSnackbar(err?.response?.data?.detail?.message || "Something went wrong!", {
            variant: "error",
          });
        });
    }
  };

  const dynamicHeightStyle = {
    height: "auto",
    minHeight: "100px",
  };

  // const AddCustomerValidation = Yup.object().shape({
  //   customers: Yup.array().of(
  //     Yup.object().shape({
  //       full_name: Yup.string().required('Full Name is required'),
  //       login_email: Yup.string().email('Invalid email').required('Login Email is required'),
  //       // Add custom validation function to check if login_email values are the same
  //       // `this` refers to the parent object being validated, i.e., the array of customers
  //       // `this.parent` refers to the entire form values object
  //       // `this.parent.customers` is the array of customers
  //       // `this.parent.customers[index].login_email` is the login_email value of the current customer
  //       // `value` is the login_email value being validated
  //       // `path` is the current field path, i.e., "customers.${index}.login_email"
  //       // `index` is the index of the current customer in the customers array
  //       checkLoginEmails: function (value) {
  //         const index = this.path.match(/\d+/)[0]; // Extract index from field path
  //         const loginEmails = this.parent.customers.map((customer) => customer.login_email);
  //         const count = loginEmails.filter((email) => email === value).length;
  //         return count === 1; // Return true if the login_email is unique, false otherwise
  //       },
  //     }),
  //   ),
  // });

  const handleResetForm = () => {
    // const newInitialValues =
    setInitialValues({
      customers: [
        {
          confirm_password: "",
          password: "",
          can_set_pw: false,
          login_email: "",
          full_name: "",
        },
      ],
    });

    // const inputs = document.querySelectorAll('.MuiInputBase-input');
    // inputs.forEach((input) => {
    //   if (input instanceof HTMLInputElement) {
    //     input.value = '';
    //   }
    // });
  };

  return (
    <div>
      <Box sx={{ width: "100%", maxHeight: "50vh", overflowY: "scroll" }}>
        <div>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values: customerProps, actions) => {
              if (clearData) {
                actions.resetForm();
                setClearData(false);
                return;
              }

              let finalValue: any = {};
              let {
                documents,

                ...attr
              }: any = values;
              finalValue = { ...attr };

              for (const customer of values.customers) {
                if (customer.password !== customer.confirm_password) {
                  enqueueSnackbar("Password and confirm password does not match", {
                    variant: "error",
                  });
                  actions.setSubmitting(false);
                  return;
                }
              }

              submitHandler(finalValue, actions);
            }}
            validationSchema={AddCustomerValidation}
          >
            {(props: FormikProps<customerProps>) => {
              const {
                values,
                touched,
                errors,
                handleBlur,
                handleSubmit,
                handleChange,
                setFieldValue,
                resetForm,
                isSubmitting,
              } = props;

              return (
                <>
                  {isFormLoading && <FullPageLoader />}
                  <>
                    <form onSubmit={handleSubmit} className="alert__form-fill">
                      {errors.customers && typeof errors.customers === "string" && (
                        <div className="input-feedback" style={{ color: "red", display: "none" }}>
                          {enqueueSnackbar(errors.customers, {
                            variant: "error",
                          })}
                        </div>
                      )}
                      <FieldArray name="customers">
                        {({ push, remove }: any) => (
                          <>
                            {values.customers?.map((customer: any, index: number) => (
                              <Slide
                                direction="up"
                                in={startAnimation}
                                container={containerRef.current}
                              >
                                <div className="customer_creation_form" key={index}>
                                  {values?.customers?.length > 1 ? (
                                    <div
                                      style={{
                                        float: "right",
                                        marginTop: "-4px",
                                        marginRight: "6px",
                                      }}
                                      onClick={() => {
                                        remove(index);
                                      }}
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
                                  ) : null}

                                  <div
                                    className="tenant-page-container"
                                    style={{
                                      backgroundColor: "#ffffff",
                                      borderRadius: "8px",
                                      border: "1px solid #E5E5E5",
                                      padding: "10px 24px 0 24px",
                                      margin: "10px",
                                    }}
                                  >
                                    <Box
                                      borderTop={"none"}
                                      className="setting-form-group"
                                      sx={{
                                        marginTop: "10px",
                                        padding: 0,
                                        // width: '100%',
                                      }}
                                    >
                                      <Grid
                                        container
                                        spacing={4}
                                        className="formGroupItem"
                                        sx={{ marginTop: "0" }}
                                      >
                                        <Grid item xs={5}>
                                          <InputLabel htmlFor="notes">
                                            <div className="label-heading  align__label">
                                              Customer User Name *
                                            </div>
                                          </InputLabel>
                                        </Grid>

                                        <Grid item xs={7}>
                                          <Field
                                            as={OutlinedInput}
                                            name={`customers.${index}.full_name`}
                                            id={`customers.${index}.full_name`}
                                            data-testid={`customers.${index}.full_name`}
                                            type="text"
                                            autoComplete="off"
                                            disabled={disableEntireField}
                                            placeholder="Enter here"
                                            size="small"
                                            fullWidth
                                            value={`${values?.customers?.[index].full_name}` || ""}
                                            error={
                                              errors?.full_name && touched?.full_name ? true : false
                                            }
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                          />

                                          {errors.customers &&
                                            Array.isArray(errors.customers) &&
                                            errors.customers[index] && (
                                              <div
                                                className="input-feedback"
                                                style={{ color: "red" }}
                                              >
                                                {(errors.customers[index] as unknown as any)
                                                  .full_name || ""}
                                              </div>
                                            )}
                                        </Grid>
                                        <Grid item xs={5}>
                                          <InputLabel htmlFor="notes">
                                            <div className="label-heading  align__label">
                                              Customer User Login Email ID *
                                            </div>
                                          </InputLabel>
                                        </Grid>

                                        <Grid item xs={7}>
                                          <Field
                                            as={OutlinedInput}
                                            name={`customers.${index}.login_email`}
                                            id={`customers.${index}.login_email`}
                                            data-testid={`customers.${index}.login_email`}
                                            type="email"
                                            autoComplete="off"
                                            disabled={disableEntireField}
                                            placeholder="Enter here"
                                            size="small"
                                            fullWidth
                                            value={
                                              `${values?.customers?.[index].login_email}` || ""
                                            }
                                            error={
                                              errors?.login_email && touched?.login_email
                                                ? true
                                                : false
                                            }
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                          />

                                          {errors.customers &&
                                            Array.isArray(errors.customers) &&
                                            errors.customers[index] && (
                                              <div
                                                className="input-feedback"
                                                style={{ color: "red" }}
                                              >
                                                {(errors.customers[index] as unknown as any)
                                                  .login_email || ""}
                                              </div>
                                            )}
                                        </Grid>

                                        <Grid item xs={5}>
                                          <InputLabel htmlFor="inspection_type">
                                            <div className="label-heading">
                                              Enable to set password
                                            </div>
                                            <Typography variant="body1" component="p">
                                              If disabled, the users will be able to set their own
                                              password
                                            </Typography>
                                          </InputLabel>
                                        </Grid>

                                        <Grid item xs={6}>
                                          <IOSSwitch
                                            disableText
                                            checked={customer?.can_set_pw ? true : false}
                                            onChange={(e: any) => {
                                              setFieldValue(
                                                `customers.${index}.can_set_pw`,
                                                e.target.checked,
                                              );
                                              setPasswordAnimation(passwordAnimation);
                                            }}
                                            name={`customers.${index}.can_set_pw`}
                                            inputProps={{ "aria-label": "controlled" }}
                                          />
                                        </Grid>
                                      </Grid>

                                      {customer?.can_set_pw && (
                                        <>
                                          <Slide
                                            direction="down"
                                            in={passwordAnimation}
                                            container={passwordRef.current}
                                          >
                                            <Box
                                              component="form"
                                              autoComplete="off"
                                              sx={{
                                                width: "100%",
                                                border: "1px solid #EAECF0",
                                                boxShadow:
                                                  "0px 7px 30px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)",
                                                borderRadius: "12px",
                                              }}
                                              className="passwordContainerBox"
                                            >
                                              <Stack
                                                direction="column"
                                                sx={{ p: 2, marginBottom: "25px" }}
                                              >
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
                                                  A password would be set along with the details
                                                  above for signing up
                                                </Box>
                                                {/* password forms */}
                                                <Stack direction="column" sx={{ mt: 2.5 }}>
                                                  <Stack direction="row" spacing={1.5}>
                                                    <Box sx={{ width: "100%" }}>
                                                      <Box sx={{ fontSize: "13px" }}>
                                                        New Password
                                                      </Box>
                                                      <Box>
                                                        <Field
                                                          as={OutlinedInput}
                                                          size="small"
                                                          id={`customers.${index}.password`}
                                                          name={`customers.${index}.password`}
                                                          type={showPassword ? "text" : "password"}
                                                          fullWidth
                                                          sx={{ marginTop: "5px" }}
                                                          placeholder="Enter your password here"
                                                          className="form_input"
                                                          value={customer?.password || null}
                                                          error={
                                                            errors.password && touched.password
                                                              ? true
                                                              : false
                                                          }
                                                          onChange={handleChange}
                                                          onBlur={handleBlur}
                                                          endAdornment={
                                                            <InputAdornment position="start">
                                                              <IconButton
                                                                onClick={() =>
                                                                  setShowPassword((show) => !show)
                                                                }
                                                                edge="end"
                                                                sx={{ color: "#667085" }}
                                                              >
                                                                {showPassword ? (
                                                                  <VisibilityOff />
                                                                ) : (
                                                                  <Visibility />
                                                                )}
                                                              </IconButton>
                                                            </InputAdornment>
                                                          }
                                                        />
                                                        <Box>
                                                          {errors?.password &&
                                                            touched?.password && (
                                                              <FormHelperText
                                                                style={{ color: "red" }}
                                                              >
                                                                {errors?.password}
                                                              </FormHelperText>
                                                            )}
                                                        </Box>
                                                      </Box>
                                                    </Box>
                                                    <Box sx={{ width: "100%" }}>
                                                      <Box sx={{ fontSize: "13px" }}>
                                                        Confirm New Password
                                                      </Box>
                                                      <Box>
                                                        <Field
                                                          as={OutlinedInput}
                                                          size="small"
                                                          id={`customers.${index}.confirm_password`}
                                                          name={`customers.${index}.confirm_password`}
                                                          type={
                                                            showConfirmPassword
                                                              ? "text"
                                                              : "password"
                                                          }
                                                          fullWidth
                                                          sx={{ marginTop: "5px" }}
                                                          placeholder="Re-enter your password here"
                                                          className="form_input"
                                                          value={customer?.confirm_password || null}
                                                          error={
                                                            errors.confirm_password &&
                                                            touched.confirm_password
                                                              ? true
                                                              : false
                                                          }
                                                          onChange={handleChange}
                                                          onBlur={handleBlur}
                                                          endAdornment={
                                                            <InputAdornment position="start">
                                                              <IconButton
                                                                onClick={() =>
                                                                  setShowConfirmPassword(
                                                                    (show) => !show,
                                                                  )
                                                                }
                                                                edge="end"
                                                                sx={{ color: "#667085" }}
                                                              >
                                                                {showPassword ? (
                                                                  <VisibilityOff />
                                                                ) : (
                                                                  <Visibility />
                                                                )}
                                                              </IconButton>
                                                            </InputAdornment>
                                                          }
                                                        />
                                                        <Box>
                                                          {errors?.confirm_password &&
                                                            touched?.confirm_password && (
                                                              <FormHelperText
                                                                style={{ color: "red" }}
                                                              >
                                                                {errors?.confirm_password}
                                                              </FormHelperText>
                                                            )}
                                                        </Box>
                                                      </Box>
                                                    </Box>
                                                  </Stack>
                                                </Stack>
                                              </Stack>
                                            </Box>
                                          </Slide>
                                        </>
                                      )}
                                    </Box>
                                    {!!(values?.customers?.length - 1 === index) && (
                                      <Button
                                        variant="outlined"
                                        onClick={() => {
                                          push({
                                            confirm_password: "",
                                            password: "",
                                            can_set_pw: false,
                                            login_email: "",
                                            full_name: "",
                                          });
                                          setStartAnimation(startAnimation);
                                        }}
                                        startIcon={<img alt="" src="/assets/icons/plus.svg" />}
                                        className="link-icon"
                                        style={{ marginBottom: "10px" }}
                                      >
                                        Add Another User
                                      </Button>
                                    )}
                                  </div>

                                  {/* <Divider variant="middle" style={{ margin: '1px 0' }} /> */}
                                </div>
                              </Slide>
                            ))}
                          </>
                        )}
                      </FieldArray>

                      {/* <StepOneForm /> */}
                      <React.Fragment>
                        <Box
                          borderBottom={"none"}
                          className="setting-form-group"
                          sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            pt: 2,
                          }}
                        >
                          <Box sx={{ flex: "1 1 auto" }} />
                          <Button variant="outlined" onClick={() => resetForm()} sx={{ mr: 1 }}>
                            Clear All
                          </Button>

                          <Button
                            sx={{ mr: 1 }}
                            disabled={submitting ? true : false}
                            variant="contained"
                            type="submit"
                          >
                            {submitting ? <ButtonLoaderSpinner /> : "Create"}
                          </Button>
                          {/* <ButtonLoaderSpinner
                            // disabled={isSubmitting}
                            type="submit"
                            variant="contained"
                            // onClick={() => {
                            //   setInitialValues(values);
                            // }}
                            sx={{ mr: 1 }}>
                            Create
                            {isFormLoading && (
                              <CircularProgress
                                color="inherit"
                                size={18}
                                sx={{ marginLeft: '10px' }}
                              />
                            )}
                          </Button> */}
                        </Box>
                      </React.Fragment>
                    </form>
                  </>
                </>
              );
            }}
          </Formik>

          {/* --- */}
        </div>
      </Box>
    </div>
  );
};

export default CustomerAdd;
