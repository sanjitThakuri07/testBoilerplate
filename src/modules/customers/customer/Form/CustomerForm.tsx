import React, { useEffect, useState } from "react";
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
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { Formik, FormikProps, Field, FieldArray } from "formik";
import * as Yup from "yup";
import ProfilePicture from "containers/setting/profile/ProfilePicture";
import { useNavigate, useParams } from "react-router-dom";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import PhoneNumberInput from "containers/setting/profile/PhoneNumberInput";
import SaveIcon from "../../../assets/icons/save_icon.svg";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import { customerProps } from "interfaces/configs";
import { useSnackbar, SnackbarKey, SnackbarMessage, OptionsObject } from "notistack";
import Radio from "src/components/Radio";
import MultiEmailAdd, { inputFieldType } from "src/components/MultiEmail/MultiEmailAdd";
import FileUploader from "src/components/upload";
import MultiUploader from "src/components/MultiFileUploader/index";
import { allCustomerValidation } from "validationSchemas/ContractorValidation";
import ResetTextField from "./ResetTextField";
import FullPageLoader from "src/components/FullPageLoader";
import DynamicSelectField from "containers/setting/profile/DynamicSelectField";
import "./form.style.scss";
import ModalLayout from "src/components/ModalLayout";
import ServiceForm from "../../services/ServiceForm";
import { serviceProps } from "interfaces/configs";
import { putApiData, postApiData, fetchApI, fetchInitialValues } from "./apiRequest";
import { useLocation } from "react-router-dom";
import { validateFieldTypeNames } from "src/components/MultiEmail/MultiEmailAdd";
import { IOSSwitch } from "src/components/switch/IosSwitch";
import { Stack } from "@mui/system";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CustomDrawer from "containers/Bookings/components/Drawer/CustomDrawer";

interface MyObject {
  [key: string]: string;
}

interface MenuOptions {
  id?: number;
  value?: number;
  label?: string;
  name?: string;
  updateCard?: any;
}

const CustomerForm: React.FC<{
  proceedToNextPage?: Function;
  data?: Object;
  isFormLoading?: boolean;
  setIsFormLoading?: Function;
  updateCard?: any;
  disabled?: boolean;
}> = ({ proceedToNextPage, data, isFormLoading, setIsFormLoading, updateCard, disabled }) => {
  const [open, setOpen] = useState(false);
  const [openMultiImage, setOpenMultiImage] = useState(false);
  const [countryData, setCountryData] = useState([]);
  const [countryPhoneData, setCountryPhoneData] = useState<any>([]);
  const [clearData, setClearData] = useState(false);

  // radio button initial value
  const RadioOptions = [
    { id: 1, value: "organization", label: "Organization" },
    { id: 2, value: "individual", label: "Individual" },
  ];
  // form initial values
  const initialContractorValues: customerProps = {
    customer_type: "",
    organization_name: "",
    organizations_email: [],
    // credit_limit: [
    //   {
    //     currency: '',
    //     amount: undefined,
    //   },
    // ],
    // balance_amount: [
    //   {
    //     currency: '',
    //     amount: undefined,
    //   },
    // ],
    operations_email: [],
    invoice_email: [],
    phone_numbers: [],
    website: "",
    business_since: null,

    country: undefined,
    currency: undefined,
    tax_percentage: undefined,
    tax_type: "",
    documents: [{ id: null, contractor: null, title: undefined, documents: [] }],
    notes: "",
    customer_address: undefined,
    phone: [{ code: "", phone: "" }],
    // local_set_pw: false,
    // confirm_password: '',
    // password: '',
    // can_set_pw: false,
    // login_email: '',
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

  const GetDatasAPi = async ({ customerId }: any) => {
    let promises = [
      fetchApI({
        setterFunction: setCountryPhoneData,
        url: "config/country",
        enqueueSnackbar,
        queryParam: `size=99`,
      }),
      fetchApI({
        setterFunction: setCountryData,
        url: "country/",
        enqueueSnackbar,
        queryParam: `size=99`,
      }),
    ];

    await Promise.all(promises);
  };

  // fetching data for both with and without ids
  const fetchData = async ({ customerId }: any) => {
    setIsFormLoading?.(true);
    await GetDatasAPi({ customerId });
    setIsFormLoading?.(false);
  };

  useEffect(() => {
    Number(nextPage) !== 2 && fetchData({ customerId: param?.customerId });
    if (nextPage) {
      proceedToNextPage?.(nextPage);
    }
  }, [param?.customerId, nextPage]);

  useEffect(() => {
    if (Object?.values(data || {})?.length) {
      setInitialValues(data || {});
    }
  }, [Object?.values(data || {})?.length]);

  const submitHandler = async (values: any, actions: any) => {
    if (param?.customerId) {
      await putApiData({
        // setterFunction: setSomeState,
        values,
        id: +param?.customerId,
        url: "customers",
        enqueueSnackbar: enqueueSnackbar,
        navigateTo: (id?: number) => navigate(`/customer/edit/${param?.customerId}?nextPage=2`),
        domain: "Customer",
        setterLoading: setIsFormLoading,
      });
    } else {
      await postApiData({
        // setterFunction: setSomeState,
        values,
        url: "/customers/",
        enqueueSnackbar: enqueueSnackbar,
        navigateTo: (id: number) => navigate(`/customer/edit/${id}?nextPage=2&add_address`),
        domain: "Customer",
        setterLoading: setIsFormLoading,
        routeKey: "customer_id",
      });
    }
  };

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <div>
          <Formik
            // key={key}
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values: customerProps, actions) => {
              if (disabled) return;
              let finalValue: any = {};
              let {
                phone,
                documents,
                invoice_email,
                operations_email,
                organizations_email,
                // credit_limit,
                // balance_amount,
                ...attr
              }: any = values;

              finalValue = { ...attr };
              // doing filter to remove unnecessary data that is null undefined from an array
              finalValue.organizations_email = organizations_email.filter(Boolean);
              finalValue.invoice_email = invoice_email.filter(Boolean);
              finalValue.operations_email = operations_email.filter(Boolean);
              finalValue.customer_type = values?.customer_type || "organization";
              finalValue.documents = [];
              // finalValue.credit_limit = credit_limit?.map((cr: any) => ({
              //   currency: cr?.code,
              //   amount: Number(cr?.data),
              // }))?.[0];
              // finalValue.balance_amount = balance_amount?.map((cr: any) => ({
              //   currency: cr?.code,
              //   amount: Number(cr?.data),
              // }))?.[0];
              finalValue.phone_numbers = phone
                ?.map((num: { code?: string; phone?: string }) =>
                  num?.code && num?.phone ? `${num?.code}/${num?.phone}` : undefined,
                )
                .filter(Boolean);

              // for files and documents
              if (documents?.length && documents[0].documents?.length) {
                finalValue.documents = documents[0]?.documents.map((doc: any) => {
                  return doc?.base64
                    ? `${doc?.formatedFileSize}--${doc?.name};${doc?.base64}`
                    : doc;
                });
              }

              submitHandler(finalValue, actions);
            }}
            validationSchema={allCustomerValidation}
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
                setFieldTouched,
                isSubmitting,
                initialTouched,
              } = props;

              let defaultCurrency = countryData
                ?.filter((item: any) => item.id === values.country)
                .map((item: any, index: number) => ({
                  value: item.id,
                  label: item.name,
                }));

              console.log({ values, errors });

              return (
                <>
                  {isFormLoading && <FullPageLoader />}
                  <>
                    <form onSubmit={handleSubmit} className="alert__form-fill">
                      <FieldArray name="customers">
                        {({ push, remove }: any) => (
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

                                {/* customer type*/}
                                <Grid container spacing={4} className="formGroupItem">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="customerType">
                                      <div className="label-heading  align__label">
                                        Customer Type <sup>*</sup>
                                      </div>
                                    </InputLabel>
                                  </Grid>

                                  <Grid item xs={7} className="align__radio">
                                    <Radio
                                      radioOption={RadioOptions}
                                      name="customer_type"
                                      id="customer_type"
                                      onChange={handleChange}
                                      defaultValue={
                                        values?.customer_type
                                          ? values?.customer_type
                                          : "organization"
                                      }
                                      value={
                                        values?.customer_type
                                          ? values?.customer_type
                                          : "organization"
                                      }
                                      disabled={disabled}
                                      className={disabled ? "disabled" : ""}
                                    />
                                  </Grid>
                                </Grid>

                                {/* organization name */}
                                <Grid container spacing={4} className="formGroupItem">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="fullName">
                                      <div className="label-heading  align__label">
                                        {values?.customer_type !== "individual"
                                          ? "Organization "
                                          : "Customer "}
                                        Name <sup>*</sup>
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
                                      disabled={disabled}
                                      className={disabled ? "disabled" : ""}
                                      fullWidth
                                      autoComplete="off"
                                      // disabled={disableEntireField}
                                      value={values?.organization_name || ""}
                                      error={
                                        errors?.organization_name && touched?.organization_name
                                          ? true
                                          : false
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />

                                    {errors?.organization_name && touched?.organization_name && (
                                      <div className="input-feedback" style={{ color: "red" }}>
                                        {errors?.organization_name}
                                      </div>
                                    )}
                                  </Grid>
                                </Grid>

                                {/* organization  email */}
                                <Grid container spacing={4} className="formGroupItem emial__group">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="emailId">
                                      <div className="label-heading  align__label">
                                        {values?.customer_type !== "individual"
                                          ? "Organization "
                                          : "Customer "}
                                        Email ID *
                                      </div>
                                    </InputLabel>
                                  </Grid>
                                  <Grid item xs={7} className="multiple_email_address_id">
                                    <MultiEmailAdd
                                      formikBag={props as any}
                                      name="organizations_email"
                                      clearData={clearData}
                                      setClearData={setClearData}
                                      disableAdd={disabled}
                                      isViewOnly={disabled || false}
                                    />
                                    {
                                      errors?.organizations_email &&
                                        touched?.organizations_email && (
                                          <div className="input-feedback" style={{ color: "red" }}>
                                            {errors?.organizations_email}
                                          </div>
                                        ) // end of error
                                    }
                                  </Grid>
                                </Grid>

                                {/* credit limit */}
                                {/* <Grid container spacing={4} className="formGroupItem">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="emailId">
                                      <div className="label-heading  align__label">
                                        Credit Limit
                                      </div>

                                      <Typography variant="body1" component="p">
                                        Credit limit the maximum amount to which the customer can
                                        create due.
                                      </Typography>
                                    </InputLabel>
                                  </Grid>
                                  <Grid item xs={7} className="multiple_email_address_id">
                                    <MultiEmailAdd
                                      formikBag={props as any}
                                      disableAdd={disabled}
                                      name="credit_limit"
                                      clearData={clearData}
                                      setClearData={setClearData}
                                      countryOptions={countryData?.map((data: any) => ({
                                        code: data?.currency,
                                        value: data?.currency,
                                      }))}
                                      isViewOnly={disabled || false}
                                      inputType={inputFieldType?.NORMAL_OPTION}
                                      validateFieldType={validateFieldTypeNames?.FLOAT}
                                    />
                                    {errors?.credit_limit && touched?.credit_limit && (
                                      <div className="input-feedback" style={{ color: 'red' }}>
                                        {errors?.credit_limit}
                                      </div>
                                    )}
                                  </Grid>
                                </Grid> */}

                                {/* balance amount */}
                                {/* <Grid container spacing={4} className="formGroupItem">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="emailId">
                                      <div className="label-heading  align__label">
                                        Balance Amount
                                      </div>

                                      <Typography variant="body1" component="p">
                                        The amount that has to be paid by the customer.
                                      </Typography>
                                    </InputLabel>
                                  </Grid>
                                  <Grid item xs={7} className="multiple_email_address_id">
                                    <MultiEmailAdd
                                      formikBag={props as any}
                                      isViewOnly={disabled || false}
                                      disableAdd={disabled}
                                      name="balance_amount"
                                      clearData={clearData}
                                      setClearData={setClearData}
                                      countryOptions={countryData?.map((data: any) => ({
                                        code: data?.currency,
                                        value: data?.currency,
                                      }))}
                                      inputType={inputFieldType?.NORMAL_OPTION}
                                      validateFieldType={validateFieldTypeNames?.FLOAT}
                                    />
                                    {errors?.balance_amount && touched?.balance_amount && (
                                      <div className="input-feedback" style={{ color: 'red' }}>
                                        {errors?.balance_amount}
                                      </div>
                                    )}
                                  </Grid>
                                </Grid> */}

                                {/* operations email */}
                                <Grid container spacing={4} className="formGroupItem">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="operationsEmailId">
                                      <div className="label-heading  align__label">
                                        Operations Email *
                                      </div>
                                      <Typography variant="body1" component="p">
                                        All the operations related mails will be sent to this email
                                        ID.
                                      </Typography>
                                    </InputLabel>
                                  </Grid>
                                  <Grid item xs={7} className="multiple_email_address_id">
                                    <MultiEmailAdd
                                      formikBag={props as any}
                                      isViewOnly={disabled || false}
                                      disableAdd={disabled}
                                      name="operations_email"
                                      clearData={clearData}
                                      setClearData={setClearData}
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
                                      <div className="label-heading  align__label">
                                        Invoice Email *
                                      </div>
                                      <Typography variant="body1" component="p">
                                        All the operations related mails will be sent to this email
                                        ID.
                                      </Typography>
                                    </InputLabel>
                                  </Grid>
                                  <Grid item xs={7} className="multiple_email_address_id">
                                    <MultiEmailAdd
                                      formikBag={props as any}
                                      isViewOnly={disabled || false}
                                      disableAdd={disabled}
                                      name="invoice_email"
                                      clearData={clearData}
                                      setClearData={setClearData}
                                    />
                                    {errors?.invoice_email && touched?.invoice_email && (
                                      <div className="input-feedback" style={{ color: "red" }}>
                                        {errors?.invoice_email}
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
                                      disableAdd={disabled}
                                      isViewOnly={disabled || false}
                                      addButtonClassName="add__more-group"
                                      className="group__fields"
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
                                      disabled={disabled}
                                      className={disabled ? "disabled" : ""}
                                      placeholder="Enter here"
                                      size="small"
                                      fullWidth
                                      value={values?.website || ""}
                                      error={errors?.website && touched?.website ? true : false}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />

                                    {errors?.website && touched?.website && (
                                      <div className="input-feedback" style={{ color: "red" }}>
                                        {errors?.website}
                                      </div>
                                    )}
                                  </Grid>
                                </Grid>

                                {/* business_since */}
                                <Grid container spacing={4} className="formGroupItem">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="business_since">
                                      <div className="label-heading  align__label">
                                        Business Since
                                      </div>
                                    </InputLabel>
                                  </Grid>

                                  <Grid item xs={7}>
                                    <Field
                                      as={OutlinedInput}
                                      name="business_since"
                                      id="business_since"
                                      data-testid="business_since"
                                      type="date"
                                      autoComplete="off"
                                      disabled={disabled}
                                      className={disabled ? "disabled" : ""}
                                      placeholder="Enter here"
                                      size="small"
                                      fullWidth
                                      value={values?.business_since || null}
                                      error={
                                        errors?.business_since && touched?.business_since
                                          ? true
                                          : false
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />

                                    {errors?.business_since && touched?.business_since && (
                                      <div className="input-feedback" style={{ color: "red" }}>
                                        {errors?.business_since}
                                      </div>
                                    )}
                                  </Grid>
                                </Grid>

                                {/* Business Invoice Type  */}
                                {/* <Grid container spacing={4} className="formGroupItem">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="business_invoice_type">
                                      <div className="label-heading  align__label">
                                        Business Invoice Type *
                                      </div>
                                    </InputLabel>
                                  </Grid>

                                  <Grid item xs={7}>
                                    <Select
                                      MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                      name="business_invoice_type"
                                      id="business_invoice_type"
                                      size="small"
                                      fullWidth
                                      data-testid="business_invoice_type"
                                      placeholder="Select here"
                                      autoComplete="off"
                                      disabled={disableEntireField}
                                      value={values?.business_invoice_type || ''}
                                      error={
                                        errors?.business_invoice_type &&
                                        touched?.business_invoice_type
                                          ? true
                                          : false
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}>
                                      {[
                                        { id: 1, name: 'Monthly' },
                                        { id: 2, name: 'Yearly' },
                                        { id: 2, name: 'Weekly' },
                                      ]?.map((item: any, index: number) => (
                                        <MenuItem key={index} value={item.id}>
                                          {item.name}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                    {errors?.business_invoice_type &&
                                      touched?.business_invoice_type && (
                                        <div className="input-feedback" style={{ color: 'red' }}>
                                          {errors?.business_invoice_type}
                                        </div>
                                      )}
                                  </Grid>
                                </Grid> */}

                                {/* country */}
                                <Grid container spacing={4} className="formGroupItem">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="country">
                                      <div className="label-heading  align__label">
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
                                      placeholder="Select here"
                                      data-testid="country"
                                      autoComplete="off"
                                      disabled={disabled}
                                      className={disabled ? "disabled" : ""}
                                      value={values?.country || ""}
                                      error={errors?.country && touched?.country ? true : false}
                                      onChange={(e) => {
                                        const countryId = e.target?.value;
                                        const data: any = countryData?.find(
                                          (data: any) => Number(data?.id) === Number(countryId),
                                        );
                                        handleChange(e);
                                        setFieldValue(
                                          "tax_percentage",
                                          data?.tax_percentage?.toString(),
                                        );
                                        setFieldValue("tax_type", data?.tax_type);
                                        setFieldValue("currency", countryId);
                                      }}
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

                                {/* currency */}
                                <Grid container spacing={4} className="formGroupItem">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="currency">
                                      <div className="label-heading  align__label">
                                        Currency <sup>*</sup>
                                      </div>
                                    </InputLabel>
                                  </Grid>

                                  <Grid item xs={7}>
                                    <Select
                                      MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                      name="currency"
                                      id="currency"
                                      size="small"
                                      fullWidth
                                      placeholder="Select here"
                                      data-testid="currency"
                                      autoComplete="off"
                                      disabled={disabled}
                                      className={disabled ? "disabled" : ""}
                                      value={Number(values.country)}
                                      error={errors?.currency && touched?.currency ? true : false}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    >
                                      {countryData
                                        ?.filter((item: any) => item.id === values.country)
                                        .map((item: any, index: number) => (
                                          <MenuItem key={index} value={item.id}>
                                            {item?.currency}
                                          </MenuItem>
                                        ))}
                                    </Select>
                                    {errors?.currency && touched?.currency && (
                                      <div className="input-feedback" style={{ color: "red" }}>
                                        {errors?.currency}
                                      </div>
                                    )}
                                  </Grid>
                                </Grid>

                                {/* tax percentage */}
                                <Grid container spacing={4} className="formGroupItem">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="currency">
                                      <div className="label-heading  align__label">
                                        Tax Percentage
                                      </div>
                                    </InputLabel>
                                  </Grid>

                                  <Grid item xs={7}>
                                    <Field
                                      as={OutlinedInput}
                                      name="tax_percentage"
                                      id="tax_percentage"
                                      data-testid="tax_percentage"
                                      type="text"
                                      autoComplete="off"
                                      disabled={
                                        disabled
                                          ? true
                                          : !values?.country
                                          ? true
                                          : Number(values?.tax_percentage) >= 0
                                          ? true
                                          : false
                                      }
                                      className={
                                        !values?.country
                                          ? "disabled"
                                          : Number(values?.tax_percentage) >= 0
                                          ? "disabled"
                                          : ""
                                      }
                                      placeholder="Enter here"
                                      size="small"
                                      fullWidth
                                      value={values?.tax_percentage || ""}
                                      error={
                                        errors?.tax_percentage && touched?.tax_percentage
                                          ? true
                                          : false
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />

                                    {errors?.tax_percentage && touched?.tax_percentage && (
                                      <div className="input-feedback" style={{ color: "red" }}>
                                        {errors?.tax_percentage}
                                      </div>
                                    )}
                                  </Grid>
                                </Grid>

                                {/* tax type  */}
                                <Grid container spacing={4} className="formGroupItem">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="tax_type">
                                      <div className="label-heading  align__label">Tax Type</div>
                                    </InputLabel>
                                  </Grid>

                                  <Grid item xs={7}>
                                    <Field
                                      as={OutlinedInput}
                                      name="tax_type"
                                      id="tax_type"
                                      data-testid="tax_type"
                                      type="text"
                                      autoComplete="off"
                                      disabled={
                                        disabled
                                          ? true
                                          : !values?.country
                                          ? true
                                          : values?.tax_type
                                          ? true
                                          : false
                                      }
                                      className={
                                        !values?.country
                                          ? "disabled"
                                          : values?.tax_type
                                          ? "disabled"
                                          : ""
                                      }
                                      placeholder="Enter here"
                                      size="small"
                                      fullWidth
                                      value={values?.tax_type || ""}
                                      error={errors?.tax_type && touched?.tax_type ? true : false}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />

                                    {errors?.tax_type && touched?.tax_type && (
                                      <div className="input-feedback" style={{ color: "red" }}>
                                        {errors?.tax_type}
                                      </div>
                                    )}
                                  </Grid>
                                </Grid>
                              </Box>
                            </div>

                            {/* {values.customers?.map((customer: any, index: number) => (
                              <div
                                className="customer_creation_form"
                                key={index}
                                style={{ marginTop: '20px' }}>
                                <Typography variant="h3" color="primary">
                                  Customer {index + 1}
                                </Typography>
                                <Typography variant="body1" component="p">
                                  Create a Email ID and password (if required) for the customers to
                                  login to their platform
                                </Typography>
                                <Divider variant="middle" style={{ margin: '10px 0' }} />

                                {values?.customers?.length > 1 ? (
                                  <div
                                    style={{
                                      float: 'right',
                                      marginTop: '30px',
                                    }}
                                    onClick={() => {
                                      remove(index);
                                    }}>
                                    <IconButton>
                                      <CancelOutlinedIcon
                                        sx={{
                                          fill: '#C1C6D4',
                                          '&:hover': {
                                            fill: '#FF0000',
                                            cursor: 'pointer',
                                          },
                                        }}></CancelOutlinedIcon>
                                    </IconButton>
                                  </div>
                                ) : null}

                                <div
                                  className="tenant-page-container"
                                  style={{
                                    margin: '40px 0',
                                    backgroundColor: '#ffffff',
                                    borderRadius: '8px',
                                    padding: '10px 24px',
                                  }}>
                                  <Box
                                    borderTop={'none'}
                                    className="setting-form-group"
                                    sx={{
                                      width: '90%',
                                      marginTop: '0',
                                      padding: 0,
                                    }}>
                                    <Grid
                                      container
                                      spacing={4}
                                      className="formGroupItem"
                                      sx={{ marginTop: '0' }}>
                                      <Grid item xs={5}>
                                        <InputLabel htmlFor="notes">
                                          <div className="label-heading  align__label">
                                            Customer Login Email ID *
                                          </div>
                                        </InputLabel>
                                      </Grid>

                                      <Grid item xs={6}>
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
                                          value={customer?.login_email || null}
                                          error={
                                            errors?.login_email && touched?.login_email
                                              ? true
                                              : false
                                          }
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                        />

                                        {errors?.login_email && touched?.login_email && (
                                          <div className="input-feedback" style={{ color: 'red' }}>
                                            {errors?.login_email}
                                          </div>
                                        )}
                                      </Grid>

                                      <Grid item xs={5}>
                                        <InputLabel htmlFor="inspection_type">
                                          <div className="label-heading">
                                            Allow users to set their own password
                                          </div>
                                          <Typography variant="body1" component="p">
                                            Instructions on how to set a password will be sent to
                                            the user on invite
                                          </Typography>
                                        </InputLabel>
                                      </Grid>

                                      <Grid item xs={6}>
                                        <IOSSwitch
                                          checked={customer?.can_set_pw ? true : false}
                                          onChange={(e: any) => {
                                            setFieldValue(
                                              `customers.${index}.can_set_pw`,
                                              e.target.checked,
                                            );
                                          }}
                                          name={`customers.${index}.can_set_pw`}
                                          inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                      </Grid>

                                      <Grid item xs={5}>
                                        <InputLabel htmlFor="local_set_pw">
                                          <div className="label-heading">
                                            Set password for this user
                                          </div>
                                          <Typography variant="body1" component="p">
                                            Create a password for this user with all the password
                                            requirements
                                          </Typography>
                                        </InputLabel>
                                      </Grid>

                                      <Grid item xs={6}>
                                        <FormGroup className="input-holder">
                                          <IOSSwitch
                                            checked={customer?.local_set_pw ? true : false}
                                            onChange={(e: any) => {
                                              setFieldValue(
                                                `customers.${index}.local_set_pw`,
                                                e.target.checked,
                                              );
                                            }}
                                            name={`customers.${index}.local_set_pw`}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                          />
                                        </FormGroup>
                                      </Grid>
                                    </Grid>

                                    {customer?.local_set_pw && (
                                      <Box
                                        component="form"
                                        autoComplete="off"
                                        sx={{
                                          width: '100%',
                                          border: '1px solid #EAECF0',
                                          boxShadow:
                                            '0px 7px 30px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)',
                                          borderRadius: '12px',
                                        }}
                                        className="passwordContainerBox">
                                        <Stack direction="column" sx={{ p: 2 }}>

                                          <Stack direction="row" spacing={1}>
                                            <Box
                                              sx={{
                                                fontSize: '15px',
                                                color: '#384874',
                                                fontWeight: 500,
                                              }}>
                                              Set a Password to the user
                                            </Box>
                                            <Chip size="small" label="Security" />
                                          </Stack>
                                          <Box
                                            sx={{
                                              color: '#475467',
                                              fontSize: '12px',
                                              fontWeight: '300',
                                              mt: 1,
                                            }}>
                                            A password would be set along with the details above for
                                            signing up
                                          </Box>

                                          <Stack direction="column" sx={{ mt: 2.5 }}>
                                            <Stack direction="row" spacing={1.5}>
                                              <Box sx={{ width: '100%' }}>
                                                <Box sx={{ fontSize: '13px' }}>New Password</Box>
                                                <Box>
                                                  <Field
                                                    as={OutlinedInput}
                                                    size="small"
                                                    id={`customers.${index}.password`}
                                                    name={`customers.${index}.password`}
                                                    type="password"
                                                    fullWidth
                                                    sx={{ marginTop: '5px' }}
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
                                                  />
                                                  <Box>
                                                    {errors?.password && touched?.password && (
                                                      <FormHelperText style={{ color: 'red' }}>
                                                        {errors?.password}
                                                      </FormHelperText>
                                                    )}
                                                  </Box>
                                                </Box>
                                              </Box>
                                              <Box sx={{ width: '100%' }}>
                                                <Box sx={{ fontSize: '13px' }}>
                                                  Confirm New Password
                                                </Box>
                                                <Box>
                                                  <Field
                                                    as={OutlinedInput}
                                                    size="small"
                                                    id={`customers.${index}.confirm_password`}
                                                    name={`customers.${index}.confirm_password`}
                                                    type="password"
                                                    fullWidth
                                                    sx={{ marginTop: '5px' }}
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
                                                  />
                                                  <Box>
                                                    {errors?.confirm_password &&
                                                      touched?.confirm_password && (
                                                        <FormHelperText style={{ color: 'red' }}>
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
                                    )}
                                  </Box>
                                </div>

                                {!!(values?.customers?.length - 1 === index) && (
                                  <Button
                                    onClick={() => {
                                      push({
                                        local_set_pw: false,
                                        confirm_password: '',
                                        can_set_pw: false,
                                        login_email: '',
                                        password: '',
                                      });
                                    }}
                                    startIcon={<img alt="" src="/assets/icons/plus.svg" />}
                                    className="link-icon">
                                    Add Another Customer
                                  </Button>
                                )}
                              </div>
                            ))} */}

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
                                        Add Documents
                                      </div>
                                      <Typography variant="body1" component="p">
                                        All documents that are related to the contractors like
                                        agreements bills etc.
                                      </Typography>
                                    </InputLabel>
                                  </Grid>
                                  {/* file uploader */}
                                  <Grid item xs={7}>
                                    <MultiUploader
                                      setOpenMultiImage={setOpenMultiImage}
                                      openMultiImage={openMultiImage}
                                      getFileData={(
                                        files: [{ documents: any[]; title: string }],
                                      ) => {
                                        // here you get the selected files do what you want to accordingly
                                        setFieldValue(
                                          "documents",
                                          Array.isArray(files) ? files : [files],
                                        );
                                      }}
                                      initialData={values?.documents || []}
                                      clearData={clearData}
                                      setClearData={setClearData}
                                      accept={{
                                        "image/jpeg": [".jpeg", ".jpg"],
                                        "image/png": [".png"],
                                        "application/pdf": [".pdf"],
                                      }}
                                      requireDescription={false}
                                      maxFileSize={2}
                                      disabled={disabled}
                                    />
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
                                      {/* <ResetTextField
                                        fullWidth
                                        multiline
                                        placeholder="Type any message that has to be passed on."
                                        className="text-area-service"
                                        id="notes"
                                        size="small"
                                        name="notes"
                                        variant="outlined"
                                        clearData={clearData}
                                        setClearData={setClearData}
                                        value={values?.notes || ''}
                                        onChange={(ev: any) => {
                                          setFieldValue('notes', ev.target.value);
                                          setFieldTouched('notes');
                                        }}
                                      /> */}

                                      <TextareaAutosize
                                        placeholder="Type any message that has to be passed on."
                                        minRows={2}
                                        id="notes"
                                        onChange={(ev) => {
                                          setFieldValue("notes", ev.target.value);
                                          setFieldTouched("notes");
                                        }}
                                        className={`text-area-service text__area-style  ${
                                          disabled ? "disabled" : ""
                                        }`}
                                        name="notes"
                                        value={values.notes}
                                        onBlur={handleBlur}
                                        disabled={disabled}
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
                          </>
                        )}
                      </FieldArray>

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
                            {/* <Button
                            variant="outlined"
                            type="button"
                            onClick={() => {
                              props.resetForm();
                              props.setValues(props.initialValues);
                              props.setTouched({});
                              setClearData(true);
                              setInitialValues(initialContractorValues);
                            }}
                            sx={{ mr: 1 }}>
                            Clear All
                          </Button> */}
                            <Button
                              type="submit"
                              variant="contained"
                              // disabled={isSubmitting ? true : false}
                              // isSubmitting={isSubmitting}
                              onClick={() => {
                                setInitialValues(values);
                              }}
                              sx={{ mr: 1 }}
                            >
                              {param?.customerId ? "Update" : "Save"} & Proceed
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

export default CustomerForm;
