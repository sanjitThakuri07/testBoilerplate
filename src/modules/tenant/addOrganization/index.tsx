/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";

import {
  Button,
  CircularProgress,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import { Formik, FormikProps, Field } from "formik";
import * as Yup from "yup";
import ProfilePicture from "src/modules/setting/profile/ProfilePicture";
import { useNavigate, useParams } from "react-router-dom";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import PhoneNumberInput from "src/modules/setting/profile/PhoneNumberInput";
import { MenuOptions, Phone } from "src/interfaces/profile";
import SaveIcon from "../../../assets/icons/save_icon.svg";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import { useSnackbar } from "notistack";
import BackButton from "src/components/buttons/back";

interface IsOrganizationForm {
  photo: string | undefined;
  organization_name: string;
  industry: number | null;
  industry_name: string | null;
  country: number;
  location: string;
  owner_email: string;
  phone: Phone[];
}

const AddOrganization: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const [disableEntireField, setDisableEntireField] = useState(false);

  const [country, setCountry] = useState<any>([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [designation, setDesignation] = useState<any>([]);
  const [successMessage, setSuccessMessage] = useState([]);

  const [initialOrganizationData, setInitialOrganizationData] = useState<IsOrganizationForm>({
    organization_name: "",
    industry_name: "",
    photo: "",
    industry: null,
    country: 0,
    location: "",
    owner_email: "",
    phone: [],
  });

  const { enqueueSnackbar } = useSnackbar();
  const handleOpen = () => setOpen(true);

  const navigate = useNavigate();
  const param = useParams();

  const getOrgId = () => {
    if (param.id) {
      setDisableEntireField(true);

      getAPI(`organization/${param.id}`)
        .then((res) => {
          if (res.status === 200) {
            setInitialOrganizationData({
              organization_name: res.data.organization_name,
              industry_name: res.data.industry_name,
              photo: res.data.photo,
              industry: res.data.industry === null ? "other" : res.data.industry,
              country: res.data.country,
              location: res.data.location,
              owner_email: res.data.owner_email,

              phone: res.data.phone.map((a: { code: any; id: any; phone_number: any }) => ({
                code: a?.code,
                id: a?.id,
                phone: a?.phone_number,
              })),
            });
          }
        })
        .catch((err) => {
          enqueueSnackbar("Organization - " + err?.message || "Error on fetching organization", {
            variant: "error",
          });
        });
    }
  };

  const submitHandler = (values: any, actions: any) => {
    let payload = {
      organization_name: values.organization_name,
      photo: values.photo,
      industry: values.industry === "other" ? null : values.industry,
      industry_name: values.industry === "other" ? values.industry_name : null,
      country: values.country,
      location: values.location,
      owner_email: values.owner_email,
      phone_numbers: values.phone,
      tenant_code: values.country_code,
    };

    actions.setSubmitting(true);

    if (param.id) {
      putAPI(`organization/${param.id}`, payload)
        .then((res: { data: any; status: any }) => {
          actions.setSubmitting(false);
          if (res.status === 200) {
            setIsUpdated(true);
            handleOpen();
          }
        })
        .catch((err: any) => {
          const {
            response: { data: detail },
          } = err;

          actions.setSubmitting(false);
          enqueueSnackbar(
            (detail?.detail?.message ? detail?.detail?.message : err?.message) ||
              "Something went wrong!!. Please try after some time",
            {
              variant: "error",
            },
          );
        });
    } else {
      postAPI("/organization/", payload)
        .then((res: { data: any; status: any }) => {
          actions.setSubmitting(false);
          if (res.status === 200) {
            // logic here
            handleOpen();
            setSuccessMessage(res.data.email);
          }
        })
        .catch((err: any) => {
          const {
            response: { data: detail },
          } = err;

          actions.setSubmitting(false);
          enqueueSnackbar(
            (detail?.detail?.message ? detail?.detail?.message : err?.message) ||
              "Something went wrong!!. Please try after some time",
            {
              variant: "error",
            },
          );
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
      setCountry(options);
    }
  };

  const getDesignationData = () => {
    getAPI("industry")
      .then((res: { data: any; status: any }) => {
        if (res.status === 200) {
          setDesignation(res.data);
        }
      })
      .catch((err: any) => {
        enqueueSnackbar("Designation - " + err?.message || "Error on getting designation", {
          variant: "error",
        });
      });
  };

  const handleEditBtn = () => {
    setDisableEntireField(false);
  };

  useEffect(() => {
    getCountryData();
    getDesignationData();

    getOrgId();
  }, []);

  return (
    <div className="TENANT_PAGE">
      <div
        className="page-heading"
        style={{
          padding: "0 24px",
        }}
      >
        <Typography variant="h5" color="primary" className="heading">
          {param?.id ? (
            initialOrganizationData?.organization_name ? (
              initialOrganizationData?.organization_name
            ) : (
              <CircularProgress></CircularProgress>
            )
          ) : (
            "Create New Organization"
          )}
        </Typography>

        <BackButton backRoute={"/dashboard"} />
      </div>
      {/* --- */}
      <Box sx={{ width: "100%" }}>
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
              organization_name: Yup.string().required("Full name is required!").max(50),
              country: Yup.string().required("Please select country"),
              phone: Yup.array().of(
                Yup.object().shape({
                  code: Yup.string().required("Country code is required"),
                  phone: Yup.string().matches(/^\d{7,15}$/, "Invalid phone number format"),
                }),
              ),
              industry_name: Yup.string()
                .max(20, "Industry name cannot be more than 20 characters")
                .nullable(),
              location: Yup.string()
                // .required('Location is required!')
                .min(3, "Location must be at least 3 character long")
                .max(50, "Location must be at most 50 character long")
                .nullable(),
              owner_email: Yup.string()
                .email("Please enter valid email")
                .required("Email is required!")
                .min(5, "Email must be at least 5 character long")
                .max(50, "Email must be at most 50 character long"),
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

              console.log(errors);
              return (
                <>
                  <>
                    <div className="step-one-component">
                      <Box
                        borderTop={"none"}
                        className="setting-form-group"
                        sx={{
                          width: "90%",
                        }}
                      >
                        {param?.id ? (
                          <Button
                            type="submit"
                            variant="contained"
                            onClick={() => {
                              handleEditBtn();
                            }}
                            sx={{ mr: 1, float: "right" }}
                          >
                            Edit
                          </Button>
                        ) : (
                          ""
                        )}

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
                                Organization Name <sup>*</sup>
                              </div>
                            </InputLabel>
                          </Grid>

                          <Grid item xs={7}>
                            <Field
                              as={OutlinedInput}
                              name="organization_name"
                              id="organization_name"
                              type="text"
                              placeholder="Enter here"
                              size="small"
                              data-testid="organization_name"
                              fullWidth
                              autoComplete="off"
                              disabled={disableEntireField}
                              className={disableEntireField ? "disabled" : ""}
                              value={values.organization_name || ""}
                              error={
                                errors.organization_name && touched.organization_name ? true : false
                              }
                              onChange={handleChange}
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
                            <InputLabel htmlFor="Industry">
                              <div className="label-heading">Industry</div>
                            </InputLabel>
                          </Grid>

                          <Grid item xs={7}>
                            <Select
                              MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                              name="industry"
                              id="industry"
                              size="small"
                              fullWidth
                              data-testid="industry"
                              placeholder="Select here"
                              autoComplete="off"
                              disabled={disableEntireField}
                              className={disableEntireField ? "disabled" : ""}
                              value={values.industry || ""}
                              error={errors.industry && touched.industry ? true : false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              {designation.map((item: any, index: number) => (
                                <MenuItem key={index} value={item.id}>
                                  {item.name}
                                </MenuItem>
                              ))}
                              <MenuItem key={"other"} value={null || "other"}>
                                other
                              </MenuItem>
                            </Select>
                            {errors.industry && touched.industry && (
                              <div className="input-feedback" style={{ color: "red" }}>
                                {errors.industry}
                              </div>
                            )}
                          </Grid>
                        </Grid>

                        {values.industry === ("other" as any) && (
                          <Grid container spacing={4} className="formGroupItem">
                            <Grid item xs={4}>
                              <InputLabel htmlFor="fullName">
                                <div className="label-heading">
                                  Industry Name <sup>*</sup>
                                </div>
                              </InputLabel>
                            </Grid>

                            <Grid item xs={7}>
                              <Field
                                as={OutlinedInput}
                                name="industry_name"
                                id="industry_name"
                                type="text"
                                placeholder="Enter here"
                                size="small"
                                fullWidth
                                data-testid="industry_name"
                                autoComplete="off"
                                disabled={disableEntireField}
                                className={disableEntireField ? "disabled" : ""}
                                value={values.industry_name || ""}
                                error={errors.industry_name && touched.industry_name ? true : false}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />

                              {errors.industry_name && touched.industry_name && (
                                <div className="input-feedback" style={{ color: "red" }}>
                                  {errors.industry_name}
                                </div>
                              )}
                            </Grid>
                          </Grid>
                        )}

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
                              name="country"
                              id="country"
                              size="small"
                              fullWidth
                              data-testid="country"
                              placeholder="Select here"
                              autoComplete="off"
                              disabled={disableEntireField}
                              className={disableEntireField ? "disabled" : ""}
                              value={values.country || ""}
                              error={errors.country && touched.country ? true : false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              {country.map((item: any, index: number) => (
                                <MenuItem key={index} value={item.id}>
                                  {item.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.country && touched.country && (
                              <div className="input-feedback" style={{ color: "red" }}>
                                {errors.country}
                              </div>
                            )}
                          </Grid>
                        </Grid>

                        <Grid container spacing={4} className="formGroupItem">
                          <Grid item xs={4}>
                            <InputLabel htmlFor="location">
                              <div className="label-heading">Location</div>
                            </InputLabel>
                          </Grid>

                          <Grid item xs={7}>
                            <Field
                              as={OutlinedInput}
                              name="location"
                              id="location"
                              data-testid="location"
                              type="text"
                              autoComplete="off"
                              disabled={disableEntireField}
                              className={disableEntireField ? "disabled" : ""}
                              placeholder="Enter here"
                              size="small"
                              fullWidth
                              value={values.location || ""}
                              error={errors.location && touched.location ? true : false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />

                            {errors.location && touched.location && (
                              <div className="input-feedback" style={{ color: "red" }}>
                                {errors.location}
                              </div>
                            )}
                          </Grid>
                        </Grid>
                      </Box>
                      <Box border={"none"} className="setting-form-group" sx={{ width: "90%" }}>
                        <Grid container spacing={4} className="formGroupItem">
                          <Grid item xs={4}>
                            <InputLabel htmlFor="emailId">
                              <div className="label-heading">Organisation Admin Email ID *</div>

                              <Typography variant="body1" component="p">
                                Sign up link will be sent to this email ID.
                              </Typography>
                            </InputLabel>
                          </Grid>
                          <Grid item xs={7}>
                            <Field
                              as={OutlinedInput}
                              name="owner_email"
                              id="owner_email"
                              type="text"
                              data-testid="owner_email"
                              placeholder="Enter here"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              disabled={param?.id ? true : false}
                              className={param?.id ? "disabled" : ""}
                              value={values.owner_email || ""}
                              error={errors.owner_email && touched.owner_email ? true : false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />

                            {errors.owner_email && touched.owner_email && (
                              <div className="input-feedback" style={{ color: "red" }}>
                                {errors.owner_email}
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
                              addButtonClassName="add__more-group"
                              className="group__fields"
                              defaultCode={values.country}
                            />
                          </Grid>
                        </Grid>
                      </Box>

                      {/* <Box className="setting-form-group" border={'none'} sx={{ width: '90%' }}>
                        <Grid container spacing={4} className="formGroupItem">
                          <Grid item xs={4}>
                            <InputLabel htmlFor="Sample_fields">
                              <div className="label-heading">Do you want to load sample fields</div>

                              <Typography variant="body1" component="p">
                                This option loads pre-filled fields to the Configuration.
                              </Typography>
                            </InputLabel>
                          </Grid>
                        </Grid>
                      </Box> */}
                    </div>

                    {/* <StepOneForm /> */}
                    <React.Fragment>
                      <Box
                        borderBottom={"none"}
                        className="setting-form-group"
                        sx={{
                          width: "80%",
                          display: "flex",
                          flexDirection: "row",
                          pt: 0,
                        }}
                      >
                        <Box sx={{ flex: "1 1 auto" }} />
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={isSubmitting ? true : false}
                          // isSubmitting={isSubmitting}
                          className={disableEntireField ? "disabled" : ""}
                          onClick={() => {
                            handleSubmit();
                          }}
                          sx={{ pointerEvents: disableEntireField ? "none" : "auto", mr: 1 }}
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
                      </Box>
                    </React.Fragment>
                  </>
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
            isUpdated ? "Organization Updated Successfully!" : "Organization Created Successfully!"
          }
          confirmationDesc={
            isUpdated
              ? ``
              : `An email that consists of sign up link has been sent to ${successMessage} .`
          }
          status={"Normal"}
          IsSingleBtn={true}
        />
      </div>
    </div>
  );
};
export default AddOrganization;
