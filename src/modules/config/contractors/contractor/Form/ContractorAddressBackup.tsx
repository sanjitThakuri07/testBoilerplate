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
  Typography,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Formik, FormikProps, Field, ErrorMessage, FieldArray, getIn } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { contractorAddressProps } from "src/src/interfaces/configs";
import { useSnackbar, SnackbarKey, SnackbarMessage, OptionsObject } from "notistack";
import { allContractorAddressValidationSchema } from "src/validationSchemas/ContractorValidation";
import FullPageLoader from "src/components/FullPageLoader";
import {
  putApiData,
  postApiData,
  fetchApI,
  // fetchInitialValues,
} from "src/modules/apiRequest/apiRequest";
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
  city: string | null;
  state: string | null;
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

  // Get the value of the addressId
  const addressId = new URLSearchParams(location.search).get("address");

  // form submisstion
  // const [isFormLoading, setIsFormLoading] = useState(false);
  const submitHandler = async (values: any, actions: any) => {
    // setIsFormLoading?.(true);
    if (param?.contractorId) {
      (await putApiData({
        // setterFunction: setSomeState,
        values,
        id: +param?.contractorId,
        url: "contractors/contractor-address",
        enqueueSnackbar: enqueueSnackbar,
        // navigateTo: (id: number) => navigate(`/config/contractors/all-contractors/`),
        // domain: 'Contractor Address',
        setterLoading: setIsFormLoading,
      })) && navigate("/config/contractors/all-contractors");
    } else {
      await postApiData({
        // setterFunction: setSomeState,
        values,
        url: "/contractors/contractor-address/",
        enqueueSnackbar: enqueueSnackbar,
        // navigateTo: (id: number) =>
        //   navigate(`/config/contractors/all-contractors/edit/${id}?nextPage=2`),
        // domain: 'Contractor Address',
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
      // proceedToNextPage?.(nextPage);
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
                    address_type: "",
                    address_line: "",
                    city: "",
                    state: "",
                    territory: "",
                    country: "",
                    zip_code: "",
                  },
                ],
        }}
        onSubmit={async (values: FormValues, actions) => {
          if (disabled) return;
          const finalValue = values?.address?.map((v) => ({
            ...v,
            contractor: param?.contractorId,
            address_type: v?.address_type ? v.address_type : "Primary",
          }));

          submitHandler(finalValue, actions);
        }}
        validationSchema={allContractorAddressValidationSchema}
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
                                          const countryId = e.target.value;
                                          let territoryFilter: any =
                                            wholeAddressData?.find((add: any) => {
                                              return Number(countryId) === Number(add?.id);
                                            }) || [];
                                          let territoryArr = territoryFilter?.territory || [];
                                          setTerritoryData((prev) => {
                                            return { ...prev, [`${index}`]: territoryArr };
                                          });
                                          setFieldValue(`address.${index}.territory`, null);
                                          setFieldValue(`address.${index}.city`, null);
                                          setFieldValue(`address.${index}.state`, null);
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
                                  {/* territory */}
                                  <Grid container spacing={4} className="formGroupItem">
                                    <Grid item xs={4}>
                                      <InputLabel htmlFor={`address.${index}.territory`}>
                                        <div className="label-heading  align__label">
                                          Territory <sup>*</sup>
                                        </div>
                                      </InputLabel>
                                    </Grid>

                                    <Grid item xs={6}>
                                      <Select
                                        MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                        name={`address.${index}.territory`}
                                        id="territory"
                                        size="small"
                                        fullWidth
                                        data-testid="territory"
                                        placeholder="Select here"
                                        autoComplete="off"
                                        disabled={
                                          !disabled
                                            ? !values?.address[`${index}`]?.country
                                            : disabled
                                        }
                                        className={
                                          !disabled
                                            ? !values?.address[`${index}`]?.country
                                              ? "disabled"
                                              : ""
                                            : disabled
                                            ? "disabled"
                                            : ""
                                        }
                                        value={
                                          (values?.address[`${index}`] &&
                                            values?.address[`${index}`]?.territory) ||
                                          null
                                        }
                                        error={
                                          getIn(errors, `address.${index}.territory`) &&
                                          getIn(touched, `address.${index}.territory`)
                                            ? true
                                            : false
                                        }
                                        onChange={(e) => {
                                          const data = filterData({
                                            id: `${e.target.value}`,
                                            wholeData: territoryData[`${index}`],
                                            name: "location",
                                          });
                                          setCityData((prev) => {
                                            return { ...prev, [`${index}`]: data };
                                          });
                                          setFieldValue(`address.${index}.city`, null);
                                          setFieldValue(`address.${index}.state`, null);
                                          // setFieldValue(`address.${index}.state`, data[`${}`]?.state);
                                          handleChange(e);
                                        }}
                                        onBlur={handleBlur}
                                      >
                                        {territoryData[`${index}`]?.map(
                                          (item: any, index: number) => (
                                            <MenuItem key={index} value={item.id}>
                                              {item.name}
                                            </MenuItem>
                                          ),
                                        )}
                                      </Select>
                                      {getIn(errors, `address.${index}.territory`) &&
                                        getIn(touched, `address.${index}.territory`) && (
                                          <div className="input-feedback" style={{ color: "red" }}>
                                            {getIn(errors, `address.${index}.territory`)}
                                          </div>
                                        )}
                                    </Grid>
                                  </Grid>
                                  {/* city */}
                                  <Grid container spacing={4} className="formGroupItem">
                                    <Grid item xs={4}>
                                      <InputLabel htmlFor={`address.${index}.city`}>
                                        <div className="label-heading  align__label">
                                          {/* City <sup>*</sup> */}
                                          City
                                        </div>
                                      </InputLabel>
                                    </Grid>

                                    <Grid item xs={6}>
                                      <Select
                                        MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                        name={`address.${index}.city`}
                                        id="city"
                                        size="small"
                                        fullWidth
                                        data-testid="city"
                                        placeholder="Select here"
                                        autoComplete="off"
                                        disabled={
                                          !disabled
                                            ? !values?.address[`${index}`]?.territory
                                            : disabled
                                        }
                                        className={
                                          !disabled
                                            ? !values?.address[`${index}`]?.territory
                                              ? "disabled"
                                              : ""
                                            : disabled
                                            ? "disabled"
                                            : ""
                                        }
                                        value={
                                          (values?.address[`${index}`] &&
                                            values?.address[`${index}`]?.city) ||
                                          null
                                        }
                                        error={
                                          getIn(errors, `address.${index}.city`) &&
                                          getIn(touched, `address.${index}.city`)
                                            ? true
                                            : false
                                        }
                                        onChange={(e) => {
                                          const cityName = e.target.value;
                                          const stateData = cityData[`${index}`]?.find(
                                            (city: any) => city?.city === e.target.value,
                                          );
                                          setFieldValue(
                                            `address.${index}.state`,
                                            stateData?.state || null,
                                          );
                                          handleChange(e);
                                        }}
                                        onBlur={handleBlur}
                                      >
                                        {cityData[`${index}`]?.map((item: any, index: number) => (
                                          <MenuItem key={index} value={item.city}>
                                            {item.city}
                                          </MenuItem>
                                        ))}
                                      </Select>
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
                                          {/* State/Province <sup>*</sup> */}
                                          State/Province
                                        </div>
                                      </InputLabel>
                                    </Grid>

                                    <Grid item xs={6}>
                                      <Select
                                        MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                        name={`address.${index}.state`}
                                        id="state"
                                        size="small"
                                        fullWidth
                                        data-testid="state"
                                        placeholder="Select here"
                                        autoComplete="off"
                                        disabled={true}
                                        className="disabled"
                                        value={
                                          (values?.address[`${index}`] &&
                                            values?.address[`${index}`]?.state) ||
                                          null
                                        }
                                        error={
                                          getIn(errors, `address.${index}.state`) &&
                                          getIn(touched, `address.${index}.state`)
                                            ? true
                                            : false
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      >
                                        {cityData[`${index}`]?.map((item: any, index: number) => (
                                          <MenuItem key={index} value={item.state}>
                                            {item.state}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                      {getIn(errors, `address.${index}.state`) &&
                                        getIn(touched, `address.${index}.state`) && (
                                          <div className="input-feedback" style={{ color: "red" }}>
                                            {getIn(errors, `address.${index}.state`)}
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
                                        placeholder="Enter here"
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
                                        placeholder="Enter here"
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
                                    territory: "",
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
                                      territory: "",
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
