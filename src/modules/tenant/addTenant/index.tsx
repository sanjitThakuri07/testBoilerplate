/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";

import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
// import './style.scss';
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import ModalLayout from "src/components/ModalLayout";
import BackButton from "src/components/buttons/back";
import PhoneNumberInput from "containers/setting/profile/PhoneNumberInput";
import ProfilePicture from "containers/setting/profile/ProfilePicture";
import { Field, Formik, FormikProps } from "formik";
import { MenuOptions, Phone } from "interfaces/profile";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import { deleteAPI, getAPI, postAPI, putAPI } from "src/lib/axios";
import * as Yup from "yup";
import SaveIcon from "../../../assets/icons/save_icon.svg";
import FullPageLoader from "src/components/FullPageLoader";
// import './style.scss';

interface IsOrganizationForm {
  photo: string | undefined;
  tenant_full_name: string;
  tenant_designation: number | null;
  tenant_country: number | null;
  tenant_location: string;
  tenant_email: string;
  phone: Phone[];
  billing_plan: string;
}

const AddTenant: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [successMessage, setSuccessMessage] = useState([]);
  const [disableEntireField, setDisableEntireField] = useState(false);
  const [country, setCountry] = useState<any>([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [designation, setDesignation] = useState<any>([]);
  const [billingPlan, setBillingPlan] = useState<any>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [designationTitle, setDesignationTitle] = useState("");
  const [designationId, setDesignationId] = useState("");

  const [initialOrganizationData, setInitialOrganizationData] = useState<IsOrganizationForm>({
    tenant_full_name: "",
    photo: "",
    tenant_designation: null,
    tenant_country: null,
    tenant_location: "",
    tenant_email: "",
    phone: [{ code: "", phone: "" }],
    billing_plan: "",
  });

  const { enqueueSnackbar } = useSnackbar();

  const handleOpen = () => setOpen(true);

  const navigate = useNavigate();
  const param = useParams();

  const setErrorNotificationn = (error: any) => {
    const {
      response: {
        data: { detail },
      },
    } = error;
    enqueueSnackbar(
      (detail?.message && detail?.message) || "Something went wrong !!. Please try again later",
      {
        variant: "error",
      },
    );
  };

  const getTenantId = () => {
    if (param.id) {
      setDisableEntireField(true);
      setIsFetching(true);
      getAPI(`tenant/${param.id}`)
        .then((res) => {
          if (res.status === 200) {
            setIsFetching(false);
            setInitialOrganizationData({
              tenant_full_name: res.data.tenant.full_name,
              photo: res.data.tenant.photo,
              tenant_designation:
                res.data.tenant.designation_id === "add_designation"
                  ? null
                  : res.data.tenant.designation_id,
              tenant_country: res.data.tenant.country_id,
              tenant_location: res.data.tenant.location,
              tenant_email: res.data.tenant.login_id,

              phone: res.data.tenant.phone.map((a: { code: any; id: any; phone_number: any }) => ({
                code: a?.code,
                id: a?.id,
                phone: a?.phone_number,
              })),
              billing_plan: res.data.tenant.billing_plan,
            });
          }
        })
        .catch((error) => {
          setIsFetching(false);
          // const {
          //   response: { data: detail },
          // } = error;
          setErrorNotificationn(error);
          navigate("/dashboard");
        });
    }
  };

  const submitHandler = (values: any, actions: any) => {
    let payload = {
      tenant: {
        full_name: values?.tenant_full_name,
        photo: values?.photo,
        designation:
          values?.tenant_designation === "add_designation" ? null : values?.tenant_designation,
        country: values?.tenant_country,
        location: values?.tenant_location,
        tenant_email_id: values?.tenant_email,
        phone_numbers: values?.phone,
        billing_plan: values?.billing_plan,
        tenant_code: values?.country_code,
      },
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
          actions.setSubmitting(false);
          setErrorNotificationn(err);
        });
    } else {
      postAPI("/tenant/", payload)
        .then((res: { data: any; status: any }) => {
          actions.setSubmitting(false);
          if (res.status === 200) {
            // logic here
            setSuccessMessage(res.data.email);
            handleOpen();
          }
        })
        .catch((err: any) => {
          actions.setSubmitting(false);
          setErrorNotificationn(err);
        });
    }
  };

  //   create a get method to fetch the data from the API
  const getCountryData = async () => {
    const { status, data } = await getAPI("config/country");
    if (status === 200) {
      const options = data;
      const menuOptions: MenuOptions[] = options.map((opt: any) => {
        return {
          value: opt.id,
          label: opt.name,
          phone_code: opt.phone_code,
        };
      });
      setCountry(options);
    }
  };

  const getDesignationData = async () => {
    await getAPI("config/designation/")
      .then((res: { data: any; status: any }) => {
        if (res.status === 200) {
          setDesignation(res.data.items);
        }
      })
      .catch((err: any) => {
        setErrorNotificationn(err);
        // enqueueSnackbar('Designation - ' + err?.message || 'Error on getting designation', {
        //   variant: 'error',
        // });
      });
  };

  const getBillingPlanData = () => {
    getAPI("billings/")
      .then((res: { data: any; status: any }) => {
        if (res.status === 200) {
          setBillingPlan(res.data.items);
        }
      })
      .catch((err: any) => {
        setErrorNotificationn(err);
        // enqueueSnackbar('Billing Plan - ' + err?.message || 'Error on getting billing plan', {
        //   variant: 'error',
        // });
      });
  };

  const handleEditBtn = () => {
    setDisableEntireField(false);
  };

  useEffect(() => {
    getCountryData();
    getDesignationData();
    getBillingPlanData();
    getTenantId();
  }, [param.id]);

  const handleAddDesignation = () => {
    const payload = {
      title: designationTitle,
    };

    if (!designationTitle) {
      enqueueSnackbar("Please enter designation title", {
        variant: "error",
      });
      return;
    }

    postAPI("/config/designation/", [payload])
      .then((res: { data: any; status: any; message: any }) => {
        if (res.status === 200) {
          enqueueSnackbar("Designation added successfully", {
            variant: "success",
          });
          setDesignationTitle("");
          getDesignationData();
        }
      })
      .catch((err: any) => {
        setErrorNotificationn(err);
      });
  };

  React.useEffect(() => {
    if (designationId) {
      setDesignationTitle(designation.filter((a: { id: any }) => a.id === designationId)[0].title);
    }
  }, [designationId]);

  const handleEditDesignation = () => {
    if (!designationTitle) {
      enqueueSnackbar("Designation title cannot be empty", {
        variant: "error",
      });
      return;
    }

    const payload = {
      title: designationTitle,
    };

    putAPI(`config/designation/${designationId}`, payload)
      .then((res: { data: any; status: any; message: any }) => {
        if (res.status === 200) {
          enqueueSnackbar("Designation updated successfully", {
            variant: "success",
          });
          setDesignationTitle("");
          setDesignationId("");
          getDesignationData();
        }
      })
      .catch((err: any) => {
        setErrorNotificationn(err);
      });
  };

  const handleDeleteDesignation = (index: number) => {
    const payload = {
      config_ids: [index],
    };
    deleteAPI(`config/designation/`, payload).then((res) => {
      enqueueSnackbar("Designation deleted successfully", {
        variant: "success",
      });

      // remove the deleted item from the state
      const newDesignation = designation.filter((item: any) => item.id !== index);
      setDesignation(newDesignation);
    });
  };

  const memoizedData = React.useMemo(
    () => ({
      country: country,
      billingPlan: billingPlan,
      designation: designation,
    }),
    [country, billingPlan, designation],
  );

  const deleteIconStyle = {
    cursor: "pointer",
    height: "20px",
    width: "20px",
  };
  if (isFetching) {
    return (
      <>
        <FullPageLoader />
      </>
    );
  }

  return (
    <div className="TENANT_PAGE">
      <div
        className="page-heading"
        style={{
          padding: "0 24px",
        }}
      >
        <Typography variant="h5" color="primary" className="heading">
          {param.id ? (
            initialOrganizationData?.tenant_full_name ? (
              initialOrganizationData?.tenant_full_name
            ) : (
              <CircularProgress></CircularProgress>
            )
          ) : (
            "Create New Tenant"
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
              tenant_full_name: Yup.string()
                .required("Full name is required!")
                .max(50, "Full name not more than 50 characters"),
              tenant_email: Yup.string()
                .email("Please enter valid email")
                .required("Email is required!")
                .min(5, "Email must be at least 5 characters long")
                .max(50, "Email not more than 50 characters long"),
              tenant_location: Yup.string()
                .min(3, "Location must be at least 3 character long")
                .max(50, "Location must be at most 50 character long")
                .nullable(),
              billing_plan: Yup.string().required("Please select billing plan"),
              phone: Yup.array().of(
                Yup.object().shape({
                  code: Yup.string().required("Please select country code"),
                  phone: Yup.string()
                    .required("Phone number is required")
                    .matches(/^[0-9]+$/, "Phone number must be only digits")
                    .min(8, "Phone number must be at least 8 digits")
                    .max(14, "Phone number not more than 14 digits"),
                }),
              ),
              tenant_country: Yup.string().nullable().required("Please select country"),
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

              return (
                <>
                  <ModalLayout
                    id="StartInspectionBookingModal"
                    children={
                      <>
                        <div
                          className="config_modal_form_css user__department-field"
                          style={{
                            maxHeight: "calc(100vh - 100px)",
                            overflowY: "auto",
                          }}
                        >
                          <div className="config_modal_heading">
                            <div className="config_modal_title"> New Designation</div>
                            <div className="config_modal_text">
                              <div>Create a new disignation here.</div>
                            </div>
                          </div>

                          <Box
                            sx={{
                              padding: "0 16px",
                            }}
                          >
                            <Field
                              htmlFor="title"
                              as={TextField}
                              name="title"
                              id="title"
                              type="text"
                              data-testid="title"
                              placeholder="Enter here"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              disabled={disableEntireField}
                              className={disableEntireField ? "disabled" : ""}
                              onChange={(e: any) => setDesignationTitle(e.target.value)}
                              onBlur={handleBlur}
                              value={designationTitle}
                              InputProps={{
                                endAdornment: (
                                  <Button
                                    onClick={() => {
                                      designationId
                                        ? handleEditDesignation()
                                        : handleAddDesignation();
                                    }}
                                  >
                                    {designationId ? "Update" : "Add"}
                                  </Button>
                                ),
                              }}
                            />

                            <div
                              className="designation_list"
                              style={{
                                margin: "16px 0",
                                maxHeight: "400px",
                                overflowY: "auto",
                              }}
                            >
                              {designation.map((item: any, index: number) => (
                                <MenuItem
                                  key={index}
                                  value={item.id}
                                  style={{
                                    justifyContent: "space-between",
                                  }}
                                >
                                  {item.title}

                                  <div>
                                    <IconButton
                                      onClick={() => {
                                        setDesignationId(item.id);
                                        // handleEditDesignation(item.id);
                                      }}
                                    >
                                      <EditOutlinedIcon style={deleteIconStyle} />
                                    </IconButton>
                                    <IconButton
                                      onClick={() => {
                                        handleDeleteDesignation(item.id);
                                      }}
                                    >
                                      <DeleteOutlineOutlinedIcon style={deleteIconStyle} />
                                    </IconButton>
                                  </div>
                                </MenuItem>
                              ))}
                            </div>
                          </Box>
                        </div>
                      </>
                    }
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                  />

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
                            {isSubmitting && (
                              <CircularProgress
                                color="inherit"
                                size={18}
                                sx={{ marginLeft: "10px" }}
                              />
                            )}
                          </Button>
                        ) : (
                          ""
                        )}

                        <Grid container spacing={4} className="formGroupItem">
                          <Grid item xs={12}>
                            <ProfilePicture
                              profilePicture={values?.photo}
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
                            <InputLabel htmlFor="tenant_full_name">
                              <div className="label-heading">Full Name *</div>
                            </InputLabel>
                          </Grid>

                          <Grid item xs={7}>
                            <Field
                              htmlFor="tenant_full_name"
                              as={OutlinedInput}
                              name="tenant_full_name"
                              id="tenant_full_name"
                              type="text"
                              data-testid="tenant_full_name"
                              placeholder="Enter here"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              disabled={disableEntireField}
                              value={values?.tenant_full_name || ""}
                              className={disableEntireField ? "disabled" : ""}
                              error={
                                errors?.tenant_full_name && touched?.tenant_full_name ? true : false
                              }
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />

                            {errors?.tenant_full_name && touched?.tenant_full_name && (
                              <div className="input-feedback" style={{ color: "red" }}>
                                {errors?.tenant_full_name}
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
                              data-testid="tenant_designation"
                              placeholder="Select here"
                              autoComplete="off"
                              disabled={disableEntireField}
                              value={values?.tenant_designation || ""}
                              error={
                                errors?.tenant_designation && touched?.tenant_designation
                                  ? true
                                  : false
                              }
                              className={disableEntireField ? "disabled" : ""}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              <MenuItem
                                key={"add"}
                                value={"add_designation"}
                                onClick={() => {
                                  setOpenModal(true);
                                }}
                              >
                                + Add New Designation
                              </MenuItem>
                              {designation.map((item: any, index: number) => (
                                <MenuItem key={index} value={item.id}>
                                  {item.title}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors?.tenant_designation && touched?.tenant_designation && (
                              <div className="input-feedback" style={{ color: "red" }}>
                                {errors?.tenant_designation}
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
                              data-testid="tenant_country"
                              placeholder="Select here"
                              autoComplete="off"
                              disabled={disableEntireField}
                              value={values?.tenant_country || ""}
                              error={
                                errors?.tenant_country && touched?.tenant_country ? true : false
                              }
                              onChange={handleChange}
                              className={disableEntireField ? "disabled" : ""}
                              onBlur={handleBlur}
                            >
                              {country.map((item: any, index: number) => (
                                // <MenuItem key={index} value={item.value}>
                                //   {item.label}
                                // </MenuItem>
                                <MenuItem key={index} value={item.id}>
                                  {item.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors?.tenant_country && touched?.tenant_country && (
                              <div className="input-feedback" style={{ color: "red" }}>
                                {errors?.tenant_country}
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
                              data-testid="tenant_location"
                              autoComplete="off"
                              disabled={disableEntireField}
                              placeholder="Enter here"
                              size="small"
                              fullWidth
                              value={values?.tenant_location || ""}
                              error={
                                errors?.tenant_location && touched?.tenant_location ? true : false
                              }
                              onChange={handleChange}
                              className={disableEntireField ? "disabled" : ""}
                              onBlur={handleBlur}
                            />

                            {errors?.tenant_location && touched?.tenant_location && (
                              <div className="input-feedback" style={{ color: "red" }}>
                                {errors?.tenant_location}
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
                              data-testid="tenant_email"
                              autoComplete="off"
                              disabled={param.id ? true : false}
                              value={values?.tenant_email || ""}
                              error={errors?.tenant_email && touched?.tenant_email ? true : false}
                              onChange={handleChange}
                              className={param?.id ? "disabled" : ""}
                              onBlur={handleBlur}
                              // className={param.id ? 'disabled' : ''}
                            />

                            {errors?.tenant_email && touched?.tenant_email && (
                              <div className="input-feedback" style={{ color: "red" }}>
                                {errors?.tenant_email}
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
                              defaultCode={values?.tenant_country || 1}
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
                              data-testid="billing_plan"
                              autoComplete="off"
                              disabled={disableEntireField}
                              value={values?.billing_plan || ""}
                              error={errors?.billing_plan && touched?.billing_plan ? true : false}
                              onChange={handleChange}
                              className={disableEntireField ? "disabled" : ""}
                              onBlur={handleBlur}
                            >
                              {billingPlan.map((item: any, index: number) => (
                                <MenuItem key={index} value={item.id}>
                                  {item.title}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors?.billing_plan && touched?.billing_plan && (
                              <div className="input-feedback" style={{ color: "red" }}>
                                {errors?.billing_plan}
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
                        <Box sx={{ flex: "1 1 auto" }} />
                        <Button
                          type="submit"
                          variant="contained"
                          name="add_tenant_btn"
                          disabled={isSubmitting ? true : false}
                          // isSubmitting={isSubmitting}
                          className={disableEntireField ? "disabled" : ""}
                          sx={{ pointerEvents: disableEntireField ? "none" : "auto", mr: 1 }}
                          onClick={(e) => {
                            e.preventDefault();
                            !disableEntireField && handleSubmit();
                          }}
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
            isUpdated ? "Tenant Updated Successfully!" : "Tenant Created Successfully!"
          }
          confirmationDesc={
            isUpdated
              ? ``
              : `An email that consists of sign up link has been sent to ${successMessage}.`
          }
          status={"Normal"}
          IsSingleBtn={true}
        />
      </div>
    </div>
  );
};
export default AddTenant;
