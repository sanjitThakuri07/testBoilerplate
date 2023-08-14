import React, { ChangeEvent, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  CircularProgress,
  FormGroup,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Formik, FormikProps, Field, ErrorMessage, FieldArray, getIn } from "formik";
import * as Yup from "yup";
import ProfilePicture from "containers/setting/profile/ProfilePicture";
import { useNavigate, useParams } from "react-router-dom";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import PhoneNumberInput from "containers/setting/profile/PhoneNumberInput";
import SaveIcon from "../../../assets/icons/save_icon.svg";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import { contractorAddressProps } from "interfaces/configs";
import { useSnackbar, SnackbarKey, SnackbarMessage, OptionsObject } from "notistack";
import Radio from "src/components/Radio";
import MultiEmailAdd from "src/components/MultiEmail/MultiEmailAdd";
import FileUploader from "src/components/upload";
import MultiUploader from "src/components/MultiFileUploader/index";
import {
  AddressValidationSchemaCustomer,
  allContractorAddressValidationSchema,
  CustomerAddressValidationSchema,
} from "validationSchemas/ContractorValidation";
import ResetTextField from "./ResetTextField";
import FullPageLoader from "src/components/FullPageLoader";
import DynamicSelectField from "containers/setting/profile/DynamicSelectField";
import "./form.style.scss";
import ModalLayout from "src/components/ModalLayout";
import ServiceForm from "../../services/ServiceForm";
import { serviceProps } from "interfaces/configs";
import { putApiData, postApiData, fetchApI, fetchInitialValues } from "./apiRequest";
import { useLocation } from "react-router-dom";

interface FormValues {
  address: contractorAddressProps[]; // Make sure to define the array type
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

interface Address {
  selectedCountry: number;
  selectedTerritory: number;
}

interface Location {
  suburb: string;
  city: string;
  state: string;
  post_code: string;
  id: number;
  territory_id: number;
  location: string;
}

interface Territory {
  code: string;
  id: number;
  name: string;
  location: Location[];
}

interface AddressData {
  id: number;
  code: string;
  currency: string;
  region_id: number;
  country_id: number;
  country: {
    id: number;
    name: string;
  };
  territory: Territory[];
}

const ContractorAddress: React.FC<{
  proceedToNextPage?: Function;
  address: any;
  isFormLoading?: boolean;
  setIsFormLoading?: Function;
  disabled?: boolean;
}> = ({ proceedToNextPage, address, setIsFormLoading, isFormLoading, disabled }) => {
  const [territoryData, setTerritoryData] = useState<{ [key: string]: any }>({});
  const [addressTypeData, setAddressTypeData] = useState(["Primary", "Secondary"]);
  const [wholeAddressData, setWholeAddressData] = useState([]);
  const [cityData, setCityData] = useState<{ [key: string]: any }>({});
  const [stateData, setStateData] = useState([]);
  const [clearData, setClearData] = useState(false);
  const navigate = useNavigate();

  const param = useParams();

  // form initial values
  let initialData = address;

  const initialContractorAddressValues: FormValues = {
    address: initialData,
  };

  const [initialValues, setInitialValues] = useState(initialContractorAddressValues);

  const { enqueueSnackbar } = useSnackbar();
  const [disableEntireField, setDisableEntireField] = useState(false);

  // Get the current location object
  const location = useLocation();
  const nextPage = new URLSearchParams(location.search).get("user");

  const customer = new URLSearchParams(location.search).get("customer");

  // Get the value of the addressId
  const addressId = new URLSearchParams(location.search).get("address");

  // search add_address keyword in the url
  const addAddress = location.search.includes("add_address");

  const redirectToNextPage = (e: boolean) => {
    if (e === true) {
      // navigate(`/customer/add?user=${param?.customerId}`);
      proceedToNextPage?.("add");
    } else if (e === false) {
      navigate(`/customer/add?user=${param?.customerId}`);
      proceedToNextPage?.("edit");
    }
  };

  // form submisstion
  // const [isFormLoading, setIsFormLoading] = useState(false);
  const submitHandler = async (values: any, actions: any) => {
    // setIsFormLoading?.(true);
    if (param?.customerId || customer) {
      const getId = param?.customerId || customer;

      (await putApiData({
        // setterFunction: setSomeState,
        values,
        id: Number(getId),
        url: "customers/customer-address",
        enqueueSnackbar: enqueueSnackbar,
        // navigateTo: (id: number) => navigate(`/customer/add?=${param?.customerId}`),
        domain: "Customer Address",
        setterLoading: setIsFormLoading,
      })) && redirectToNextPage(addAddress);
      // navigate(`/customer`);
    } else {
      await postApiData({
        // setterFunction: setSomeState,
        values,
        url: "/customers/customer-address/",
        enqueueSnackbar: enqueueSnackbar,
        // navigateTo: (id: number) =>
        navigateTo: (id: number) => navigate(`/customer/add?=${param?.customerId}`),
        domain: "Contractor Address",
        setterLoading: setIsFormLoading,
      });
    }
  };

  // fetching data for both with and without ids
  const fetchData = async () => {
    setIsFormLoading?.(true);
    await fetchApI({
      setterFunction: setWholeAddressData,
      url: "country/country-data",
      enqueueSnackbar,
      queryParam: "size=99",
    });
    setIsFormLoading?.(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (address?.length) {
      setInitialValues((prev) => ({ ...prev, address }));
    }
  }, [address]);

  // for setting the select option dynamically when editing
  useEffect(() => {
    if (wholeAddressData?.length) {
      const wholeData: AddressData[] = [...wholeAddressData];
      const addresses: any = initialValues?.address || [];

      const selectedTerritoriesWhole: any = [];

      const selectedLocations: Location[] = [];

      addresses.forEach((address: any) => {
        const { country: selectedCountry, territory: selectedTerritory } = address;

        // filter territories for selected country
        const filteredDataTerritory: any =
          wholeData.find((addressData: any) => addressData.id === selectedCountry) || {};

        const selectedTerritories = filteredDataTerritory?.territory || [];
        selectedTerritoriesWhole.push(selectedTerritories);

        const selectedTerritoryLocations =
          (selectedTerritories?.length &&
            selectedTerritories?.find((terr: any) => Number(terr?.id) === Number(selectedTerritory))
              ?.location) ||
          [];
        selectedLocations.push(selectedTerritoryLocations);
      });
      setTerritoryData(Object.assign({}, selectedTerritoriesWhole));
      setCityData(Object.assign({}, selectedLocations));
    }
  }, [wholeAddressData, address, initialValues]);

  // deleting the object through key
  const DeleteDynamicObjecHandler = ({
    object,
    deleteKey,
    setterFunction,
    reOrder,
  }: ObjectHandler) => {
    const obj = { ...object };
    delete obj[`${deleteKey}`];
    if (setterFunction) {
      setterFunction(obj);
    }

    if (reOrder) {
      const objToArr = Object.values(obj);
      // again to object to reorder
      const toObj: {} = Object.assign({}, objToArr ?? { 0: [] });
      setterFunction?.(toObj || {});
      return toObj;
    }
    return obj;
  };

  // for filtering the data
  const filterData = ({ id, wholeData, name = "", setterFunction, place }: ObjectFilter) => {
    let filterData: any =
      wholeData?.find((add: any) => {
        return Number(id) === Number(add?.id);
      }) || [];
    let findDataArr = filterData[`${name}`] || [];
    return findDataArr;
  };

  return (
    <div>
      {" "}
      <Formik
        // key={key}
        enableReinitialize
        initialValues={{
          address:
            Object.keys(initialValues?.address[0] || [])?.length > 0
              ? address
              : [
                  {
                    address_type: null,
                    address_line: null,
                    city: null,
                    state: null,
                    // territory: null,
                    location: null,
                    country: null,
                    currency: null,
                    zip_code: "",
                  },
                ],
        }}
        onSubmit={async (values: FormValues, actions) => {
          if (disabled) return;
          const finalValue = values?.address?.map((v) => ({
            ...v,
            customer_id: param?.customerId,
            address_type: v?.address_type ? v.address_type : "Primary",
          }));

          submitHandler(finalValue, actions);
        }}
        validationSchema={CustomerAddressValidationSchema}
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
            resetForm,
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
                                      // const newTerritoryData = { ...territoryData };
                                      // delete newTerritoryData[`${index}`];
                                      // setTerritoryData(newTerritoryData);
                                      DeleteDynamicObjecHandler({
                                        object: territoryData,
                                        deleteKey: index,
                                        setterFunction: setTerritoryData,
                                        reOrder: true,
                                      });
                                      const updatedS = DeleteDynamicObjecHandler({
                                        object: cityData,
                                        deleteKey: index,
                                        setterFunction: setCityData,
                                        reOrder: true,
                                      });
                                      remove(index);
                                    }}
                                    style={{ position: "absolute", right: "14px", top: "12px" }}
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
                                  {/* address type */}
                                  <Grid container spacing={4} className="formGroupItem">
                                    <Grid item xs={4}>
                                      <InputLabel htmlFor={`address.${index}.address_type`}>
                                        <div className="label-heading  align__label">
                                          Address Type <sup>*</sup>
                                        </div>
                                      </InputLabel>
                                    </Grid>

                                    <Grid item xs={6}>
                                      <Select
                                        MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                        id={`address.${index}.address_type`}
                                        size="small"
                                        fullWidth
                                        data-testid="address_type"
                                        placeholder="Select here"
                                        autoComplete="off"
                                        className={disabled ? "disabled" : ""}
                                        disabled={disabled}
                                        name={`address.${index}.address_type`}
                                        value={
                                          (values?.address[`${index}`] &&
                                            values?.address[`${index}`]?.address_type) ||
                                          ""
                                        }
                                        defaultValue={"Primary"}
                                        error={
                                          getIn(errors, `address.${index}.address_type`) &&
                                          getIn(touched, `address.${index}.address_type`)
                                            ? true
                                            : false
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      >
                                        {addressTypeData?.map((item: any, index: number) => (
                                          <MenuItem key={item} value={`${item}`}>
                                            {item}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                      {getIn(errors, `address.${index}.address_type`) &&
                                        getIn(touched, `address.${index}.address_type`) && (
                                          <div className="input-feedback" style={{ color: "red" }}>
                                            {getIn(errors, `address.${index}.address_type`)}
                                          </div>
                                        )}
                                    </Grid>
                                  </Grid>
                                  {/* address line */}
                                  <Grid container spacing={4} className="formGroupItem">
                                    <Grid item xs={4}>
                                      <InputLabel htmlFor={`address.${index}.address_line`}>
                                        <div className="label-heading  align__label">
                                          Address Line
                                        </div>
                                      </InputLabel>
                                    </Grid>

                                    <Grid item xs={6}>
                                      <Field
                                        as={OutlinedInput}
                                        name={`address.${index}.address_line`}
                                        id={`address.${index}.address_line`}
                                        data-testid={`address.${index}.address_line`}
                                        type="text"
                                        autoComplete="off"
                                        className={disabled ? "disabled" : ""}
                                        disabled={disabled}
                                        placeholder="Enter Address Line"
                                        size="small"
                                        fullWidth
                                        value={
                                          (values?.address[`${index}`] &&
                                            values?.address[`${index}`]?.address_line) ||
                                          ""
                                        }
                                        error={
                                          getIn(errors, `address.${index}.address_line`) &&
                                          getIn(touched, `address.${index}.address_line`)
                                            ? true
                                            : false
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                      {getIn(errors, `address.${index}.address_line`) &&
                                        getIn(touched, `address.${index}.address_line`) && (
                                          <div className="input-feedback" style={{ color: "red" }}>
                                            {getIn(errors, `address.${index}.address_line`)}
                                          </div>
                                        )}
                                    </Grid>
                                  </Grid>

                                  {/* city */}
                                  <Grid container spacing={4} className="formGroupItem">
                                    <Grid item xs={4}>
                                      <InputLabel htmlFor={`address.${index}.city`}>
                                        <div className="label-heading  align__label">City</div>
                                      </InputLabel>
                                    </Grid>

                                    <Grid item xs={6}>
                                      <Field
                                        as={OutlinedInput}
                                        name={`address.${index}.city`}
                                        id={`address.${index}.city`}
                                        data-testid={`address.${index}.city`}
                                        type="text"
                                        autoComplete="off"
                                        className={disabled ? "disabled" : ""}
                                        disabled={disabled}
                                        placeholder="Enter City"
                                        size="small"
                                        fullWidth
                                        value={
                                          (values?.address[`${index}`] &&
                                            values?.address[`${index}`]?.city) ||
                                          ""
                                        }
                                        error={
                                          getIn(errors, `address.${index}.city`) &&
                                          getIn(touched, `address.${index}.city`)
                                            ? true
                                            : false
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                      {getIn(errors, `address.${index}.city`) &&
                                        getIn(touched, `address.${index}.city`) && (
                                          <div className="input-feedback" style={{ color: "red" }}>
                                            {getIn(errors, `address.${index}.city`)}
                                          </div>
                                        )}
                                    </Grid>
                                  </Grid>
                                  {/* state */}
                                  <Grid container spacing={4} className="formGroupItem">
                                    <Grid item xs={4}>
                                      <InputLabel htmlFor={`address.${index}.state`}>
                                        <div className="label-heading  align__label">
                                          State/Province
                                        </div>
                                      </InputLabel>
                                    </Grid>

                                    <Grid item xs={6}>
                                      <Field
                                        as={OutlinedInput}
                                        name={`address.${index}.state`}
                                        id={`address.${index}.state`}
                                        data-testid={`address.${index}.state`}
                                        type="text"
                                        autoComplete="off"
                                        className={disabled ? "disabled" : ""}
                                        disabled={disabled}
                                        placeholder="Enter State/Province"
                                        size="small"
                                        fullWidth
                                        value={
                                          (values?.address[`${index}`] &&
                                            values?.address[`${index}`]?.state) ||
                                          ""
                                        }
                                        error={
                                          getIn(errors, `address.${index}.state`) &&
                                          getIn(touched, `address.${index}.state`)
                                            ? true
                                            : false
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                      {getIn(errors, `address.${index}.state`) &&
                                        getIn(touched, `address.${index}.state`) && (
                                          <div className="input-feedback" style={{ color: "red" }}>
                                            {getIn(errors, `address.${index}.state`)}
                                          </div>
                                        )}
                                    </Grid>
                                  </Grid>

                                  {/* zip/postalcode */}
                                  <Grid container spacing={4} className="formGroupItem">
                                    <Grid item xs={4}>
                                      <InputLabel htmlFor={`address.${index}.zip_code`}>
                                        <div className="label-heading  align__label">Zip Code</div>
                                      </InputLabel>
                                    </Grid>

                                    <Grid item xs={6}>
                                      <Field
                                        as={OutlinedInput}
                                        name={`address.${index}.zip_code`}
                                        id={`address.${index}.zip_code`}
                                        data-testid={`address.${index}.zip_code`}
                                        type="text"
                                        autoComplete="off"
                                        className={disabled ? "disabled" : ""}
                                        disabled={disabled}
                                        placeholder="Enter Zip Code"
                                        size="small"
                                        fullWidth
                                        value={
                                          (values?.address[`${index}`] &&
                                            values?.address[`${index}`]?.zip_code) ||
                                          ""
                                        }
                                        error={
                                          getIn(errors, `address.${index}.zip_code`) &&
                                          getIn(touched, `address.${index}.zip_code`)
                                            ? true
                                            : false
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                      {getIn(errors, `address.${index}.zip_code`) &&
                                        getIn(touched, `address.${index}.zip_code`) && (
                                          <div className="input-feedback" style={{ color: "red" }}>
                                            {getIn(errors, `address.${index}.zip_code`)}
                                          </div>
                                        )}
                                    </Grid>
                                  </Grid>
                                  {/* country */}
                                  <Grid container spacing={4} className="formGroupItem">
                                    <Grid item xs={4}>
                                      <InputLabel htmlFor={`address.${index}.country`}>
                                        <div className="label-heading  align__label">
                                          Country <sup>*</sup>
                                        </div>
                                      </InputLabel>
                                    </Grid>

                                    <Grid item xs={6}>
                                      <Select
                                        MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                        name={`address.${index}.country`}
                                        id="country"
                                        size="small"
                                        fullWidth
                                        data-testid="country"
                                        placeholder="Select here"
                                        autoComplete="off"
                                        className={disabled ? "disabled" : ""}
                                        disabled={disabled}
                                        value={
                                          (values?.address[`${index}`] &&
                                            values?.address[`${index}`]?.country) ||
                                          ""
                                        }
                                        error={
                                          getIn(errors, `address.${index}.country`) &&
                                          getIn(touched, `address.${index}.country`)
                                            ? true
                                            : false
                                        }
                                        onChange={(e) => {
                                          // const countryId = e.target.value;
                                          // let territoryFilter: any =
                                          //   wholeAddressData?.find((add: any) => {
                                          //     return Number(countryId) === Number(add?.id);
                                          //   }) || [];
                                          // let territoryArr = territoryFilter?.territory || [];
                                          // setTerritoryData((prev) => {
                                          //   return { ...prev, [`${index}`]: territoryArr };
                                          // });
                                          // setFieldValue(`address.${index}.territory`, null);
                                          // setFieldValue(`address.${index}.city`, '');
                                          // setFieldValue(`address.${index}.state`, '');
                                          handleChange(e);
                                        }}
                                        onBlur={handleBlur}
                                      >
                                        {wholeAddressData?.map((item: any, index: number) => (
                                          <MenuItem key={index} value={item.id}>
                                            {item?.country?.name}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                      {getIn(errors, `address.${index}.country`) &&
                                        getIn(touched, `address.${index}.country`) && (
                                          <div className="input-feedback" style={{ color: "red" }}>
                                            {getIn(errors, `address.${index}.country`)}
                                          </div>
                                        )}
                                    </Grid>
                                  </Grid>

                                  {/* Location */}
                                  <Grid container spacing={4} className="formGroupItem">
                                    <Grid item xs={4}>
                                      <InputLabel htmlFor={`address.${index}.territory`}>
                                        <div className="label-heading  align__label">Location</div>
                                      </InputLabel>
                                    </Grid>

                                    <Grid item xs={6}>
                                      <Field
                                        as={OutlinedInput}
                                        name={`address.${index}.location`}
                                        id={`address.${index}.location`}
                                        data-testid={`address.${index}.location`}
                                        type="text"
                                        autoComplete="off"
                                        className={disabled ? "disabled" : ""}
                                        disabled={disabled}
                                        placeholder="Enter Location"
                                        size="small"
                                        fullWidth
                                        value={
                                          (values?.address[`${index}`] &&
                                            values?.address[`${index}`]?.location) ||
                                          ""
                                        }
                                        error={
                                          getIn(errors, `address.${index}.location`) &&
                                          getIn(touched, `address.${index}.location`)
                                            ? true
                                            : false
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                      {getIn(errors, `address.${index}.location`) &&
                                        getIn(touched, `address.${index}.location`) && (
                                          <div className="input-feedback" style={{ color: "red" }}>
                                            {getIn(errors, `address.${index}.location`)}
                                          </div>
                                        )}
                                    </Grid>
                                  </Grid>
                                </Box>
                              </div>
                            </>
                          );
                        })}

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
                              <Button
                                variant="contained"
                                type="button"
                                onClick={() => {
                                  push({
                                    address_type: "",
                                    address_line: "",
                                    city: "",
                                    state: "",
                                    territory: null,
                                    location: "",
                                    country: "",
                                    zip_code: "",
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
                                Add New Address
                              </Button>
                              <Box sx={{ flex: "1 1 auto" }} />
                              <Button
                                variant="outlined"
                                type="button"
                                onClick={() => {
                                  // props.resetForm();
                                  // props.setValues(props.initialValues);
                                  // props.setTouched({});
                                  // setClearData(true);
                                  // setInitialValues(initialContractorAddressValues);

                                  props.setFieldValue("address", [
                                    {
                                      address_type: "",
                                      address_line: "",
                                      city: "",
                                      state: "",
                                      territory: null,
                                      country: "",
                                      zip_code: "",
                                    },
                                  ]);
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

export default ContractorAddress;
