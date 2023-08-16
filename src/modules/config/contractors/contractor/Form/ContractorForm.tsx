import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  CircularProgress,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { Formik, FormikProps, Field } from "formik";
import ProfilePicture from "src/modules/setting/profile/ProfilePicture";
import { useNavigate, useParams } from "react-router-dom";
import PhoneNumberInput from "src/modules/setting/profile/PhoneNumberInput";
import { contractorProps } from "src/src/interfaces/configs";
import { useSnackbar, SnackbarKey, SnackbarMessage, OptionsObject } from "notistack";
import Radio from "src/components/Radio";
import MultiEmailAdd from "src/components/MultiEmail/MultiEmailAdd";
import MultiUploader from "src/components/MultiFileUploader/index";
import { allContractorValidationSchema } from "src/validationSchemas/ContractorValidation";
import ResetTextField from "./ResetTextField";
import FullPageLoader from "src/components/FullPageLoader";
import DynamicSelectField from "src/modules/setting/profile/DynamicSelectField";
import ModalLayout from "src/components/ModalLayout";
import ServiceForm from "../../services/ServiceForm";
import { serviceProps } from "src/src/interfaces/configs";
import {
  putApiData,
  postApiData,
  fetchApI,
  fetchIndividualApi,
  // fetchInitialValues,
} from "src/modules/apiRequest/apiRequest";
import { useLocation } from "react-router-dom";

interface MyObject {
  [key: string]: string;
}

interface MenuOptions {
  id?: number;
  value?: number;
  label?: string;
  name?: string;
}

const ContractorForm: React.FC<{
  proceedToNextPage?: Function;
  data?: Object;
  isFormLoading?: boolean;
  setIsFormLoading?: Function;
  disabled?: boolean;
}> = ({ proceedToNextPage, data, isFormLoading, setIsFormLoading, disabled }) => {
  const [open, setOpen] = useState(false);
  const [openMultiImage, setOpenMultiImage] = useState(false);
  const [industryData, setIndustryData] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [languageData, setLanguageData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [countryPhoneData, setCountryPhoneData] = useState<any>([]);
  const [clearData, setClearData] = useState(false);
  const [contractorActive, setContractorActive] = useState(["Active", "Inactive"]);
  const [individualServices, setIndividualServices] = useState<serviceProps>({
    name: "",
    status: "Active",
    notes: "",
  });

  // radio button initial value
  const RadioOptions = [
    { id: 1, value: "organization", label: "Organization" },
    { id: 2, value: "individual", label: "Individual" },
  ];
  // form initial values
  const initialContractorValues: any = {
    id: undefined,
    profile_photo: undefined,
    contractor_type: undefined,
    name: undefined,
    email_id: [],
    industry_name: undefined,
    location: undefined,
    invoice_emails: [],
    operations_email: [],
    phone_numbers: [],
    website: undefined,
    industry: null,
    // language: null,
    country: null,
    status: "Active",
    notes: undefined,
    documents: [{ id: null, contractor: null, title: undefined, documents: [] }],
    services: "",
    contractor_address: undefined,
    phone: [{ code: "", phone: "" }],
  };

  const [initialValues, setInitialValues] = useState(initialContractorValues);

  const { enqueueSnackbar } = useSnackbar();
  // const handleOpen = () => setOpen(true);
  const [disableEntireField, setDisableEntireField] = useState(false);

  const navigate = useNavigate();
  const param = useParams();
  const handleReset = () => {};
  // Get the current location object
  const location = useLocation();

  // Get the value of the nextPage parameter
  const nextPage = new URLSearchParams(location.search).get("nextPage");

  const GetDatasAPi = async ({ contractorId }: any) => {
    let promises = [
      fetchApI({ setterFunction: setIndustryData, url: "industry", enqueueSnackbar }),
      fetchApI({
        setterFunction: setServicesData,
        url: "organization-service/",
        enqueueSnackbar,
        queryParam: { size: 10000000000 },
      }),
      fetchApI({
        setterFunction: setLanguageData,
        url: "config/language",
        enqueueSnackbar,
        queryParam: { size: 10000000000 },
      }),
      fetchApI({
        setterFunction: setCountryData,
        url: "country/",
        enqueueSnackbar,
        queryParam: { size: 10000000000 },
      }),
      fetchApI({
        setterFunction: setCountryPhoneData,
        url: "config/country",
        enqueueSnackbar,
        queryParam: { size: 10000000000 },
      }),
    ];

    // if (contractorId) {
    //   promises.push(fetchInitialValues({ id: Number(param.contractorId), setInitialValues }));
    // }

    await Promise.all(promises);
  };

  // fetching data for both with and without ids
  const fetchData = async ({ contractorId }: any) => {
    setIsFormLoading?.(true);
    await GetDatasAPi({ contractorId });
    // if (param?.contractorId) {
    // await fetchIndividualApi({
    //   id: contractorId,
    //   url: '',
    //   enqueueSnackbar,
    //   setterFunction: (data: any) => {
    //     setInitialValues(data);
    //   },
    // });
    // await fetchInitialValues({ id: Number(param.contractorId), setInitialValues });
    // }
    setIsFormLoading?.(false);
  };

  useEffect(() => {
    Number(nextPage) !== 2 && fetchData({ contractorId: param?.contractorId });
    if (nextPage) {
      proceedToNextPage?.(nextPage);
    }
  }, [param?.contractorId, nextPage]);

  useEffect(() => {
    if (Object?.values(data || {})?.length) {
      setInitialValues(data || {});
    }
  }, [Object?.values(data || {})?.length]);

  const submitHandler = async (values: any, actions: any) => {
    if (param?.contractorId) {
      await putApiData({
        // setterFunction: setSomeState,
        values,
        id: +param?.contractorId,
        url: "contractors",
        enqueueSnackbar: enqueueSnackbar,
        navigateTo: (id?: number) =>
          navigate(`/config/contractors/all-contractors/edit/${param?.contractorId}?nextPage=2`),
        domain: "Contractor",
        setterLoading: setIsFormLoading,
        message: "Data updated Succesfully",
      });
    } else {
      await postApiData({
        // setterFunction: setSomeState,
        values,
        url: "/contractors/",
        enqueueSnackbar: enqueueSnackbar,
        navigateTo: (id: number) =>
          navigate(`/config/contractors/all-contractors/edit/${id}?nextPage=2`),
        domain: "Contractor",
        setterLoading: setIsFormLoading,
      });
    }
  };

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <div>
          {/* --- */}
          <ModalLayout
            children={
              <>
                <div className="config_modal_form_css">
                  <div className="config_modal_heading">
                    <div className="config_modal_title">Add Service</div>
                    <div className="config_modal_text">
                      <div>Fill in the details for adding the new services.</div>
                    </div>
                  </div>
                  <ServiceForm
                    service={individualServices}
                    updateCard={setServicesData}
                    subSelectField={true}
                    closeModal={() => {
                      setOpen(!open);
                    }}
                  ></ServiceForm>
                </div>
              </>
            }
            openModal={open}
            setOpenModal={() => {
              setOpen(!open);
            }}
          />
          <Formik
            // key={key}
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values: contractorProps, actions) => {
              if (disabled) return;
              let finalValue: any = {};
              let { phone, documents, invoice_emails, operations_email, email_id, ...attr }: any =
                values;
              finalValue = { ...attr };
              // doing filter to remove unnecessary data that is null undefined from an array
              finalValue.email_id = email_id.filter(Boolean);
              finalValue.invoice_emails = invoice_emails.filter(Boolean);
              finalValue.operations_email = operations_email.filter(Boolean);
              finalValue.contractor_type = values?.contractor_type || "organization";
              finalValue.documents = documents?.length ? documents : [{ title: "", documents: [] }];
              finalValue.phone_numbers = phone
                ?.map((num: { code?: string; phone?: string }) =>
                  num?.code && num?.phone ? `${num?.code}/${num?.phone}` : undefined,
                )
                .filter(Boolean);

              // for files and documents
              if (documents?.length && documents[0].documents?.length) {
                finalValue.documents[0].title = documents[0]?.title;
                finalValue.documents[0].id = documents[0]?.id;
                finalValue.documents[0].documents = documents[0]?.documents.map((doc: any) => {
                  return doc?.base64
                    ? `${doc?.formatedFileSize}--${doc?.name};${doc?.base64}`
                    : doc;
                });
              }
              submitHandler(finalValue, actions);
            }}
            validationSchema={allContractorValidationSchema}
          >
            {(props: any) => {
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
                initialTouched,
              } = props;
              return (
                <>
                  {isFormLoading && <FullPageLoader />}
                  <>
                    {/* form top */}
                    <div
                      className="tenant-page-container"
                      style={{
                        margin: "40px 0",
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        padding: "10px 24px",
                      }}
                    >
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
                              // handleEditBtn();
                            }}
                            sx={{ mr: 1, float: "right" }}
                          >
                            Edit
                          </Button>
                        ) : (
                          ""
                        )}
                        {/* profile picture */}
                        {/* <Grid container spacing={4} className="formGroupItem"> */}
                        {/* <Grid item xs={12}> */}
                        <ProfilePicture
                          profilePicture={values?.profile_photo}
                          isViewOnly={disableEntireField}
                          handleUploadImage={(image: File) => {
                            return new Promise((res) => {
                              const reader = new FileReader();
                              reader.readAsDataURL(image);

                              reader.onload = (theFile) => {
                                const image = theFile.target?.result;
                                setFieldValue("profile_photo", image);
                                setFieldTouched("profile_photo");
                                res();
                              };
                            });
                          }}
                          profilePhotoHeading={"Profile Photo"}
                          profilePhotoSubHeading={"Update your profile picture."}
                        />
                        {/* </Grid> */}
                        {/* </Grid> */}

                        {/* contractor type*/}
                        <Grid container spacing={4} className="formGroupItem">
                          <Grid item xs={4}>
                            <InputLabel htmlFor="contractorType">
                              <div className="label-heading  align__label">
                                Contractor Type <sup>*</sup>
                              </div>
                            </InputLabel>
                          </Grid>

                          <Grid item xs={7} className="align__radio">
                            <Radio
                              radioOption={RadioOptions}
                              name="contractor_type"
                              id="contractor_type"
                              onChange={handleChange}
                              defaultValue={"organization"}
                              value={values?.contractor_type}
                              disabled={disabled}
                              className={disabled ? "disabled" : ""}
                            />

                            {/* {errors?.organization_name && touched?.organization_name && (
                              <div className="input-feedback" style={{ color: 'red' }}>
                                {errors?.organization_name}
                              </div>
                            )} */}
                          </Grid>
                        </Grid>

                        {/* organization name */}
                        <Grid container spacing={4} className="formGroupItem">
                          <Grid item xs={4}>
                            <InputLabel htmlFor="fullName">
                              <div className="label-heading  align__label">
                                {values?.contractor_type !== "individual"
                                  ? "Organization "
                                  : "Contractor "}
                                Name <sup>*</sup>
                              </div>
                            </InputLabel>
                          </Grid>

                          <Grid item xs={7}>
                            <Field
                              as={OutlinedInput}
                              name="name"
                              id="name"
                              type="text"
                              placeholder="Enter here"
                              size="small"
                              data-testid="name"
                              fullWidth
                              autoComplete="off"
                              disabled={disabled}
                              className={disabled ? "disabled" : ""}
                              value={values?.name || ""}
                              error={errors?.name && touched?.name ? true : false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />

                            {errors?.name && touched?.name && (
                              <div className="input-feedback" style={{ color: "red" }}>
                                {errors?.name}
                              </div>
                            )}
                          </Grid>
                        </Grid>

                        {/* organization  email */}
                        <Grid container spacing={4} className="formGroupItem emial__group">
                          <Grid item xs={4}>
                            <InputLabel htmlFor="emailId">
                              <div className="label-heading  align__label">
                                {values?.contractor_type !== "individual"
                                  ? "Organization "
                                  : "Contractor "}
                                Email ID *
                              </div>
                            </InputLabel>
                          </Grid>
                          <Grid item xs={7} className="multiple_email_address_id">
                            <MultiEmailAdd
                              formikBag={props as any}
                              name="email_id"
                              clearData={clearData}
                              setClearData={setClearData}
                              disableAdd={disabled}
                              isViewOnly={disabled || false}
                            />
                            {errors?.email_id && touched?.email_id && (
                              <div className="input-feedback" style={{ color: "red" }}>
                                {errors?.email_id}
                              </div>
                            )}
                          </Grid>
                        </Grid>

                        {/* services */}
                        <Grid container spacing={4} className="formGroupItem">
                          <Grid item xs={4}>
                            <InputLabel htmlFor="services">
                              <div className="label-heading  align__label">
                                Services <sup>*</sup>
                              </div>
                            </InputLabel>
                          </Grid>

                          <Grid item xs={7}>
                            <DynamicSelectField
                              isViewOnly={false}
                              handleChange={handleChange}
                              handleBlur={handleBlur}
                              handleSelectTouch={() => setFieldTouched("services", true)}
                              id="services"
                              menuOptions={servicesData}
                              value={values?.services || ""}
                              error={errors?.services}
                              touched={touched?.services}
                              addChildren={true}
                              children={"+ Add New Services"}
                              openModal={() => setOpen(true)}
                              multiple={true}
                              setData={"id"}
                              disabled={disabled}
                            />
                          </Grid>
                        </Grid>

                        {/* operations email */}
                        <Grid container spacing={4} className="formGroupItem">
                          <Grid item xs={4}>
                            <InputLabel htmlFor="operationsEmailId">
                              <div className="label-heading  align__label">Operations Email *</div>
                              <Typography variant="body1" component="p">
                                All the operations related mails will be sent to this email ID.
                              </Typography>
                            </InputLabel>
                          </Grid>
                          <Grid item xs={7} className="multiple_email_address_id">
                            <MultiEmailAdd
                              formikBag={props as any}
                              name="operations_email"
                              clearData={clearData}
                              setClearData={setClearData}
                              disableAdd={disabled}
                              isViewOnly={disabled || false}
                            />
                            {errors?.operations_email && touched?.operations_email && (
                              <div className="input-feedback" style={{ color: "red" }}>
                                {errors?.operations_email}
                              </div>
                            )}
                          </Grid>
                        </Grid>

                        {/* invoice email */}
                        <Grid container spacing={4} className="formGroupItem">
                          <Grid item xs={4}>
                            <InputLabel htmlFor="invoiceEmailId">
                              <div className="label-heading  align__label">Invoice Email *</div>
                              <Typography variant="body1" component="p">
                                All the operations related mails will be sent to this email ID.
                              </Typography>
                            </InputLabel>
                          </Grid>
                          <Grid item xs={7} className="multiple_email_address_id">
                            <MultiEmailAdd
                              formikBag={props as any}
                              disableAdd={disabled}
                              isViewOnly={disabled || false}
                              name="invoice_emails"
                              clearData={clearData}
                              setClearData={setClearData}
                            />
                            {errors?.invoice_emails && touched?.invoice_emails && (
                              <div className="input-feedback" style={{ color: "red" }}>
                                {errors?.invoice_emails}
                              </div>
                            )}
                          </Grid>
                        </Grid>

                        {/* primary phone number */}
                        <Grid container spacing={4} className="formGroupItem">
                          <Grid item xs={4}>
                            <InputLabel htmlFor="emailId">
                              <div className="label-heading  align__label">
                                Primary Phone Number *
                              </div>

                              <Typography variant="body1" component="p">
                                This will be your main contact number
                              </Typography>
                            </InputLabel>
                          </Grid>
                          <Grid item xs={7}>
                            <PhoneNumberInput
                              countryOptions={countryPhoneData}
                              formikBag={props as any}
                              addButtonClassName="add__more-group"
                              className="group__fields"
                              disableAdd={disabled}
                              isViewOnly={disabled || false}
                            />
                          </Grid>
                        </Grid>

                        {/* website */}
                        <Grid container spacing={4} className="formGroupItem">
                          <Grid item xs={4}>
                            <InputLabel htmlFor="website">
                              <div className="label-heading  align__label">Website</div>
                            </InputLabel>
                          </Grid>

                          <Grid item xs={7}>
                            <Field
                              as={OutlinedInput}
                              name="website"
                              id="website"
                              data-testid="website"
                              type="text"
                              autoComplete="off"
                              placeholder="Enter here"
                              size="small"
                              fullWidth
                              value={values?.website || ""}
                              error={errors?.website && touched?.website ? true : false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              disabled={disabled}
                              className={disabled ? "disabled" : ""}
                            />

                            {errors?.website && touched?.website && (
                              <div className="input-feedback" style={{ color: "red" }}>
                                {errors?.website}
                              </div>
                            )}
                          </Grid>
                        </Grid>

                        {/* language */}
                        {/* <Grid container spacing={4} className="formGroupItem">
                          <Grid item xs={4}>
                            <InputLabel htmlFor="language">
                              <div className="label-heading  align__label">Language</div>
                            </InputLabel>
                          </Grid>

                          <Grid item xs={7}>
                            <Select
                              MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                              name="language"
                              id="language"
                              size="small"
                              fullWidth
                              data-testid="language"
                              placeholder="Select here"
                              autoComplete="off"
                              disabled={disabled}
                              className={disabled ? 'disabled' : ''}
                              value={values?.language || ''}
                              error={errors?.language && touched?.language ? true : false}
                              onChange={handleChange}
                              onBlur={handleBlur}>
                              {languageData?.map((item: any, index: number) => (
                                <MenuItem key={item?.id} value={`${item.id}`}>
                                  {item.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors?.language && touched?.language && (
                              <div className="input-feedback" style={{ color: 'red' }}>
                                {errors?.language}
                              </div>
                            )}
                          </Grid>
                        </Grid> */}

                        {/* industry  */}
                        <Grid container spacing={4} className="formGroupItem">
                          <Grid item xs={4}>
                            <InputLabel htmlFor="industry">
                              <div className="label-heading  align__label">Industry</div>
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
                              disabled={disabled}
                              className={disabled ? "disabled" : ""}
                              value={values?.industry || ""}
                              error={errors?.industry && touched?.industry ? true : false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              {industryData?.map((item: any, index: number) => (
                                <MenuItem key={index} value={item.id}>
                                  {item.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors?.industry && touched?.industry && (
                              <div className="input-feedback" style={{ color: "red" }}>
                                {errors?.industry}
                              </div>
                            )}
                          </Grid>
                        </Grid>

                        {/* country */}
                        <Grid container spacing={4} className="formGroupItem">
                          <Grid item xs={4}>
                            <InputLabel htmlFor="country">
                              <div className="label-heading  align__label">Country</div>
                            </InputLabel>
                          </Grid>

                          <Grid item xs={7}>
                            <Select
                              MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                              name="country"
                              id="country"
                              size="small"
                              fullWidth
                              placeholder="Select here"
                              data-testid="country"
                              autoComplete="off"
                              disabled={disabled}
                              className={disabled ? "disabled" : ""}
                              value={values?.country || ""}
                              error={errors?.country && touched?.country ? true : false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              {countryData?.map((item: any, index: number) => (
                                <MenuItem key={index} value={item.id}>
                                  {item.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors?.country && touched?.country && (
                              <div className="input-feedback" style={{ color: "red" }}>
                                {errors?.country}
                              </div>
                            )}
                          </Grid>
                        </Grid>

                        {/* status */}
                        <Grid container spacing={4} className="formGroupItem">
                          <Grid item xs={4}>
                            <InputLabel htmlFor="status">
                              <div className="label-heading  align__label">
                                Status <sup>*</sup>
                              </div>
                            </InputLabel>
                          </Grid>
                          <Grid item xs={7}>
                            <Select
                              MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                              id="status"
                              size="small"
                              fullWidth
                              placeholder="Active"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name="status"
                              value={values?.status || ""}
                              disabled={disabled}
                              className={disabled ? "disabled" : ""}
                              error={Boolean(touched?.status && errors?.status)}
                            >
                              {contractorActive?.map((status) => (
                                <MenuItem key={status} value={`${status}`}>
                                  {status}
                                </MenuItem>
                              ))}
                            </Select>
                            {Boolean(touched?.status && errors?.status) && (
                              <FormHelperText error>{errors?.status}</FormHelperText>
                            )}
                          </Grid>
                        </Grid>
                      </Box>
                    </div>

                    {/* form bottom */}
                    <div
                      className="tenant-page-container"
                      style={{
                        margin: "40px 0",
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        padding: "10px 24px",
                      }}
                    >
                      <Box
                        borderTop={"none"}
                        className="setting-form-group"
                        sx={{
                          width: "90%",
                          marginTop: "0",
                          padding: 0,
                        }}
                      >
                        {/* multi upload file options */}
                        <Grid
                          container
                          spacing={4}
                          className="formGroupItem"
                          sx={{ marginTop: "0" }}
                        >
                          <Grid item xs={4}>
                            <InputLabel htmlFor="status">
                              <div className="label-heading  align__label">
                                Add Documents <sup>*</sup>
                              </div>
                              <Typography variant="body1" component="p">
                                All documents that are related to the contractors like agreements
                                bills etc.
                              </Typography>
                            </InputLabel>
                          </Grid>
                          {/* file uploader */}
                          <Grid item xs={7}>
                            <MultiUploader
                              setOpenMultiImage={setOpenMultiImage}
                              openMultiImage={openMultiImage}
                              getFileData={(files: [{ documents: any[]; title: string }]) => {
                                // here you get the selected files do what you want to accordingly

                                setFieldValue("documents", Array.isArray(files) ? files : [files]);
                              }}
                              initialData={values?.documents || []}
                              clearData={clearData}
                              setClearData={setClearData}
                              defaultViewer={true}
                              accept={{
                                "image/jpeg": [".jpeg", ".jpg"],
                                "image/png": [".png"],
                                "application/pdf": [".pdf"],
                                "application/csv": [".csv"],
                                "application/excel": [".xls", ".xlsx"],
                              }}
                              maxFileSize={2}
                              disabled={disabled}
                            />
                            {Boolean(values?.documents[0]?.documents.length === 0) && (
                              <FormHelperText error>
                                * Note: Document is required field
                              </FormHelperText>
                            )}
                          </Grid>
                        </Grid>

                        {/* add notes */}
                        <Grid container spacing={4} className="formGroupItem text-area">
                          <Grid item xs={4}>
                            <InputLabel htmlFor="notes">
                              <div className="label-heading  align__label">Add Notes</div>
                              <p>A message from you that has to communicated to.</p>
                            </InputLabel>
                          </Grid>
                          <Grid item xs={7}>
                            <FormGroup className="input-holder">
                              <TextareaAutosize
                                placeholder="Type any message that has to be passed on."
                                minRows={3}
                                id="notes"
                                onChange={(ev) => {
                                  setFieldValue("notes", ev.target.value);
                                  setFieldTouched("notes");
                                }}
                                className={`text__area-style ${disabled ? "disabled" : ""}`}
                                disabled={disabled}
                                name="notes"
                                value={values.notes}
                                onBlur={handleBlur}
                                maxLength={300}
                              />
                              <FormHelperText>
                                {300 - Number(values?.notes?.length || 0)} characters left
                              </FormHelperText>
                            </FormGroup>
                          </Grid>
                        </Grid>
                      </Box>
                    </div>

                    {/* <StepOneForm /> */}
                    {!disabled && (
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
                            variant="outlined"
                            type="button"
                            onClick={() => {
                              props.resetForm();
                              props.setValues(props.initialValues);
                              props.setTouched({});
                              setClearData(true);
                              setInitialValues(initialContractorValues);
                            }}
                            sx={{ mr: 1 }}
                          >
                            Clear All
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            disabled={values?.documents[0]?.documents?.length < 1}
                            // isSubmitting={isSubmitting}
                            onClick={() => {
                              setInitialValues(values);
                              handleSubmit();
                            }}
                            sx={{ mr: 1 }}
                          >
                            {param?.contractorId ? "Update" : "Save"} & Proceed
                            {isFormLoading && (
                              <CircularProgress
                                color="inherit"
                                size={18}
                                sx={{ marginLeft: "10px" }}
                              />
                            )}
                          </Button>
                        </Box>
                      </React.Fragment>
                    )}
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

export default ContractorForm;
