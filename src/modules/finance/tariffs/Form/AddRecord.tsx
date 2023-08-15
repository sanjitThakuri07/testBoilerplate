import React, { ChangeEvent, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  Alert,
  Button,
  Checkbox,
  CircularProgress,
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
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Formik, FormikProps, Field, ErrorMessage, FieldArray, getIn } from "formik";
import * as Yup from "yup";
import ProfilePicture from "src/modules/setting/profile/ProfilePicture";
import { useNavigate, useParams } from "react-router-dom";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import { useSnackbar, SnackbarKey, SnackbarMessage, OptionsObject } from "notistack";
import MultiEmailAdd, {
  inputFieldType,
  validateFieldTypeNames,
} from "src/components/MultiEmail/MultiEmailAdd";
import { RecordValidationSchema } from "src/validationSchemas/ContractorValidation";
import ResetTextField from "./ResetTextField";
import FullPageLoader from "src/components/FullPageLoader";
import DynamicSelectField from "src/modules/setting/profile/DynamicSelectField";
import "./form.style.scss";
import ModalLayout from "src/components/ModalLayout";
import ServiceForm from "../../services/ServiceForm";
import { serviceProps } from "src/interfaces/configs";
import {
  putApiData,
  postApiData,
  fetchApI,
  fetchIndividualApi,
} from "src/modules/apiRequest/apiRequest";
import { useLocation } from "react-router-dom";
import { usePathUrlSettor } from "src/store/zustand/globalStates/config";
import CustomerForm from "src/modules/customers/customer/Form/CustomerForm";
import { allRoutes } from "src/routers/routingsUrl";
import NewCustomMultiSelect from "src/components/NewCustomMultiSelect/NewCustomMultiSelect";
import { PrivateRoute } from "src/constants/variables";
import { Link } from "react-router-dom";

interface rateProps {
  rate_type?: number | null;
  rate?: number | null;
}

interface Value {
  billing_agreement_type: "";
  inspection: string[];
  currency: string;
  location: string[];
  status: string;
  notes: string;
  rates: rateProps[];
}

interface FormValues {
  address: Value[];
  // Make sure to define the array type
  // other form values
}

interface ObjectHandler {
  object: {
    [key: string]: any;
  };
  deleteKey: number;
  setterFunction?: Function;
  reOrder?: boolean;
}

interface ObjectFilter {
  id: string;
  wholeData?: any;
  name: string;
  setterFunction?: Function;
  place?: number;
}

const AddTariffs: React.FC<{
  proceedToNextPage?: Function;
  individualData?: any;
  isFormLoading?: boolean;
  setIsFormLoading?: Function;
  parentData?: any;
}> = ({ proceedToNextPage, individualData, parentData }) => {
  const [customerData, setCustomerData] = useState([]);
  const [clearData, setClearData] = useState(false);
  const [open, setOpen] = useState(false);
  const [countryData, setCountryData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [inspectionData, setInspectionData] = useState([]);
  const [billingAgreementData, setBillingAgreementData] = useState([]);
  const [rateTypeData, setRateTypeData] = useState([]);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const param = useParams();
  // form initial values
  let initialData = Object.keys(individualData[0] || {})?.length
    ? individualData
    : [
        {
          billing_agreement_type: "",
          inspection: [],
          currency: parentData?.currency,
          location: [],
          status: "Active",
          notes: "",
          rates: [{}],
        },
      ];

  const initialValue: FormValues = {
    address: initialData,
  };

  const [initialValues, setInitialValues] = useState(initialValue);

  useEffect(() => {
    setInitialValues(initialValue);
  }, [parentData]);

  const [isFormLoading, setIsFormLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [disableEntireField, setDisableEntireField] = useState(false);
  const { routes, setCustomRoutes } = usePathUrlSettor();

  // Get the current location object
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchObject = Object.fromEntries(searchParams.entries());

  // Get the value of the addressId
  const addressId = new URLSearchParams(location.search).get("address");

  const submitHandler = async (values: any, actions: any) => {
    // setIsFormLoading?.(true);
    const arr = [...values];
    const result = arr?.map((obj: any) => {
      const validRates = obj?.rates?.filter(
        (rate: any) => rate?.rate_type !== "" && rate?.rate !== "",
      );
      return {
        ...obj,
        rates: validRates,
      };
    });
    if (param?.tariffId) {
      (await putApiData({
        // setterFunction: setSomeState,
        values: result?.[0],
        id: +param?.tariffId,
        url: `${routes?.backendUrl?.(param?.tariffId)}`,
        enqueueSnackbar: enqueueSnackbar,
        // navigateTo: (id: number) => navigate(`/config/contractors/all-contractors/`),
        domain: "Tariff",
        setterLoading: setIsFormLoading,
      })) && navigate(`/finance/tariffs?tariff=${searchObject["tariff"]}`);
    } else {
      (await postApiData({
        // setterFunction: setSomeState,
        values: result,
        url: `/${routes?.backendUrl(searchObject[`tariff`])}`,
        enqueueSnackbar: enqueueSnackbar,
        navigateTo: () => navigate(`/finance/tariffs?tariff=${searchObject["tariff"]}`),
        domain: "Record",
        setterLoading: setIsFormLoading,
      })) && navigate(`/finance/tariffs?tariff=${searchObject["tariff"]}`);
    }
  };

  //   fetching getapi
  const GetDatasAPi = async ({ tariffId }: any) => {
    let promises = [
      fetchApI({
        setterFunction: setCountryData,
        url: "country/",
        enqueueSnackbar,
        queryParam: `size=99`,
      }),
      fetchApI({
        setterFunction: (data: any) => {
          let transformData = data?.map((location: any) => ({
            id: location?.id,
            name: location?.location,
            label: location?.location,
          }));
          setLocationData(transformData);
        },
        url: "location/",
        enqueueSnackbar,
        queryParam: `size=99`,
      }),
      fetchApI({
        setterFunction: (data: any) => {
          let transformData = data?.map((inspection: any) => ({
            id: inspection?.id,
            name: inspection?.name,
            label: inspection?.name,
          }));
          setInspectionData(transformData);
        },
        url: "inspection-name/",
        enqueueSnackbar,
        queryParam: `size=99`,
      }),
      // fetchApI({
      //   setterFunction: (data: any) => {
      //     let transformData = data?.map((bill: any) => ({
      //       id: bill?.id,
      //       name: bill?.name,
      //       label: bill?.name,
      //     }));
      //     setBillingAgreementData(transformData);
      //   },
      //   url: 'billing-agreement-names/',
      //   enqueueSnackbar,
      //   queryParam: `size=99`,
      // }),
      fetchApI({
        setterFunction: (data: any) => {
          let transformData = data?.map((rateType: any) => ({
            id: rateType?.id,
            name: rateType?.name,
            label: rateType?.name,
          }));
          setRateTypeData(transformData);
        },
        url: "tariff-rate-types/",
        enqueueSnackbar,
        queryParam: `size=99`,
      }),
    ];

    await Promise.all(promises);
  };

  const FetchNewDatas = async () => {
    let promises = [
      fetchApI({
        setterFunction: (data: any) => {
          let transformData = data?.map((location: any) => ({
            id: location?.id,
            name: location?.location,
            label: location?.location,
          }));
          setLocationData(transformData);
        },
        url: "location/",
        enqueueSnackbar,
        queryParam: `size=99`,
      }),
      fetchApI({
        setterFunction: (data: any) => {
          let transformData = data?.map((inspection: any) => ({
            id: inspection?.id,
            name: inspection?.name,
            label: inspection?.name,
          }));
          setInspectionData(transformData);
        },
        url: "inspection-name/",
        enqueueSnackbar,
        queryParam: `size=99`,
      }),

      fetchApI({
        setterFunction: (data: any) => {
          let transformData = data?.map((rateType: any) => ({
            id: rateType?.id,
            name: rateType?.name,
            label: rateType?.name,
          }));
          setRateTypeData(transformData);
        },
        url: "tariff-rate-types/",
        enqueueSnackbar,
        queryParam: `size=99`,
      }),
    ];

    await Promise.all(promises);
  };

  // fetching data for both with and without ids
  const fetchData = async ({ tariffId }: any) => {
    setIsFormLoading?.(true);
    await GetDatasAPi({ tariffId });
    setIsFormLoading?.(false);
  };

  useEffect(() => {
    fetchData({ tariffId: param?.tariffId });
  }, []);

  useEffect(() => {
    if (Object?.keys(individualData[0] || {})?.length) {
      setInitialValues({ address: individualData });
    }
  }, [Object?.keys(individualData[0] || {})?.length, individualData]);

  //   rate input field
  const RateInputField = ({
    parentIndex,
    selfIndex,
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    formikProps,
  }: any) => {
    // const selectedRates = (values?.address[`${parentIndex}`].rates || [])
    //   ?.filter((rate: any) => Boolean(rate?.rate_type))
    //   ?.map((rateType: any) => rateType?.rate_type);
    const selectedRatesCollection = values?.address[`${parentIndex}`]?.rates?.reduce(
      (acc: any, curr: any) => {
        acc[selfIndex] = rateTypeData;
        return acc;
      },
      {},
    );

    // const options = [...rateTypeData]?.filter((rate: any) => !selectedRates?.includes(rate?.id));
    return (
      <div style={{ position: "relative" }} className={"rate__field-block"}>
        <Grid container spacing={4} className="formGroupItem">
          <Grid item xs={4}>
            <InputLabel htmlFor={`address.${parentIndex}.rates.${selfIndex}.rate_type`}>
              <div className="label-heading  align__label">Rate Type</div>
            </InputLabel>
          </Grid>

          <Grid item xs={7}>
            <div className="email__container">
              <Select
                MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                name={`address.${parentIndex}.rates.${selfIndex}.rate_type`}
                id={`address.${parentIndex}.rates.${selfIndex}.rate_type`}
                size="small"
                fullWidth
                data-testid={`address.${parentIndex}.rates.${selfIndex}.rate_type`}
                placeholder="Select here"
                autoComplete="off"
                disabled={disableEntireField}
                value={
                  values?.address[`${parentIndex}`].rates[`${selfIndex}`] &&
                  values?.address[`${parentIndex}`].rates[`${selfIndex}`]?.rate_type
                }
                error={
                  getIn(errors, `address.${parentIndex}.rates.${selfIndex}.rate_type`) &&
                  getIn(touched, `address.${parentIndex}.rates.${selfIndex}.rate_type`)
                    ? true
                    : false
                }
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {rateTypeData?.map((item: any, index: number) => (
                  <MenuItem key={index} value={item.id}>
                    {item?.name}
                  </MenuItem>
                ))}
              </Select>

              <Link
                style={{ cursor: "pointer" }}
                to={`/config/finance/tariff-rate-types/add`}
                target="__blank"
                onClick={() => {
                  setMessage("Please click on the reload button to fetch the currently added data");
                }}
              >
                <img alt="" src="src/assets/icons/plus.svg" />
              </Link>
              {/* <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  navigate('/config/finance/tariff-rate-types');
                }}>
                <img alt="" src="src/assets/icons/plus.svg" />
              </div> */}
            </div>

            {getIn(errors, `address.${parentIndex}.rates.${selfIndex}.rate_type`) &&
              getIn(touched, `address.${parentIndex}.rates.${selfIndex}.rate_type`) && (
                <div className="input-feedback" style={{ color: "red" }}>
                  {getIn(errors, `address.${parentIndex}.rates.${selfIndex}.rate_type`)}
                </div>
              )}
          </Grid>
        </Grid>
        <Grid container spacing={4} className="formGroupItem">
          <Grid item xs={4}>
            <InputLabel htmlFor={`address.${parentIndex}.rates.${selfIndex}.rate`}>
              <div className="label-heading  align__label">Rate</div>
            </InputLabel>
          </Grid>

          <Grid item xs={7}>
            <MultiEmailAdd
              formikBag={formikProps as any}
              isViewOnly={disableEntireField}
              name={`address.${parentIndex}.rates.${selfIndex}.rate`}
              clearData={clearData}
              setClearData={setClearData}
              countryOptions={[]}
              inputType={inputFieldType?.NORMAL}
              disableAdd={true}
              validateFieldType={validateFieldTypeNames?.FLOAT}
              returnType={"single"}
            />
            {errors?.[`address.${parentIndex}.rates.${selfIndex}.rate`] &&
              touched?.[`address.${parentIndex}.rates.${selfIndex}.rate`] && (
                <div className="input-feedback" style={{ color: "red" }}>
                  {errors?.[`address.${parentIndex}.rates.${selfIndex}.rate`]}
                </div>
              )}
          </Grid>
        </Grid>
      </div>
    );
  };

  //   cancel/ delete button for rate input field
  const cancelButton = ({ deleteFnk, deleteId, iconStyle }: any) => {
    return (
      <div onClick={() => deleteFnk(deleteId)} style={iconStyle}>
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
    );
  };

  return (
    <div>
      {" "}
      {message && (
        <Alert
          severity="success"
          sx={{ display: "grid", gridTemplateColumns: "30px 1fr", alignItems: "center" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "14px" }}>{message}</span>

            <Button
              type="button"
              variant="contained"
              onClick={async () => {
                await FetchNewDatas();
              }}
            >
              Reload Fields
            </Button>
          </div>
        </Alert>
      )}
      <Formik
        // key={key}
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={async (values: FormValues, actions) => {
          const finalValue = values?.address?.map((v) => ({
            ...v,
          }));

          submitHandler(finalValue, actions);
        }}
        validationSchema={RecordValidationSchema}
      >
        {(props: FormikProps<FormValues>) => {
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
                <form>
                  <FieldArray name="address">
                    {({ push, remove }: any) => (
                      <>
                        {values?.address?.map((address: any, index: number) => {
                          return (
                            <>
                              <div
                                className="tenant-page-container"
                                key={index}
                                style={{
                                  margin: "40px auto",
                                  backgroundColor: "#ffffff",
                                  borderRadius: "8px",
                                  padding: "10px 24px",
                                  position: "relative",
                                }}
                              >
                                {values?.address?.length > 1 && (
                                  <div
                                    onClick={() => {
                                      remove(index);
                                    }}
                                    style={{
                                      position: "absolute",
                                      right: "14px",
                                      top: "12px",
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
                                )}
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
                                  {/* billing agreegment type */}
                                  <Grid container spacing={4} className="formGroupItem">
                                    {/* <Grid item xs={4}>
                                      <InputLabel
                                        htmlFor={`address.${index}.billing_agreement_type`}>
                                        <div className="label-heading  align__label">
                                          Billing Agreement type <sup>*</sup>
                                        </div>
                                      </InputLabel>
                                    </Grid> */}

                                    {/* <Grid item xs={7}>
                                      <Select
                                        MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                        id={`address.${index}.billing_agreement_type`}
                                        name={`address.${index}.billing_agreement_type`}
                                        size="small"
                                        fullWidth
                                        placeholder="Select here"
                                        data-testid="billing_agreement_type"
                                        autoComplete="off"
                                        disabled={disableEntireField}
                                        value={
                                          (values?.address[`${index}`] &&
                                            values?.address[`${index}`]?.billing_agreement_type) ||
                                          ''
                                        }
                                        error={
                                          getIn(
                                            errors,
                                            `address.${index}.billing_agreement_type`,
                                          ) &&
                                          getIn(touched, `address.${index}.billing_agreement_type`)
                                            ? true
                                            : false
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}>
                                        {billingAgreementData?.map((item: any, index: number) => (
                                          <MenuItem key={index} value={item.id}>
                                            {item?.name}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                      {getIn(errors, `address.${index}.billing_agreement_type`) &&
                                        getIn(
                                          touched,
                                          `address.${index}.billing_agreement_type`,
                                        ) && (
                                          <div className="input-feedback" style={{ color: 'red' }}>
                                            {getIn(
                                              errors,
                                              `address.${index}.billing_agreement_type`,
                                            )}
                                          </div>
                                        )}
                                    </Grid> */}
                                  </Grid>

                                  {/* Inspection  */}
                                  <Grid container spacing={4} className="formGroupItem">
                                    <Grid item xs={4}>
                                      <InputLabel htmlFor={`address.${index}.inspection`}>
                                        <div className="label-heading  align__label">
                                          Inspection <sup>*</sup>
                                        </div>
                                      </InputLabel>
                                    </Grid>

                                    <Grid item xs={7}>
                                      <div className="email__container">
                                        <Select
                                          MenuProps={{
                                            PaperProps: {
                                              style: { maxHeight: 200 },
                                            },
                                          }}
                                          id={`address.${index}.inspection`}
                                          name={`address.${index}.inspection`}
                                          size="small"
                                          fullWidth
                                          placeholder="Select here"
                                          data-testid="inspection"
                                          autoComplete="off"
                                          disabled={disableEntireField}
                                          value={
                                            (values?.address[`${index}`] &&
                                              values?.address[`${index}`]?.inspection) || [""]
                                          }
                                          error={
                                            getIn(errors, `address.${index}.inspection`) &&
                                            getIn(touched, `address.${index}.inspection`)
                                              ? true
                                              : false
                                          }
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                        >
                                          {inspectionData?.map((item: any, index: number) => (
                                            <MenuItem key={index} value={item.id}>
                                              {item?.label}
                                            </MenuItem>
                                          ))}
                                        </Select>

                                        <Link
                                          style={{ cursor: "pointer" }}
                                          to={
                                            PrivateRoute.configuration.inspection_type
                                              .inspection_name.ADD
                                          }
                                          target="__blank"
                                          onClick={() => {
                                            // navigate(
                                            //   PrivateRoute.configuration.inspection_type
                                            //     .inspection_name.ADD,
                                            // );
                                            setMessage(
                                              "Please click on the reload button to fetch the currently added data",
                                            );
                                          }}
                                        >
                                          <img alt="" src="src/assets/icons/plus.svg" />
                                        </Link>
                                      </div>

                                      {getIn(errors, `address.${index}.inspection`) &&
                                        getIn(touched, `address.${index}.inspection`) && (
                                          <div className="input-feedback" style={{ color: "red" }}>
                                            {getIn(errors, `address.${index}.inspection`)}
                                          </div>
                                        )}
                                    </Grid>
                                  </Grid>

                                  {/* location */}
                                  <Grid container spacing={4} className="formGroupItem">
                                    <Grid item xs={4}>
                                      <InputLabel htmlFor={`address.${index}.location`}>
                                        <div className="label-heading  align__label">
                                          Location <sup>*</sup>
                                        </div>
                                      </InputLabel>
                                    </Grid>

                                    <Grid item xs={7}>
                                      {/* <Select
                                        MenuProps={{
                                          PaperProps: {
                                            style: { maxHeight: 200 },
                                          },
                                        }}
                                        name={`address.${index}.location`}
                                        multiple
                                        id="location"
                                        size="small"
                                        fullWidth
                                        data-testid="location"
                                        placeholder="Select here"
                                        autoComplete="off"
                                        disabled={disableEntireField}
                                        value={
                                          (values?.address[`${index}`] &&
                                            values?.address[`${index}`]?.location) || ['']
                                        }
                                        error={
                                          getIn(errors, `address.${index}.location`) &&
                                          getIn(touched, `address.${index}.location`)
                                            ? true
                                            : false
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}>
                                        {locationData?.map((item: any, index: number) => (
                                          <MenuItem key={index} value={item.id}>
                                            {item?.label}
                                          </MenuItem>
                                        ))}
                                      </Select> */}
                                      <div className="email__container">
                                        <NewCustomMultiSelect
                                          selected={
                                            (values?.address[`${index}`] &&
                                              values?.address[`${index}`]?.location) || [""]
                                          }
                                          setSelected={(data: any) => {
                                            setFieldValue(`address.${index}.location`, data);
                                          }}
                                          menuOptions={locationData || []}
                                          labelKey={"label"}
                                          valueKey={"id"}
                                          menuLabel="Select all"
                                        />

                                        <Link
                                          style={{ cursor: "pointer" }}
                                          to={
                                            PrivateRoute.configuration.general_settings.LOCATION
                                              .HOME
                                          }
                                          target="__blank"
                                          onClick={() => {
                                            setMessage(
                                              "Please click on the reload button to fetch the currently added data",
                                            );
                                          }}
                                        >
                                          <img alt="" src="src/assets/icons/plus.svg" />
                                        </Link>
                                      </div>

                                      {getIn(errors, `address.${index}.location`) &&
                                        getIn(touched, `address.${index}.location`) && (
                                          <div className="input-feedback" style={{ color: "red" }}>
                                            {getIn(errors, `address.${index}.location`)}
                                          </div>
                                        )}
                                    </Grid>
                                  </Grid>
                                  <Grid container spacing={4} className="formGroupItem">
                                    <Grid item xs={4}>
                                      <InputLabel htmlFor={`address.${index}.location`}>
                                        <div className="label-heading  align__label">
                                          Currency <sup>*</sup>
                                        </div>
                                      </InputLabel>
                                    </Grid>

                                    <Grid item xs={7}>
                                      <Select
                                        MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                        id={`address.${index}.currency`}
                                        name={`address.${index}.currency`}
                                        size="small"
                                        fullWidth
                                        placeholder="Select here"
                                        data-testid="currency"
                                        autoComplete="off"
                                        // disabled={true}
                                        value={
                                          (values?.address[`${index}`] &&
                                            values?.address[`${index}`]?.currency) ||
                                          parentData?.currency ||
                                          ""
                                        }
                                        error={
                                          getIn(errors, `address.${index}.currency`) &&
                                          getIn(touched, `address.${index}.currency`)
                                            ? true
                                            : false
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      >
                                        {countryData?.map((item: any, index: number) => (
                                          <MenuItem key={index} value={item.id}>
                                            {item?.currency}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                      {getIn(errors, `address.${index}.currency`) &&
                                        getIn(touched, `address.${index}.currency`) && (
                                          <div className="input-feedback" style={{ color: "red" }}>
                                            {getIn(errors, `address.${index}.currency`)}
                                          </div>
                                        )}
                                    </Grid>
                                  </Grid>

                                  {/* active */}
                                  <Grid container spacing={4} className="formGroupItem">
                                    <Grid item xs={4}>
                                      <InputLabel htmlFor={`address.${index}.status`}>
                                        <div className="label-heading">
                                          Status <sup>*</sup>
                                        </div>
                                      </InputLabel>
                                    </Grid>
                                    <Grid item xs={7}>
                                      <FormGroup className="input-holder">
                                        <Select
                                          MenuProps={{
                                            PaperProps: {
                                              style: { maxHeight: 200 },
                                            },
                                          }}
                                          id={`address.${index}.status`}
                                          name={`address.${index}.status`}
                                          size="small"
                                          fullWidth
                                          placeholder="Active"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          value={
                                            (values?.address[`${index}`] &&
                                              values?.address[`${index}`]?.status) ||
                                            "Active"
                                          }
                                          error={
                                            getIn(errors, `address.${index}.status`) &&
                                            getIn(touched, `address.${index}.status`)
                                              ? true
                                              : false
                                          }
                                        >
                                          <MenuItem value="Active">Active</MenuItem>
                                          <MenuItem value="Inactive">Inactive</MenuItem>
                                        </Select>
                                        {getIn(errors, `address.${index}.status`) &&
                                          getIn(touched, `address.${index}.status`) && (
                                            <div
                                              className="input-feedback"
                                              style={{ color: "red" }}
                                            >
                                              {getIn(errors, `address.${index}.status`)}
                                            </div>
                                          )}
                                      </FormGroup>
                                    </Grid>
                                  </Grid>
                                  {/* divider */}
                                  {/* {values?.address?.rates} */}
                                  <div className="middle__seperator">
                                    <FieldArray name={`address[${index}].rates`}>
                                      {({ push: pushRec, remove: removeRec }: any) => (
                                        <>
                                          {address?.rates?.map((rate: any, rateIndex: number) => {
                                            return (
                                              <>
                                                <div
                                                  key={rate?.id}
                                                  style={{
                                                    position: "relative",
                                                  }}
                                                >
                                                  <RateInputField
                                                    values={values}
                                                    handleChange={handleChange}
                                                    handleBlur={handleBlur}
                                                    touched={touched}
                                                    errors={errors}
                                                    parentIndex={index}
                                                    selfIndex={rateIndex}
                                                    formikProps={props}
                                                  />

                                                  {values?.address[`${index}`]?.rates?.length > 1 &&
                                                    cancelButton({
                                                      deleteFnk: (id: number) => removeRec(id),
                                                      deleteId: rateIndex,
                                                      iconStyle: {
                                                        position: "absolute",
                                                        right: "2px",
                                                        top: "0px",
                                                      },
                                                    })}
                                                </div>
                                              </>
                                            );
                                          })}
                                          <Grid container spacing={4}>
                                            <Grid item xs={4}></Grid>
                                            <Grid
                                              item
                                              xs={7}
                                              sx={{
                                                paddingLeft: "16px !important",
                                                paddingTop: "16px !important",
                                              }}
                                            >
                                              <Button
                                                type="button"
                                                variant="contained"
                                                className="add-another__rate"
                                                onClick={() =>
                                                  pushRec({
                                                    rate_type: "",
                                                    rate: "",
                                                  })
                                                }
                                              >
                                                <span style={{ marginRight: "8px" }}>+</span>
                                                <span>Add Another rate type</span>
                                              </Button>
                                            </Grid>
                                          </Grid>
                                        </>
                                      )}
                                    </FieldArray>
                                  </div>

                                  {/* notes */}
                                  <Grid container spacing={4} className="formGroupItem text-area">
                                    <Grid item xs={4}>
                                      <InputLabel htmlFor="notes">
                                        <div className="label-heading">Add Notes</div>
                                        <p>A message from you that has to communicated to.</p>
                                      </InputLabel>
                                    </Grid>
                                    <Grid item xs={7}>
                                      <FormGroup className="input-holder">
                                        <TextareaAutosize
                                          minRows={3}
                                          placeholder="Type any message that has to be passed on."
                                          className="text__area-style"
                                          id={`address.${index}.notes`}
                                          name={`address.${index}.notes`}
                                          onChange={(ev) => {
                                            setFieldValue(
                                              `address.${index}.notes`,
                                              ev.target.value,
                                            );
                                            setFieldTouched(`address.${index}.notes`);
                                          }}
                                          onBlur={handleBlur}
                                          value={
                                            (values?.address[`${index}`] &&
                                              values?.address[`${index}`]?.notes) ||
                                            ""
                                          }
                                          maxLength={300}
                                        />
                                        <FormHelperText>
                                          {300 -
                                            Number(
                                              (values?.address[`${index}`] &&
                                                values?.address[`${index}`]?.notes?.length) ||
                                                0,
                                            )}{" "}
                                          characters left
                                        </FormHelperText>
                                        {getIn(errors, `address.${index}.notes`) &&
                                          getIn(touched, `address.${index}.notes`) && (
                                            <div
                                              className="input-feedback"
                                              style={{ color: "red" }}
                                            >
                                              {getIn(errors, `address.${index}.notes`)}
                                            </div>
                                          )}
                                      </FormGroup>
                                    </Grid>
                                  </Grid>
                                </Box>
                              </div>
                            </>
                          );
                        })}

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
                            {!!!param?.tariffId && (
                              <Button
                                variant="contained"
                                type="button"
                                onClick={() => {
                                  push({
                                    billing_agreement_type: "",
                                    inspection: [],
                                    currency: parentData?.currency,
                                    location: [],
                                    status: "Active",
                                    notes: "",
                                    rates: [{ rate_type: "", rate: "" }],
                                  });
                                }}
                                sx={{
                                  mr: 1,
                                  background: "#C1C6D4",
                                  color: "#283352",
                                  "&:hover": {
                                    color: "#fff",
                                  },
                                }}
                              >
                                Add Another Record
                              </Button>
                            )}
                            <Box sx={{ flex: "1 1 auto" }} />
                            <Button
                              variant="outlined"
                              type="button"
                              onClick={() => {
                                props.resetForm();
                                props.setValues(props.initialValues);
                                props.setTouched({});
                                setClearData(true);
                                // setInitialValues(initialValue);
                              }}
                              sx={{ mr: 1 }}
                            >
                              Clear All
                            </Button>
                            <Button
                              type="submit"
                              variant="contained"
                              // disabled={isSubmitting ? true : false}
                              // isSubmitting={isSubmitting}
                              onClick={(e) => {
                                e.preventDefault();
                                handleSubmit();
                              }}
                              sx={{ mr: 1 }}
                            >
                              {param?.tariffId ? "Update" : "Save"} & Proceed
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
                      </>
                    )}
                  </FieldArray>
                </form>
              </>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default AddTariffs;

{
  /* <Select
                                        MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                        id={`address.${index}.currency`}
                                        name={`address.${index}.currency`}
                                        size="small"
                                        fullWidth
                                        placeholder="Select here"
                                        data-testid="currency"
                                        autoComplete="off"
                                        disabled={true}
                                        value={
                                          (values?.address[`${index}`] &&
                                            values?.address[`${index}`]?.currency) ||
                                          ''
                                        }
                                        error={
                                          getIn(errors, `address.${index}.currency`) &&
                                          getIn(touched, `address.${index}.currency`)
                                            ? true
                                            : false
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}>
                                        {countryData?.map((item: any, index: number) => (
                                          <MenuItem key={index} value={item.id}>
                                            {item?.currency}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                      {getIn(errors, `address.${index}.currency`) &&
                                        getIn(touched, `address.${index}.currency`) && (
                                          <div className="input-feedback" style={{ color: 'red' }}>
                                            {getIn(errors, `address.${index}.currency`)}
                                          </div>
                                        )} */
}
