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
import PhoneNumberInput from "src/modules/setting/profile/PhoneNumberInput";
import SaveIcon from "src/assets/icons/save_icon.svg";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import { contractorAddressProps } from "src/interfaces/configs";
import { useSnackbar, SnackbarKey, SnackbarMessage, OptionsObject } from "notistack";
import Radio from "src/components/Radio";
import MultiEmailAdd from "src/components/MultiEmail/MultiEmailAdd";
import FileUploader from "src/components/upload";
import MultiUploader from "src/components/MultiFileUploader/index";
import { TariffValidationSchema } from "src/validationSchemas/ContractorValidation";
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

interface Value {
  customer?: number | null;
  begin_date?: string;
  end_date?: string;
  status?: string;
  notes?: string;
  contract_no?: string;
  records?: any;
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

const AddTariffs: React.FC<{
  proceedToNextPage?: Function;
  individualData?: any;
  isFormLoading?: boolean;
  setIsFormLoading?: Function;
}> = ({ proceedToNextPage, individualData }) => {
  const [customerData, setCustomerData] = useState([]);
  const [clearData, setClearData] = useState(false);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const param = useParams();

  // form initial values
  let initialData = Object.keys(individualData[0] || {})?.length
    ? individualData
    : [
        {
          customer: null,
          begin_date: "",
          end_date: "",
          status: "Active",
          notes: "",
        },
      ];

  const initialValue: FormValues = {
    address: initialData,
  };
  const [initialValues, setInitialValues] = useState(initialValue);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [disableEntireField, setDisableEntireField] = useState(false);
  const { routes, setCustomRoutes } = usePathUrlSettor();

  // Get the current location object
  const location = useLocation();

  // Get the value of the addressId
  const addressId = new URLSearchParams(location.search).get("address");

  const submitHandler = async (values: any, actions: any) => {
    // setIsFormLoading?.(true);
    if (param?.tariffId) {
      (await putApiData({
        // setterFunction: setSomeState,
        values: values[0],
        id: +param?.tariffId,
        url: `${routes?.backendUrl}`,
        enqueueSnackbar: enqueueSnackbar,
        // navigateTo: (id: number) => navigate(`/config/contractors/all-contractors/`),
        domain: "Tariff",
        setterLoading: setIsFormLoading,
      })) && navigate("/finance/tariffs");
    } else {
      (await postApiData({
        // setterFunction: setSomeState,
        values,
        url: `/${routes?.backendUrl}/`,
        enqueueSnackbar: enqueueSnackbar,
        // navigateTo: (id: number) =>
        //   navigate(`/config/contractors/all-contractors/edit/${id}?nextPage=2`),
        domain: "Tariff",
        setterLoading: setIsFormLoading,
      })) && navigate("/finance/tariffs");
    }
  };

  // fetching data for both with and without ids
  const fetchData = async () => {
    setIsFormLoading?.(true);
    await fetchApI({
      setterFunction: (data: any) => {
        if (data?.length) {
          let newDataFormat = data?.map((item: any) => ({
            id: item?.id,
            label: item?.organization_name,
            value: item?.organization_name,
          }));
          setCustomerData(newDataFormat);
        }
      },
      url: `${allRoutes?.Customers?.backendUrl}/`,
      enqueueSnackbar,
      queryParam: "size=99",
    });
    setIsFormLoading?.(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (Object?.keys(individualData[0] || {})?.length) {
      setInitialValues({ address: individualData });
    }
  }, [Object?.keys(individualData[0] || {})?.length, individualData]);

  let readOnly = location.pathname.includes("edit") || false;

  return (
    <div>
      {" "}
      <Formik
        // key={key}
        enableReinitialize
        initialValues={initialValues}
        onSubmit={async (values: FormValues, actions) => {
          const finalValue = values?.address?.map((v) => ({
            ...v,
          }));

          submitHandler(finalValue, actions);
        }}
        validationSchema={TariffValidationSchema}
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
            resetForm,
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
                                  {/* services */}
                                  <Grid container spacing={4} className="formGroupItem">
                                    <Grid item xs={4}>
                                      <InputLabel htmlFor="services">
                                        <div className="label-heading  align__label">
                                          Customer <sup>*</sup>
                                        </div>
                                      </InputLabel>
                                    </Grid>

                                    <Grid item xs={7}>
                                      <DynamicSelectField
                                        isViewOnly={false}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        handleSelectTouch={() => setFieldTouched("services", true)}
                                        id={`address.${index}.customer`}
                                        menuOptions={customerData}
                                        value={
                                          (values?.address[`${index}`] &&
                                            values?.address[`${index}`]?.customer) ||
                                          ""
                                        }
                                        error={
                                          getIn(errors, `address.${index}.customer`) &&
                                          getIn(touched, `address.${index}.customer`)
                                        }
                                        touched={getIn(touched, `address.${index}.customer`)}
                                        addChildren={true}
                                        children={"+ Add New Customer"}
                                        openModal={() => navigate("/customer/add")}
                                        setData={"id"}
                                        disabled={readOnly}
                                      />
                                      {getIn(errors, `address.${index}.customer`) &&
                                        getIn(touched, `address.${index}.customer`) && (
                                          <div className="input-feedback" style={{ color: "red" }}>
                                            {getIn(errors, `address.${index}.customer`)}
                                          </div>
                                        )}
                                    </Grid>
                                  </Grid>

                                  {/* Begin Date */}
                                  <Grid container spacing={4} className="formGroupItem">
                                    <Grid item xs={4}>
                                      <InputLabel htmlFor="begin_date">
                                        <div className="label-heading  align__label">
                                          Begin Date
                                          <sup>*</sup>
                                        </div>
                                      </InputLabel>
                                    </Grid>

                                    <Grid item xs={7}>
                                      <Field
                                        as={OutlinedInput}
                                        name={`address.${index}.begin_date`}
                                        id={`address.${index}.begin_date`}
                                        data-testid={`address.${index}.begin_date`}
                                        type="date"
                                        autoComplete="off"
                                        disabled={disableEntireField}
                                        placeholder="Enter here"
                                        size="small"
                                        fullWidth
                                        value={
                                          (values?.address[`${index}`] &&
                                            values?.address[`${index}`]?.begin_date) ||
                                          ""
                                        }
                                        error={
                                          getIn(errors, `address.${index}.begin_date`) &&
                                          getIn(touched, `address.${index}.begin_date`)
                                            ? true
                                            : false
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />

                                      {getIn(errors, `address.${index}.begin_date`) &&
                                        getIn(touched, `address.${index}.begin_date`) && (
                                          <div className="input-feedback" style={{ color: "red" }}>
                                            {getIn(errors, `address.${index}.begin_date`)}
                                          </div>
                                        )}
                                    </Grid>
                                  </Grid>
                                  {/* End Date */}
                                  <Grid container spacing={4} className="formGroupItem">
                                    <Grid item xs={4}>
                                      <InputLabel htmlFor="end_date">
                                        <div className="label-heading  align__label">
                                          End Date
                                          <sup>*</sup>
                                        </div>
                                      </InputLabel>
                                    </Grid>

                                    <Grid item xs={7}>
                                      <Field
                                        as={OutlinedInput}
                                        name={`address.${index}.end_date`}
                                        id={`address.${index}.end_date`}
                                        data-testid={`address.${index}.end_date`}
                                        type="date"
                                        autoComplete="off"
                                        disabled={disableEntireField}
                                        placeholder="Enter here"
                                        size="small"
                                        fullWidth
                                        value={
                                          (values?.address[`${index}`] &&
                                            values?.address[`${index}`]?.end_date) ||
                                          ""
                                        }
                                        error={
                                          getIn(errors, `address.${index}.end_date`) &&
                                          getIn(touched, `address.${index}.end_date`)
                                            ? true
                                            : false
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />

                                      {getIn(errors, `address.${index}.end_date`) &&
                                        getIn(touched, `address.${index}.end_date`) && (
                                          <div className="input-feedback" style={{ color: "red" }}>
                                            {getIn(errors, `address.${index}.end_date`)}
                                          </div>
                                        )}
                                    </Grid>
                                  </Grid>
                                  {/* active */}
                                  <Grid container spacing={4} className="formGroupItem">
                                    <Grid item xs={4}>
                                      <InputLabel htmlFor="status">
                                        <div className="label-heading">
                                          Status <sup>*</sup>
                                        </div>
                                      </InputLabel>
                                    </Grid>
                                    <Grid item xs={7}>
                                      <FormGroup className="input-holder">
                                        <Select
                                          MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
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
                                Add Another Tariff
                              </Button>
                            )}
                            <Box sx={{ flex: "1 1 auto" }} />
                            <Button
                              variant="outlined"
                              type="button"
                              onClick={() => {
                                resetForm();
                                props.resetForm();
                                props.setValues(props.initialValues);
                                props.setTouched({});
                                setClearData(true);
                                setInitialValues(initialValue);
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
