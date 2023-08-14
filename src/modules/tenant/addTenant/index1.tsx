/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  Button,
  CircularProgress,
  Divider,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import React, { useEffect, useState } from "react";
// import './style.scss';
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import PhoneNumberInput from "containers/setting/profile/PhoneNumberInput";
import ProfilePicture from "containers/setting/profile/ProfilePicture";
import { Field, Formik, FormikProps } from "formik";
import { MenuOptions, Phone } from "src/interfaces/profile";
import { useNavigate, useParams } from "react-router-dom";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import OrganizationSchema from "validationSchemas/Organization";
import * as Yup from "yup";
import SaveIcon from "../../../assets/icons/save_icon.svg";
// import './style.scss';

interface IOrganization {
  organization_name: string;
  organization_industry: number;
  organization_country: number;
  organization_language: number;
  organization_date_format: number;
  organization_time_format: number;
  organization_email: string;
  //   handleUploadImage: (image: File) => void;
}

interface IsOrganizationForm {
  photo: string | undefined;
  tenant_full_name: string;
  tenant_designation: number;
  tenant_country: number;
  tenant_location: string;
  tenant_email: string;
  phone: Phone[];
  billing_plan: number;
  organization_name: string;
  organization_industry: number;
  organization_country: number;
  organization_language: number;
  organization_date_format: number;
  organization_time_format: number;
  organization_email: string;
  country_code: string;
  organizations: IOrganization[];
}

const AddTenant: React.FC = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [stepsMount, setStepsMount] = React.useState<{
    step1: boolean;
    step2: boolean;
    step3: boolean;
  }>({
    step1: false,
    step2: true,
    step3: false,
  });
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [open, setOpen] = React.useState(false);

  const [disableEntireField, setDisableEntireField] = useState(false);
  const [disableFirstForm, setDisableFirstForm] = useState(true);
  const [disableSecondForm, setDisableSecondForm] = useState(false);
  const [country, setCountry] = useState<any>([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [designation, setDesignation] = useState<any>([]);
  const [billingPlan, setBillingPlan] = useState<any>([]);
  const [industry, setIndustry] = useState<any>([]);
  const [language, setLanguage] = useState<any>([]);
  const [dateFormat, setDateFormat] = useState<any>([]);
  const [timeFormat, setTimeFormat] = useState<any>([]);
  const [organizationCount, setOrganizationCount] = useState<number>(1);

  const [initialOrganizationData, setInitialOrganizationData] = useState<IsOrganizationForm>({
    organization_email: "",
    country_code: "",
    tenant_full_name: "",
    photo: "",
    tenant_designation: 0,
    tenant_country: 0,
    tenant_location: "",
    tenant_email: "",
    phone: [],
    billing_plan: 0,
    organization_name: "",
    organization_language: 0,
    organization_country: 0,
    organization_industry: 0,
    organization_date_format: 0,
    organization_time_format: 0,

    organizations: [
      {
        organization_country: 0,
        organization_date_format: 0,
        organization_email: "",
        organization_industry: 0,
        organization_language: 0,
        organization_name: "",
        organization_time_format: 0,
      },
    ],
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const navigate = useNavigate();
  const param = useParams();

  const getTenantId = () => {
    if (param.id) {
      setDisableEntireField(true);
      setActiveStep(2);
      getAPI(`tenant/${param.id}`)
        .then((res) => {
          if (res.status === 200) {
            setInitialOrganizationData({
              organization_email: res.data.organization_email,
              country_code: res.data.country_code,
              tenant_full_name: res.data.tenant.full_name,
              photo: res.data.tenant.photo,
              tenant_designation: res.data.tenant.designation_id,
              tenant_country: res.data.tenant.country_id,
              tenant_location: res.data.tenant.location,
              tenant_email: res.data.tenant.login_id,

              phone: res.data.tenant.phone.map((a: { code: any; id: any; phone_number: any }) => ({
                code: a?.code,
                id: a?.id,
                phone: a?.phone_number,
              })),
              billing_plan: res.data.tenant.billing_plan,
              organization_name: res.data.organizations?.name,
              organization_language: res.data.organization_language,
              organization_country: res.data.organization_country,
              organization_industry: res.data.organization_industry,
              organization_date_format: res.data.organization_date_format,
              organization_time_format: res.data.organization_time_format,

              organizations: res.data.organizations.map(
                (e: {
                  country_id: any;
                  date_format_id: any;
                  owner_email: any;
                  industry_id: any;
                  language_id: any;
                  name: any;
                  time_format_id: any;
                }) => ({
                  organization_country: e.country_id,
                  organization_date_format: e.date_format_id,
                  organization_email: e.owner_email,
                  organization_industry: e.industry_id,
                  organization_language: e.language_id,
                  organization_name: e.name,
                  organization_time_format: e.time_format_id,
                }),
              ),
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const style: any = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    padding: "24px 24px 0px",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const steps: any[] = [
    {
      label: "Tenant Details",
      description: "Provide personal details of the Tenant.",
    },
    {
      label: "Organization Details",
      description: "Details about the organization",
    },
    {
      label: "Overview",
      description: "See a preview of everthing",
    },
  ];

  const submitHandler = (values: any, actions: any) => {
    let payload = {
      tenant: {
        full_name: values.tenant_full_name,
        photo: values.photo,
        designation: values.tenant_designation,
        country: values.tenant_country,
        location: values.tenant_location,
        tenant_email_id: values.tenant_email,
        phone_numbers: values.phone,
        billing_plan: values.billing_plan,
        tenant_code: values.country_code,
      },
      organizations: values.organizations.map((org: any) => {
        return {
          organization_name: org.organization_name,
          industry: org.organization_industry,
          country: org.organization_country,
          language: org.organization_language,
          date_format: org.organization_date_format,
          time_format: org.organization_time_format,
          owner_email: org.organization_email,
        };
      }),
    };

    actions.setSubmitting(true);

    if (param.id) {
      putAPI(`tenant/${param.id}`, payload)
        .then((res: { data: any; status: any }) => {
          actions.setSubmitting(false);
          if (res.status === 200) {
            setIsUpdated(true);
            handleOpen();
          }
        })
        .catch((err: any) => {
          actions.setSubmitting(true);
          console.log(err);
        });
    } else {
      postAPI("/tenant/", payload)
        .then((res: { data: any; status: any }) => {
          actions.setSubmitting(false);
          if (res.status === 200) {
            // logic here
            handleOpen();
          }
        })
        .catch((err: any) => {
          actions.setSubmitting(true);
          console.log(err);
        });
    }
  };

  //   create a get method to fetch the data from the API
  const getCountryData = async () => {
    const { status, data } = await getAPI("config/country");
    if (status === 200) {
      const options = data;
      const menuOptions: MenuOptions[] = options.map((opt: MenuOptions) => {
        return {
          value: opt.id,
          label: opt.name,
          phone_code: opt.phone_code,
        };
      });
      setCountry(menuOptions);
    }
  };

  const getDesignationData = () => {
    getAPI("config/designation/")
      .then((res: { data: any; status: any }) => {
        if (res.status === 200) {
          setDesignation(res.data.items);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const getBillingPlanData = () => {
    getAPI("billings")
      .then((res: { data: any; status: any }) => {
        if (res.status === 200) {
          setBillingPlan(res.data);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const getOrganizationLanguageData = () => {
    getAPI("config/language")
      .then((res: { data: any; status: any }) => {
        if (res.status === 200) {
          setLanguage(res.data);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const getOrganizationDateFormatData = () => {
    getAPI("config/date-format")
      .then((res: { data: any; status: any }) => {
        if (res.status === 200) {
          setDateFormat(res.data);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const getOrganizationTimeFormatData = () => {
    getAPI("config/time-format")
      .then((res: { data: any; status: any }) => {
        if (res.status === 200) {
          setTimeFormat(res.data);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const getIndustryData = () => {
    getAPI("industry")
      .then((res: { data: any; status: any }) => {
        if (res.status === 200) {
          setIndustry(res.data);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCountryData();
    getDesignationData();
    getBillingPlanData();
    getOrganizationLanguageData();
    getOrganizationDateFormatData();
    getOrganizationTimeFormatData();
    getIndustryData();
    getTenantId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="TENANT_PAGE">
      <div className="page-heading">
        <Typography variant="h5" color="primary" className="heading">
          Create New Tenant
        </Typography>
      </div>

      {/* --- */}

      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};

            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label.label} {...stepProps} style={{ textAlign: "center" }}>
                <StepLabel {...labelProps}>{label.label}</StepLabel>
                <Typography>{label.description}</Typography>
              </Step>
            );
          })}
        </Stepper>
        <div
          className="tenant-page-container"
          style={{
            margin: "40px 0",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            padding: "10px 24px",
          }}
        >
          {/* --- */}

          <Formik
            // key={key}
            enableReinitialize
            initialValues={initialOrganizationData}
            onSubmit={(values: IsOrganizationForm, actions) => {
              submitHandler(values, actions);
            }}
            validationSchema={Yup.object().shape({
              tenant_full_name: Yup.string().required("Full name is required!").max(50),
              tenant_country: Yup.string().required("Please select country"),
              tenant_email: Yup.string().email().required("Email is required!").min(5).max(50),
              billing_plan: Yup.string().required("Please select billing plan"),
              organizations: Yup.array().of(OrganizationSchema).ensure(),
            })}
          >
            {(props: FormikProps<IsOrganizationForm>) => {
              const {
                values,
                touched,
                errors,
                handleBlur,
                handleSubmit,
                handleChange,
                setFieldValue,
                setFieldTouched,
                isSubmitting,
              } = props;

              //  Starting----> Consitions for First form

              const handleNextOnePass = () => {
                if (
                  touched.tenant_full_name &&
                  touched.tenant_country &&
                  touched.tenant_email &&
                  // touched?.phone[0]?.phone &&
                  touched.billing_plan
                ) {
                  return true;
                } else return false;
              };

              if (handleNextOnePass() === true) {
                setDisableFirstForm(false);
              } else {
                setDisableFirstForm(true);
              }

              const handleNextOne = () => {
                if (handleNextOnePass()) {
                  handleNext();
                }
              };
              //  Ending----> Consitions for First form

              const handleNextTwoPass = () => {
                //   if (
                //     touched.organization_name &&
                //     touched.organization_country &&
                //     touched.organization_date_format &&
                //     touched.organization_time_format &&
                //     touched.organization_language &&
                //     touched.organization_email
                //   ) {
                //     return true;
                //   } else return false;
                // };

                if (touched.organizations) {
                  return true;
                } else return false;
              };

              if (handleNextTwoPass() === true) {
                setDisableSecondForm(false);
              } else {
                setDisableSecondForm(true);
              }

              const handleNextTwo = () => {
                if (handleNextTwoPass()) {
                  handleNext();
                }
              };

              const AddAdditionalForm = () => {
                setOrganizationCount(organizationCount + 1);
              };

              console.log("If photo is passed-->", values);

              // Ending--->  Consitions for Second form

              return (
                <>
                  {activeStep === steps.length ? (
                    <React.Fragment></React.Fragment>
                  ) : activeStep === 0 ? (
                    <>
                      <div className="step-one-component">
                        <Box
                          borderTop={"none"}
                          className="setting-form-group"
                          sx={{
                            width: "90%",
                          }}
                        >
                          <Grid container spacing={4} className="formGroupItem">
                            <Grid item xs={12}>
                              <ProfilePicture
                                profilePicture={values.photo}
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
                                profilePhotoHeading={"Profile Photo"}
                                profilePhotoSubHeading={"Update your profile picture."}
                              />
                            </Grid>
                          </Grid>

                          <Grid container spacing={4} className="formGroupItem">
                            <Grid item xs={4}>
                              <InputLabel htmlFor="fullName">
                                <div className="label-heading">
                                  Full Name <sup>*</sup>
                                </div>
                              </InputLabel>
                            </Grid>

                            <Grid item xs={7}>
                              <Field
                                as={OutlinedInput}
                                name="tenant_full_name"
                                id="tenant_full_name"
                                type="text"
                                placeholder="Enter here"
                                size="small"
                                fullWidth
                                autoComplete="off"
                                disabled={disableEntireField}
                                value={values.tenant_full_name || ""}
                                error={
                                  errors.tenant_full_name && touched.tenant_full_name ? true : false
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />

                              {errors.tenant_full_name && touched.tenant_full_name && (
                                <div className="input-feedback" style={{ color: "red" }}>
                                  {errors.tenant_full_name}
                                </div>
                              )}
                            </Grid>
                          </Grid>

                          <Grid container spacing={4} className="formGroupItem">
                            <Grid item xs={4}>
                              <InputLabel htmlFor="designation">
                                <div className="label-heading">Designation</div>
                              </InputLabel>
                            </Grid>

                            <Grid item xs={7}>
                              <Select
                                MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                name="tenant_designation"
                                id="tenant_designation"
                                size="small"
                                fullWidth
                                placeholder="Select here"
                                autoComplete="off"
                                disabled={disableEntireField}
                                value={values.tenant_designation || ""}
                                error={
                                  errors.tenant_designation && touched.tenant_designation
                                    ? true
                                    : false
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                              >
                                {designation.map((item: any, index: number) => (
                                  <MenuItem key={index} value={item.id}>
                                    {item.title}
                                  </MenuItem>
                                ))}
                              </Select>
                              {errors.tenant_designation && touched.tenant_designation && (
                                <div className="input-feedback" style={{ color: "red" }}>
                                  {errors.tenant_designation}
                                </div>
                              )}
                            </Grid>
                          </Grid>

                          <Grid container spacing={4} className="formGroupItem">
                            <Grid item xs={4}>
                              <InputLabel htmlFor="country">
                                <div className="label-heading">
                                  Country <sup>*</sup>
                                </div>
                              </InputLabel>
                            </Grid>

                            <Grid item xs={7}>
                              <Select
                                MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                name="tenant_country"
                                id="tenant_country"
                                size="small"
                                fullWidth
                                placeholder="Select here"
                                autoComplete="off"
                                disabled={disableEntireField}
                                value={values.tenant_country || ""}
                                error={
                                  errors.tenant_country && touched.tenant_country ? true : false
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                              >
                                {country.map((item: any, index: number) => (
                                  <MenuItem key={index} value={item.value}>
                                    {item.label}
                                  </MenuItem>
                                ))}
                              </Select>
                              {errors.tenant_country && touched.tenant_country && (
                                <div className="input-feedback" style={{ color: "red" }}>
                                  {errors.tenant_country}
                                </div>
                              )}
                            </Grid>
                          </Grid>

                          <Grid container spacing={4} className="formGroupItem">
                            <Grid item xs={4}>
                              <InputLabel htmlFor="tenant_location">
                                <div className="label-heading">Location</div>
                              </InputLabel>
                            </Grid>

                            <Grid item xs={7}>
                              <Field
                                as={OutlinedInput}
                                name="tenant_location"
                                id="tenant_location"
                                type="text"
                                autoComplete="off"
                                disabled={disableEntireField}
                                placeholder="Enter here"
                                size="small"
                                fullWidth
                                value={values.tenant_location || ""}
                                error={
                                  errors.tenant_location && touched.tenant_location ? true : false
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />

                              {errors.tenant_location && touched.tenant_location && (
                                <div className="input-feedback" style={{ color: "red" }}>
                                  {errors.tenant_location}
                                </div>
                              )}
                            </Grid>
                          </Grid>
                        </Box>
                        <Box border={"none"} className="setting-form-group" sx={{ width: "90%" }}>
                          <Grid container spacing={4} className="formGroupItem">
                            <Grid item xs={4}>
                              <InputLabel htmlFor="emailId">
                                <div className="label-heading">Tenant Email ID *</div>

                                <Typography variant="body1" component="p">
                                  Sign up link will be sent to this email ID.
                                </Typography>
                              </InputLabel>
                            </Grid>
                            <Grid item xs={7}>
                              <Field
                                as={OutlinedInput}
                                name="tenant_email"
                                id="tenant_email"
                                type="text"
                                placeholder="Enter here"
                                size="small"
                                fullWidth
                                autoComplete="off"
                                disabled={disableEntireField}
                                value={values.tenant_email || ""}
                                error={errors.tenant_email && touched.tenant_email ? true : false}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />

                              {errors.tenant_email && touched.tenant_email && (
                                <div className="input-feedback" style={{ color: "red" }}>
                                  {errors.tenant_email}
                                </div>
                              )}
                            </Grid>
                          </Grid>
                          <Grid container spacing={4} className="formGroupItem">
                            <Grid item xs={4}>
                              <InputLabel htmlFor="emailId">
                                <div className="label-heading">Primary Phone Number *</div>

                                <Typography variant="body1" component="p">
                                  This will be your main contact number
                                </Typography>
                              </InputLabel>
                            </Grid>
                            <Grid item xs={7}>
                              <PhoneNumberInput
                                countryOptions={country}
                                formikBag={props as any}
                                isViewOnly={disableEntireField}
                              />
                            </Grid>
                          </Grid>
                        </Box>

                        <Box className="setting-form-group" border={"none"} sx={{ width: "90%" }}>
                          <Grid container spacing={4} className="formGroupItem">
                            <Grid item xs={4}>
                              <InputLabel htmlFor="billing_plan">
                                <div className="label-heading">Billing Plan *</div>

                                <Typography variant="body1" component="p">
                                  This will be your Plan moving forward.
                                </Typography>
                              </InputLabel>
                            </Grid>
                            <Grid item xs={7}>
                              <Select
                                MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                id="billing_plan"
                                name="billing_plan"
                                size="small"
                                fullWidth
                                autoComplete="off"
                                disabled={disableEntireField}
                                value={values.billing_plan || ""}
                                error={errors.billing_plan && touched.billing_plan ? true : false}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              >
                                {billingPlan.map((item: any, index: number) => (
                                  <MenuItem key={index} value={item.id}>
                                    {item.title}
                                  </MenuItem>
                                ))}
                              </Select>
                              {errors.billing_plan && touched.billing_plan && (
                                <div className="input-feedback" style={{ color: "red" }}>
                                  {errors.billing_plan}
                                </div>
                              )}
                            </Grid>
                          </Grid>
                        </Box>
                      </div>

                      {/* <StepOneForm /> */}
                      <React.Fragment>
                        <Box
                          borderBottom={"none"}
                          className="setting-form-group"
                          sx={{
                            width: "90%",
                            display: "flex",
                            flexDirection: "row",
                            pt: 2,
                          }}
                        >
                          {/* <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}>
                            Back
                          </Button> */}
                          <Box sx={{ flex: "1 1 auto" }} />
                          {isStepOptional(activeStep) && (
                            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                              Skip
                            </Button>
                          )}
                          <Button
                            variant="contained"
                            disabled={disableFirstForm}
                            onClick={handleNextOne}
                          >
                            {activeStep === steps.length - 1 ? "Finish" : "Proceed"}
                          </Button>
                        </Box>
                      </React.Fragment>
                    </>
                  ) : activeStep === 1 ? (
                    <>
                      <div className="step-two-component">
                        {isStepOptional(activeStep) && (
                          <Button
                            // color="inherit"
                            // variant="outlined"
                            onClick={handleSkip}
                            sx={{ mr: 1, float: "right", backgroundColor: "#C1C6D4" }}
                          >
                            Skip
                          </Button>
                        )}
                        <Box className="setting-form-group" border={"none"} sx={{ width: "90%" }}>
                          {new Array(organizationCount).fill(0)?.map((_, _idx) => {
                            return (
                              <Box className={`organizations[${_idx}]`}>
                                <Grid container spacing={4} className="formGroupItem">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="fullName">
                                      <div className="label-heading">
                                        Organization Name {_idx + 1} *
                                      </div>
                                    </InputLabel>
                                  </Grid>
                                  <Grid item xs={7}>
                                    <Field
                                      as={OutlinedInput}
                                      name={`organizations.${_idx}.organization_name`}
                                      id="organization_name"
                                      type="text"
                                      placeholder="Enter here"
                                      size="small"
                                      fullWidth
                                      autoComplete="off"
                                      disabled={disableEntireField}
                                      value={values.organizations[_idx]?.organization_name || ""}
                                      error={
                                        errors.organization_name && touched.organization_name
                                          ? true
                                          : false
                                      }
                                      onChange={(ev: any) => {
                                        handleChange(ev);
                                        setStepsMount({
                                          ...stepsMount,
                                          step2: true,
                                        });
                                      }}
                                      onBlur={handleBlur}
                                    />

                                    {errors.organization_name && touched.organization_name && (
                                      <div className="input-feedback" style={{ color: "red" }}>
                                        {errors.organization_name}
                                      </div>
                                    )}
                                  </Grid>
                                </Grid>
                                <Grid container spacing={4} className="formGroupItem">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="organization_industry">
                                      <div className="label-heading">Industry *</div>
                                    </InputLabel>
                                  </Grid>

                                  <Grid item xs={7}>
                                    <Select
                                      MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                      name={`organizations.${_idx}.organization_industry`}
                                      id="organization_industry"
                                      size="small"
                                      fullWidth
                                      placeholder="Select here"
                                      autoComplete="off"
                                      disabled={disableEntireField}
                                      value={
                                        values.organizations[_idx]?.organization_industry || ""
                                      }
                                      error={
                                        errors.organization_industry &&
                                        touched.organization_industry
                                          ? true
                                          : false
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    >
                                      {industry.map((item: any, index: number) => (
                                        <MenuItem key={index} value={item.id}>
                                          {item.name}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                    {errors.organization_industry &&
                                      touched.organization_industry && (
                                        <div className="input-feedback" style={{ color: "red" }}>
                                          {errors.organization_industry}
                                        </div>
                                      )}
                                  </Grid>
                                </Grid>
                                <Grid container spacing={4} className="formGroupItem">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="organization_country">
                                      <div className="label-heading">Country *</div>
                                    </InputLabel>
                                  </Grid>

                                  <Grid item xs={7}>
                                    <Select
                                      MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                      name={`organizations.${_idx}.organization_country`}
                                      id="organization_country"
                                      size="small"
                                      fullWidth
                                      placeholder="Select here"
                                      autoComplete="off"
                                      disabled={disableEntireField}
                                      value={values.organizations[_idx]?.organization_country || ""}
                                      error={
                                        errors.organization_country && touched.organization_country
                                          ? true
                                          : false
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    >
                                      {country.map((item: any, index: number) => (
                                        <MenuItem key={index} value={item.value}>
                                          {item.label}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                    {errors.organization_country &&
                                      touched.organization_country && (
                                        <div className="input-feedback" style={{ color: "red" }}>
                                          {errors.organization_country}
                                        </div>
                                      )}
                                  </Grid>
                                </Grid>
                                <Grid container spacing={4} className="formGroupItem">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="organization_language">
                                      <div className="label-heading">Language</div>
                                    </InputLabel>
                                  </Grid>

                                  <Grid item xs={7}>
                                    <Select
                                      MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                      id="organization_language"
                                      name={`organizations.${_idx}.organization_language`}
                                      size="small"
                                      autoComplete="off"
                                      disabled={disableEntireField}
                                      fullWidth
                                      value={
                                        values.organizations[_idx]?.organization_language || ""
                                      }
                                      error={
                                        errors.organization_language &&
                                        touched.organization_language
                                          ? true
                                          : false
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    >
                                      {language.map((item: any, index: number) => (
                                        <MenuItem key={index} value={item.id}>
                                          {item.name}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                    {errors.organization_language &&
                                      touched.organization_language && (
                                        <div className="input-feedback" style={{ color: "red" }}>
                                          {errors.organization_language}
                                        </div>
                                      )}
                                  </Grid>
                                </Grid>
                                <Grid container spacing={4} className="formGroupItem">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="organization_date_format">
                                      <div className="label-heading">Date Format *</div>
                                    </InputLabel>
                                  </Grid>

                                  <Grid item xs={7}>
                                    <Select
                                      MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                      id="organization_date_format"
                                      name={`organizations.${_idx}.organization_date_format`}
                                      size="small"
                                      autoComplete="off"
                                      disabled={disableEntireField}
                                      fullWidth
                                      value={
                                        values.organizations[_idx]?.organization_date_format || ""
                                      }
                                      error={
                                        errors.organization_date_format &&
                                        touched.organization_date_format
                                          ? true
                                          : false
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    >
                                      {dateFormat.map((item: any, index: number) => (
                                        <MenuItem key={index} value={item.id}>
                                          {item.name}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                    {errors.organization_date_format &&
                                      touched.organization_date_format && (
                                        <div className="input-feedback" style={{ color: "red" }}>
                                          {errors.organization_date_format}
                                        </div>
                                      )}
                                  </Grid>
                                </Grid>
                                <Grid container spacing={4} className="formGroupItem">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="organization_time_format">
                                      <div className="label-heading">Time Format *</div>
                                    </InputLabel>
                                  </Grid>

                                  <Grid item xs={7}>
                                    <Select
                                      MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                      id="organization_time_format"
                                      name={`organizations.${_idx}.organization_time_format`}
                                      size="small"
                                      autoComplete="off"
                                      disabled={disableEntireField}
                                      fullWidth
                                      value={
                                        values.organizations[_idx]?.organization_time_format || ""
                                      }
                                      error={
                                        errors.organization_time_format &&
                                        touched.organization_time_format
                                          ? true
                                          : false
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    >
                                      {timeFormat.map((item: any, index: number) => (
                                        <MenuItem key={index} value={item.id}>
                                          {item.name}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                    {errors.organization_time_format &&
                                      touched.organization_time_format && (
                                        <div className="input-feedback" style={{ color: "red" }}>
                                          {errors.organization_time_format}
                                        </div>
                                      )}
                                  </Grid>
                                </Grid>
                                <Grid container spacing={4} className="formGroupItem">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="organization_email">
                                      <div className="label-heading">
                                        Organization Admin Email ID*
                                      </div>

                                      <Typography variant="body1" component="p">
                                        Sign up link will be sent to this email ID.
                                      </Typography>
                                    </InputLabel>
                                  </Grid>

                                  <Grid item xs={7}>
                                    <Field
                                      as={OutlinedInput}
                                      name={`organizations.${_idx}.organization_email`}
                                      id="organization_email"
                                      type="text"
                                      placeholder="Enter here"
                                      size="small"
                                      fullWidth
                                      autoComplete="off"
                                      disabled={disableEntireField}
                                      value={values.organizations[_idx]?.organization_email || ""}
                                      error={
                                        errors.organization_email && touched.organization_email
                                          ? true
                                          : false
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />

                                    {errors.organization_email && touched.organization_email && (
                                      <div className="input-feedback" style={{ color: "red" }}>
                                        {errors.organization_email}
                                      </div>
                                    )}
                                  </Grid>
                                </Grid>
                                <Divider
                                  sx={{
                                    mb: 5,
                                    mt: 5,
                                  }}
                                />
                              </Box>
                            );
                          })}

                          <Grid container spacing={4} className="formGroupItem">
                            <Grid item xs={4}>
                              <InputLabel htmlFor="organization_email">
                                <div className="label-heading">
                                  <Button
                                    // variant="outlined"
                                    onClick={AddAdditionalForm}
                                  >
                                    {" "}
                                    <span>&#65291;</span> Add Organization{" "}
                                  </Button>
                                </div>
                              </InputLabel>
                            </Grid>
                          </Grid>
                        </Box>
                        {/* <StepTwoForm /> */}
                      </div>

                      <React.Fragment>
                        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                          <Button color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
                            Back
                          </Button>
                          <Box sx={{ flex: "1 1 auto" }} />

                          <Button
                            variant="contained"
                            disabled={disableSecondForm}
                            onClick={handleNextTwo}
                          >
                            {activeStep === steps.length - 1 ? "Finish" : "Proceed"}
                          </Button>
                        </Box>
                      </React.Fragment>
                    </>
                  ) : activeStep === 2 ? (
                    <>
                      <React.Fragment>
                        {/* <StepOneForm  /> */}
                        <div className="step-one-component">
                          <Box
                            borderTop={"none"}
                            className="setting-form-group"
                            sx={{
                              width: "90%",
                            }}
                          >
                            <Grid container spacing={4} className="formGroupItem">
                              <Grid item xs={12}>
                                <ProfilePicture
                                  profilePicture={values.photo}
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
                                  profilePhotoHeading={"Profile Photo"}
                                  profilePhotoSubHeading={"Update your profile picture."}
                                />
                              </Grid>
                            </Grid>

                            <Grid container spacing={4} className="formGroupItem">
                              <Grid item xs={4}>
                                <InputLabel htmlFor="fullName">
                                  <div className="label-heading">
                                    Full Name <sup>*</sup>
                                  </div>
                                </InputLabel>
                              </Grid>

                              <Grid item xs={7}>
                                <Field
                                  as={OutlinedInput}
                                  name="tenant_full_name"
                                  id="tenant_full_name"
                                  type="text"
                                  placeholder="Enter here"
                                  size="small"
                                  fullWidth
                                  autoComplete="off"
                                  disabled={disableEntireField}
                                  value={values.tenant_full_name || ""}
                                  error={
                                    errors.tenant_full_name && touched.tenant_full_name
                                      ? true
                                      : false
                                  }
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />

                                {errors.tenant_full_name && touched.tenant_full_name && (
                                  <div className="input-feedback" style={{ color: "red" }}>
                                    {errors.tenant_full_name}
                                  </div>
                                )}
                              </Grid>
                            </Grid>

                            <Grid container spacing={4} className="formGroupItem">
                              <Grid item xs={4}>
                                <InputLabel htmlFor="designation">
                                  <div className="label-heading">Designation</div>
                                </InputLabel>
                              </Grid>

                              <Grid item xs={7}>
                                <Select
                                  MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                  name="tenant_designation"
                                  id="tenant_designation"
                                  size="small"
                                  fullWidth
                                  placeholder="Select here"
                                  autoComplete="off"
                                  disabled={disableEntireField}
                                  value={values.tenant_designation || ""}
                                  error={
                                    errors.tenant_designation && touched.tenant_designation
                                      ? true
                                      : false
                                  }
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                >
                                  {designation.map((item: any, index: number) => (
                                    <MenuItem key={index} value={item.id}>
                                      {item.title}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {errors.tenant_designation && touched.tenant_designation && (
                                  <div className="input-feedback" style={{ color: "red" }}>
                                    {errors.tenant_designation}
                                  </div>
                                )}
                              </Grid>
                            </Grid>

                            <Grid container spacing={4} className="formGroupItem">
                              <Grid item xs={4}>
                                <InputLabel htmlFor="country">
                                  <div className="label-heading">
                                    Country <sup>*</sup>
                                  </div>
                                </InputLabel>
                              </Grid>

                              <Grid item xs={7}>
                                <Select
                                  MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                  name="tenant_country"
                                  id="tenant_country"
                                  size="small"
                                  fullWidth
                                  placeholder="Select here"
                                  autoComplete="off"
                                  disabled={disableEntireField}
                                  value={values.tenant_country || ""}
                                  error={
                                    errors.tenant_country && touched.tenant_country ? true : false
                                  }
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                >
                                  {country.map((item: any, index: number) => (
                                    <MenuItem key={index} value={item.value}>
                                      {item.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {errors.tenant_country && touched.tenant_country && (
                                  <div className="input-feedback" style={{ color: "red" }}>
                                    {errors.tenant_country}
                                  </div>
                                )}
                              </Grid>
                            </Grid>

                            <Grid container spacing={4} className="formGroupItem">
                              <Grid item xs={4}>
                                <InputLabel htmlFor="tenant_location">
                                  <div className="label-heading">Location</div>
                                </InputLabel>
                              </Grid>

                              <Grid item xs={7}>
                                <Field
                                  as={OutlinedInput}
                                  name="tenant_location"
                                  id="tenant_location"
                                  type="text"
                                  autoComplete="off"
                                  disabled={disableEntireField}
                                  placeholder="Enter here"
                                  size="small"
                                  fullWidth
                                  value={values.tenant_location || ""}
                                  error={
                                    errors.tenant_location && touched.tenant_location ? true : false
                                  }
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />

                                {errors.tenant_location && touched.tenant_location && (
                                  <div className="input-feedback" style={{ color: "red" }}>
                                    {errors.tenant_location}
                                  </div>
                                )}
                              </Grid>
                            </Grid>
                          </Box>
                          <Box border={"none"} className="setting-form-group" sx={{ width: "90%" }}>
                            <Grid container spacing={4} className="formGroupItem">
                              <Grid item xs={4}>
                                <InputLabel htmlFor="emailId">
                                  <div className="label-heading">Tenant Email ID *</div>

                                  <Typography variant="body1" component="p">
                                    Sign up link will be sent to this email ID.
                                  </Typography>
                                </InputLabel>
                              </Grid>
                              <Grid item xs={7}>
                                <Field
                                  as={OutlinedInput}
                                  name="tenant_email"
                                  id="tenant_email"
                                  type="text"
                                  placeholder="Enter here"
                                  size="small"
                                  fullWidth
                                  autoComplete="off"
                                  disabled={disableEntireField}
                                  value={values.tenant_email || ""}
                                  error={errors.tenant_email && touched.tenant_email ? true : false}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />

                                {errors.tenant_email && touched.tenant_email && (
                                  <div className="input-feedback" style={{ color: "red" }}>
                                    {errors.tenant_email}
                                  </div>
                                )}
                              </Grid>
                            </Grid>
                            <Grid container spacing={4} className="formGroupItem">
                              <Grid item xs={4}>
                                <InputLabel htmlFor="emailId">
                                  <div className="label-heading">Primary Phone Number *</div>

                                  <Typography variant="body1" component="p">
                                    This will be your main contact number
                                  </Typography>
                                </InputLabel>
                              </Grid>
                              <Grid item xs={7}>
                                <PhoneNumberInput
                                  countryOptions={country}
                                  formikBag={props as any}
                                  isViewOnly={disableEntireField}
                                />
                              </Grid>
                            </Grid>
                          </Box>

                          <Box className="setting-form-group" border={"none"} sx={{ width: "90%" }}>
                            <Grid container spacing={4} className="formGroupItem">
                              <Grid item xs={4}>
                                <InputLabel htmlFor="billing_plan">
                                  <div className="label-heading">Billing Plan *</div>

                                  <Typography variant="body1" component="p">
                                    This will be your Plan moving forward.
                                  </Typography>
                                </InputLabel>
                              </Grid>
                              <Grid item xs={7}>
                                <Select
                                  MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                  id="billing_plan"
                                  name="billing_plan"
                                  size="small"
                                  fullWidth
                                  autoComplete="off"
                                  disabled={disableEntireField}
                                  value={values.billing_plan || ""}
                                  error={errors.billing_plan && touched.billing_plan ? true : false}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                >
                                  {billingPlan.map((item: any, index: number) => (
                                    <MenuItem key={index} value={item.id}>
                                      {item.title}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {errors.billing_plan && touched.billing_plan && (
                                  <div className="input-feedback" style={{ color: "red" }}>
                                    {errors.billing_plan}
                                  </div>
                                )}
                              </Grid>
                            </Grid>

                            {activeStep === 2 && (
                              <Button
                                // variant='contained'
                                sx={{ float: "right", backgroundColor: "#C1C6D4" }}
                                onClick={() => {
                                  setDisableEntireField(false);
                                  setActiveStep(0);
                                }}
                              >
                                {" "}
                                Edit{" "}
                              </Button>
                            )}
                          </Box>
                        </div>
                        {/* <StepTwoForm  /> */}
                        <Box className="setting-form-group" border={"none"} sx={{ width: "90%" }}>
                          {new Array(organizationCount).fill(0)?.map((_, _idx) => {
                            return (
                              <Box className={`organizations[${_idx}]`}>
                                <Grid container spacing={4} className="formGroupItem">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="fullName">
                                      <div className="label-heading">
                                        Organization Name {_idx + 1} *
                                      </div>
                                    </InputLabel>
                                  </Grid>
                                  <Grid item xs={7}>
                                    <Field
                                      as={OutlinedInput}
                                      name={`organizations.${_idx}.organization_name`}
                                      id="organization_name"
                                      type="text"
                                      placeholder="Enter here"
                                      size="small"
                                      fullWidth
                                      autoComplete="off"
                                      disabled={disableEntireField}
                                      value={values.organizations[_idx]?.organization_name || ""}
                                      error={
                                        errors.organization_name && touched.organization_name
                                          ? true
                                          : false
                                      }
                                      onChange={(ev: any) => {
                                        handleChange(ev);
                                        setStepsMount({
                                          ...stepsMount,
                                          step2: true,
                                        });
                                      }}
                                      onBlur={handleBlur}
                                    />

                                    {errors.organization_name && touched.organization_name && (
                                      <div className="input-feedback" style={{ color: "red" }}>
                                        {errors.organization_name}
                                      </div>
                                    )}
                                  </Grid>
                                </Grid>
                                <Grid container spacing={4} className="formGroupItem">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="organization_industry">
                                      <div className="label-heading">Industry *</div>
                                    </InputLabel>
                                  </Grid>

                                  <Grid item xs={7}>
                                    <Select
                                      MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                      name={`organizations.${_idx}.organization_industry`}
                                      id="organization_industry"
                                      size="small"
                                      fullWidth
                                      placeholder="Select here"
                                      autoComplete="off"
                                      disabled={disableEntireField}
                                      value={
                                        values.organizations[_idx]?.organization_industry || ""
                                      }
                                      error={
                                        errors.organization_industry &&
                                        touched.organization_industry
                                          ? true
                                          : false
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    >
                                      {industry.map((item: any, index: number) => (
                                        <MenuItem key={index} value={item.id}>
                                          {item.name}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                    {errors.organization_industry &&
                                      touched.organization_industry && (
                                        <div className="input-feedback" style={{ color: "red" }}>
                                          {errors.organization_industry}
                                        </div>
                                      )}
                                  </Grid>
                                </Grid>
                                <Grid container spacing={4} className="formGroupItem">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="organization_country">
                                      <div className="label-heading">Country *</div>
                                    </InputLabel>
                                  </Grid>

                                  <Grid item xs={7}>
                                    <Select
                                      MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                      name={`organizations.${_idx}.organization_country`}
                                      id="organization_country"
                                      size="small"
                                      fullWidth
                                      placeholder="Select here"
                                      autoComplete="off"
                                      disabled={disableEntireField}
                                      value={values.organizations[_idx]?.organization_country || ""}
                                      error={
                                        errors.organization_country && touched.organization_country
                                          ? true
                                          : false
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    >
                                      {country.map((item: any, index: number) => (
                                        <MenuItem key={index} value={item.value}>
                                          {item.label}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                    {errors.organization_country &&
                                      touched.organization_country && (
                                        <div className="input-feedback" style={{ color: "red" }}>
                                          {errors.organization_country}
                                        </div>
                                      )}
                                  </Grid>
                                </Grid>
                                <Grid container spacing={4} className="formGroupItem">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="organization_language">
                                      <div className="label-heading">Language</div>
                                    </InputLabel>
                                  </Grid>

                                  <Grid item xs={7}>
                                    <Select
                                      MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                      id="organization_language"
                                      name={`organizations.${_idx}.organization_language`}
                                      size="small"
                                      autoComplete="off"
                                      disabled={disableEntireField}
                                      fullWidth
                                      value={
                                        values.organizations[_idx]?.organization_language || ""
                                      }
                                      error={
                                        errors.organization_language &&
                                        touched.organization_language
                                          ? true
                                          : false
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    >
                                      {language.map((item: any, index: number) => (
                                        <MenuItem key={index} value={item.id}>
                                          {item.name}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                    {errors.organization_language &&
                                      touched.organization_language && (
                                        <div className="input-feedback" style={{ color: "red" }}>
                                          {errors.organization_language}
                                        </div>
                                      )}
                                  </Grid>
                                </Grid>
                                <Grid container spacing={4} className="formGroupItem">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="organization_date_format">
                                      <div className="label-heading">Date Format *</div>
                                    </InputLabel>
                                  </Grid>

                                  <Grid item xs={7}>
                                    <Select
                                      MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                      id="organization_date_format"
                                      name={`organizations.${_idx}.organization_date_format`}
                                      size="small"
                                      autoComplete="off"
                                      disabled={disableEntireField}
                                      fullWidth
                                      value={
                                        values.organizations[_idx]?.organization_date_format || ""
                                      }
                                      error={
                                        errors.organization_date_format &&
                                        touched.organization_date_format
                                          ? true
                                          : false
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    >
                                      {dateFormat.map((item: any, index: number) => (
                                        <MenuItem key={index} value={item.id}>
                                          {item.name}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                    {errors.organization_date_format &&
                                      touched.organization_date_format && (
                                        <div className="input-feedback" style={{ color: "red" }}>
                                          {errors.organization_date_format}
                                        </div>
                                      )}
                                  </Grid>
                                </Grid>
                                <Grid container spacing={4} className="formGroupItem">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="organization_time_format">
                                      <div className="label-heading">Time Format *</div>
                                    </InputLabel>
                                  </Grid>

                                  <Grid item xs={7}>
                                    <Select
                                      MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                      id="organization_time_format"
                                      name={`organizations.${_idx}.organization_time_format`}
                                      size="small"
                                      autoComplete="off"
                                      disabled={disableEntireField}
                                      fullWidth
                                      value={
                                        values.organizations[_idx]?.organization_time_format || ""
                                      }
                                      error={
                                        errors.organization_time_format &&
                                        touched.organization_time_format
                                          ? true
                                          : false
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    >
                                      {timeFormat.map((item: any, index: number) => (
                                        <MenuItem key={index} value={item.id}>
                                          {item.name}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                    {errors.organization_time_format &&
                                      touched.organization_time_format && (
                                        <div className="input-feedback" style={{ color: "red" }}>
                                          {errors.organization_time_format}
                                        </div>
                                      )}
                                  </Grid>
                                </Grid>
                                <Grid container spacing={4} className="formGroupItem">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="organization_email">
                                      <div className="label-heading">
                                        Organization Admin Email ID*
                                      </div>

                                      <Typography variant="body1" component="p">
                                        Sign up link will be sent to this email ID.
                                      </Typography>
                                    </InputLabel>
                                  </Grid>

                                  <Grid item xs={7}>
                                    <Field
                                      as={OutlinedInput}
                                      name={`organizations.${_idx}.organization_email`}
                                      id="organization_email"
                                      type="text"
                                      placeholder="Enter here"
                                      size="small"
                                      fullWidth
                                      autoComplete="off"
                                      disabled={disableEntireField}
                                      value={values.organizations[_idx]?.organization_email || ""}
                                      error={
                                        errors.organization_email && touched.organization_email
                                          ? true
                                          : false
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />

                                    {errors.organization_email && touched.organization_email && (
                                      <div className="input-feedback" style={{ color: "red" }}>
                                        {errors.organization_email}
                                      </div>
                                    )}
                                  </Grid>
                                </Grid>

                                {activeStep === 2 && (
                                  <Button
                                    // variant="contained"
                                    sx={{ float: "right", backgroundColor: "#C1C6D4" }}
                                    onClick={() => {
                                      setDisableEntireField(false);
                                      setActiveStep(1);
                                    }}
                                  >
                                    {" "}
                                    Edit{" "}
                                  </Button>
                                )}

                                <Divider
                                  sx={{
                                    // mb: 5,
                                    mt: 9,
                                  }}
                                />
                              </Box>
                            );
                          })}

                          <Grid container spacing={4} className="formGroupItem">
                            <Grid item xs={4}>
                              <InputLabel htmlFor="organization_email">
                                <div className="label-heading">
                                  <Button
                                    // variant="outlined"
                                    onClick={AddAdditionalForm}
                                  >
                                    {" "}
                                    <span>&#65291;</span> Add Organization{" "}
                                  </Button>
                                </div>
                              </InputLabel>
                            </Grid>
                          </Grid>
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                          <Button color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
                            Back
                          </Button>
                          <Box sx={{ flex: "1 1 auto" }} />
                          {isStepOptional(activeStep) && (
                            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                              Skip
                            </Button>
                          )}

                          {activeStep === steps.length - 1 && (
                            <Button
                              type="submit"
                              variant="contained"
                              disabled={isSubmitting ? true : false}
                              // isSubmitting={isSubmitting}
                              onClick={() => {
                                handleSubmit();
                              }}
                              sx={{ mr: 1 }}
                            >
                              {param?.id ? "Update" : "Create"}
                              {isSubmitting && (
                                <CircularProgress
                                  color="inherit"
                                  size={18}
                                  sx={{ marginLeft: "10px" }}
                                />
                              )}
                            </Button>
                          )}
                        </Box>
                      </React.Fragment>
                    </>
                  ) : (
                    <Box className="setting-form-group" sx={{ width: "90%" }}>
                      <React.Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
                        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                          <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                          >
                            Back
                          </Button>
                          <Box sx={{ flex: "1 1 auto" }} />
                          {isStepOptional(activeStep) && (
                            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                              Skip
                            </Button>
                          )}
                          <Button onClick={handleNext}>
                            {activeStep === steps.length - 1 ? "Proceed" : "Next"}
                          </Button>
                        </Box>
                      </React.Fragment>
                    </Box>
                  )}
                </>
              );
            }}
          </Formik>

          {/* --- */}
        </div>
      </Box>

      <div>
        <ConfirmationModal
          openModal={open}
          setOpenModal={setOpen}
          confirmationIcon={SaveIcon}
          handelConfirmation={() => navigate("/dashboard")}
          confirmationHeading={
            isUpdated ? "Tenant Updated Successfully!" : "Tenant Created Successfully!"
          }
          confirmationDesc={
            isUpdated
              ? ``
              : `An email that consists of sign up link has been sent to wjdfbwj@bwf.fw.`
          }
          status={"Normal"}
          IsSingleBtn={true}
        />
        {/* <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}>
          <Fade in={open}>
            <Box sx={style}>
              <CheckCircleOutlineIcon color="success" fontSize="large" />
              <Typography id="transition-modal-title" variant="h5" color={'success'} component="h1">
                Tenant Created Successfully!
              </Typography>
              <Typography variant="subtitle2" id="transition-modal-description" sx={{ mt: 1 }}>
                A new tenant has been added to the system.
              </Typography>
              <Button fullWidth sx={{ mt: 2 }} onClick={() => navigate('/dashboard')}>
                {' '}
                Go to Dashboard{' '}
              </Button>
            </Box>
          </Fade>
        </Modal> */}
      </div>
    </div>
  );
};
export default AddTenant;
