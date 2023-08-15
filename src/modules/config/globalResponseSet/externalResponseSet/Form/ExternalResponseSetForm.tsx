import {
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import FullPageLoader from "src/components/FullPageLoader";
import { Formik, FormikProps } from "formik";
import { ExternalConnectionProps } from "src/interfaces/configs";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ExternalResponseSetValidationSchema } from "src/validationSchemas/ExternalResponseSet";
import { authenticate_data, fetchApI, postApiData, putApiData } from "./apiRequest";
import "./form.style.scss";

import { TextField } from "@mui/material";
import TableRow from "@mui/material/TableRow";
import { usePayloadHook } from "src/constants/customHook/payloadOptions";
import { deleteAPiData } from "src/modules/apiRequest/apiRequest";

const TableCellCustom = ({
  index,
  selectedRow,
  setSelectedRow,
  data,
  moduleValues,
  setModuleValues,
  formikValues,
  externalResponseId,
  apiId,
  isEdit = false,
}: any) => {
  const {
    values,
    touched,
    errors,
    handleBlur,
    handleSubmit,
    handleChange,
    validateOnChange,
    setFieldValue,
    setFieldTouched,
    isSubmitting,
    initialTouched,
  } = formikValues;
  const [options, setOptions] = useState(["Active", "Inactive"]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  return (
    <TableRow key={index}>
      {!externalResponseId || isEdit ? (
        <TableCell width="10%">
          <Checkbox
            color="primary"
            id={index}
            checked={selectedRow.includes(data)}
            checkedIcon={<img src="/src/assets/icons/icon-check.svg" alt="check" />}
            icon={<img src="/src/assets/icons/icon-uncheck.svg" alt="uncheck" />}
            indeterminateIcon={
              <img src="/src/assets/icons/icon-check-remove.svg" alt="indeterminate" />
            }
            onChange={(event) => {
              setFieldValue(`tableValues.${index}.checked`, event.target.checked);
              setFieldValue(`tableValues.${index}.api_id`, apiId);
              if (event.target.checked) {
                setSelectedRow([...selectedRow, data]);
                setFieldValue(`tableValues.${index}.status`, "Active");
              } else {
                setSelectedRow(selectedRow.filter((row: any) => row !== data));
              }
            }}
            inputProps={{
              "aria-label": "select all ",
            }}
          />
        </TableCell>
      ) : (
        <></>
      )}
      {(!externalResponseId || isEdit) && (
        <>
          <TableCell>{data}</TableCell>
          <TableCell>
            <TextField
              fullWidth
              required
              placeholder=""
              className="text-area-region"
              size="small"
              name={`tableValues.${index}.name`}
              value={values.tableValues?.[`${index}`]?.name}
              onChange={(event: any) => {
                setFieldValue(`tableValues.${index}.name`, event.target.value);
                setFieldValue(`tableValues.${index}.field`, data);
              }}
              disabled={selectedRow.indexOf(data) === -1 && (!externalResponseId || isEdit)}
              variant="outlined"
            />
          </TableCell>

          <TableCell>
            <Grid item xs={7} overflow={"hidden"}>
              <Select
                MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                id={`tableValues.${index}.status`}
                size="small"
                fullWidth
                placeholder="Active"
                onChange={(event: any) => {
                  setFieldValue(`tableValues.${index}.status`, event.target.value);
                }}
                onBlur={handleBlur}
                name={`tableValues.${index}.status`}
                value={values.tableValues?.[`${index}`]?.status || "Active"}
                disabled={selectedRow.indexOf(data) === -1 && (!externalResponseId || isEdit)}
                error={Boolean(touched?.status && errors?.status)}
              >
                {options?.map((status: any) => (
                  <MenuItem key={status} value={`${status}`}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </TableCell>
        </>
      )}
      {externalResponseId && !isEdit && (
        <>
          <TableCell>{data?.field}</TableCell>
          <TableCell>
            <TextField
              fullWidth
              placeholder=""
              className="text-area-region"
              size="small"
              name={`tableValues.${index}.name`}
              value={externalResponseId ? data?.name : values.tableValues?.[`${index}`]?.name}
              onChange={(event: any) => {
                setFieldValue(`tableValues.${index}.name`, event.target.value);
                setFieldValue(`tableValues.${index}.field`, data);
                if (externalResponseId) {
                  data.name = event.target.value;
                }
              }}
              disabled={selectedRow.indexOf(data) === -1 && !externalResponseId}
              variant="outlined"
            />
          </TableCell>

          <TableCell>
            <Grid item xs={7} overflow={"hidden"}>
              <Select
                MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                id={`tableValues.${index}.status`}
                size="small"
                fullWidth
                placeholder="Active"
                onChange={(event: any) => {
                  setFieldValue(`tableValues.${index}.status`, event.target.value);
                  if (externalResponseId) {
                    data.status = event.target.value;
                  }
                }}
                onBlur={handleBlur}
                name={`tableValues.${index}.status`}
                value={externalResponseId ? data?.status : values.tableValues?.[`${index}`]?.status}
                disabled={selectedRow.indexOf(data) === -1 && !externalResponseId}
                error={Boolean(touched?.status && errors?.status)}
              >
                {options?.map((status: any) => (
                  <MenuItem key={status} value={`${status}`}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </TableCell>
          {externalResponseId && (
            <TableCell>
              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="outlined"
                  color="success"
                  onClick={async () => {
                    let values = { ...data };
                    await putApiData({
                      values,
                      id: data?.id,
                      enqueueSnackbar: enqueueSnackbar,
                      url: "external-response",
                      domain: "external-response",
                      setterLoading: setLoading,
                    });
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={async () => {
                    let values = [data?.id];
                    await deleteAPiData({
                      values,
                      id: data?.id,
                      enqueueSnackbar: enqueueSnackbar,
                      url: "external-response/",
                      setterLoading: setLoading,
                      setterFunction: (datas: any) => {
                        setModuleValues?.((prev: any) => {
                          return prev?.filter((item: any) => item?.id !== data?.id);
                        });
                      },
                    });
                  }}
                >
                  Delete
                </Button>
              </Stack>
            </TableCell>
          )}
        </>
      )}
    </TableRow>
  );
};

const ExternalResponseSetForm: React.FC<{
  proceedToNextPage?: Function;
  initial_data?: ExternalConnectionProps;
  isFormLoading?: boolean;
  setIsFormLoading?: Function;
  externalResponseId?: string | null;
  apiRef: number | undefined;
  viewMode?: any;
}> = ({
  proceedToNextPage,
  initial_data,
  isFormLoading,
  setIsFormLoading,
  externalResponseId,
  apiRef,
  viewMode,
}) => {
  // form initial values
  const [options, setOptions] = useState(["Active", "Inactive"]);
  const [options_http, setOptionsHttp] = useState(["https", "http"]);
  const [moduleValues, setModuleValues] = useState([]);
  const [moduleNewValues, setModuleNewValues] = useState([]);
  const [auth, isAuth] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [totalCount, setTotalCount] = React.useState(0);

  const initialModulerValues: ExternalConnectionProps = {
    api: "",
    token: "",
    display_name: "",
    status: "Active",
    authenticated: false,
    tableValues: [],
    api_header: "https",
  };
  const [initialValues, setInitialValues] = useState<ExternalConnectionProps>(initialModulerValues);
  const [selectedRow, setSelectedRow] = useState<any[] | undefined>([]);
  const [apiId, setAPIID] = useState(apiRef);
  const { enqueueSnackbar } = useSnackbar();
  const [disableEntireField, setDisableEntireField] = useState(false);
  const [ExternalResponseSetData, setExternalResponseSetData] = React.useState<any>({
    items: [],
    headers: [],
    page: 1,
    pages: 1,
    size: 5,
    total: 0,
    archivedCount: 0,
  });
  const navigate = useNavigate();
  const handleReset = () => {};
  // Get the current location object
  const location = useLocation();
  const [urlUtils, setUrlUtils] = usePayloadHook();
  useEffect(() => {
    if (externalResponseId) {
      getData();
    }
  }, [externalResponseId]);

  useEffect(() => {
    if (initial_data) {
      setInitialValues(initial_data);
    }

    if (ExternalResponseSetData?.length > 0) {
      setModuleValues(ExternalResponseSetData);
    }

    if (apiRef) {
      setAPIID(apiRef);
    }
  }, [initial_data, ExternalResponseSetData]);

  const getData = async () => {
    setLoading(true);
    await fetchApI({
      setterFunction: setExternalResponseSetData,
      url: `external-response/app/${externalResponseId}/`,
    });
    setLoading(false);
  };

  const submitHandler = async (values: any, actions: any, selectedRow: any) => {
    let final_data;
    if (externalResponseId) {
      let table_data = values?.tableValues?.filter((element: any) => element?.checked === true);
      const newData = table_data?.map((d: any) => {
        return {
          ...d,
          api_id: Number(externalResponseId),
        };
      });
      // for server level
      let data_t = {
        name: values?.display_name,
        api: values?.api_header + "://" + values?.api,
        api_token: values?.token,
        status: values?.status,
      };
      putApiData({
        values: data_t,
        id: +externalResponseId,
        url: "external-api",
        enqueueSnackbar: enqueueSnackbar,
        navigateTo: (id?: number) => navigate(`/config/global-response-set/external`),
        domain: "GlobalResponseSet",
        setterLoading: setIsFormLoading,
      });
      if (newData?.length > 0) {
        await postApiData({
          values: newData,
          url: "/external-response/",
          enqueueSnackbar: enqueueSnackbar,
          navigateTo: (id: number) => navigate(`/config/global-response-set/external`),
          domain: "GlobalResponseSet",
          setterLoading: setIsFormLoading,
        });
      }
    } else {
      let table_data = values?.tableValues?.filter((element: any) => element?.checked === true);
      final_data = table_data?.map(
        ({
          status,
          name,
          field,
        }: {
          status: number;
          name: string | null;
          field: string | null;
        }) => ({
          name: name ? name : "",
          field: field,
          status: status ? status : "Active",
          api_id: values?.apiId ? values?.apiID : apiId,
        }),
      );
      await postApiData({
        values: table_data,
        url: "/external-response/",
        enqueueSnackbar: enqueueSnackbar,
        navigateTo: (id: number) => navigate(`/config/global-response-set/external`),
        domain: "GlobalResponseSet",
        setterLoading: setIsFormLoading,
      });
    }
  };

  const authenticateData = async (data: ExternalConnectionProps) => {
    let final_data = {
      name: data?.display_name ? data?.display_name : "",
      token: data?.token ? data?.token : "",
      status: data?.status ? data?.status : "Active",
    };

    let final_data_external = {
      name: data?.display_name ? data?.display_name : "",
      api: data?.api ? data?.api_header + "://" + data?.api : "",
      api_token: data?.token ? data?.token : "",
      status: data?.status ? data?.status : "Active",
    };

    await authenticate_data({
      values: final_data,
      setterFunction: (data: any) => {
        if (externalResponseId) {
          setModuleNewValues(data);
        } else {
          setModuleValues(data);
        }
        isAuth(() => true);
      },
      url: data?.api_header + "://" + data?.api,
      enqueueSnackbar: enqueueSnackbar,
      setterLoading: setIsFormLoading,
      setAPIID: setAPIID,
      final_data_external: final_data_external,
      setter: setInitialValues,
      initial: data,
      id: Number(externalResponseId),
    });
  };

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <div className={viewMode ? "enable-booking-component" : ""}>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values: ExternalConnectionProps, actions) => {
              let finalValue: any = {};
              let { name, id, field, ...attr }: any = values;
              finalValue = { ...attr };
              submitHandler(finalValue, actions, selectedRow);
            }}
            validationSchema={ExternalResponseSetValidationSchema}
          >
            {(props: FormikProps<ExternalConnectionProps>) => {
              const {
                values,
                touched,
                errors,
                handleBlur,
                handleSubmit,
                handleChange,
                validateOnChange,
                setFieldValue,
                setFieldTouched,
                isSubmitting,
                initialTouched,
                validateForm,
              } = props;

              return (
                <>
                  {isFormLoading && <FullPageLoader />}
                  <>
                    <div
                      className="tenant-page-container"
                      style={{
                        margin: "40px 0",
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        padding: "10px 10px",
                      }}
                    >
                      <Box
                        borderTop={"none"}
                        className="setting-form-group"
                        sx={{
                          width: "90%",
                        }}
                      >
                        {/* variables  */}
                        <Grid container spacing={4} className="formGroupItem">
                          <Grid item xs={4}>
                            <InputLabel htmlFor="Select a Table">
                              <div className="label-subheading  align__label">
                                API <sup>*</sup>
                              </div>
                            </InputLabel>
                          </Grid>
                          <Grid item xs={7}>
                            <TextField
                              fullWidth
                              value={values?.api}
                              onChange={(event) => handleChange(event)}
                              name={"api"}
                              InputProps={{
                                startAdornment: (
                                  <Select
                                    variant="standard"
                                    disableUnderline={true}
                                    value={values.api_header}
                                    onChange={(event) => {
                                      setFieldValue("api_header", event.target.value);
                                    }}
                                    style={{
                                      border: "none",
                                      boxShadow: "none",
                                    }}
                                  >
                                    {options_http?.map((status: any) => (
                                      <MenuItem key={status} value={`${status}`}>
                                        {status}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                ),
                              }}
                            />
                            {errors?.api && touched?.api && (
                              <div className="input-feedback" style={{ color: "red" }}>
                                {errors?.status}
                              </div>
                            )}
                          </Grid>
                        </Grid>
                        <Grid container spacing={4} className="formGroupItem">
                          <Grid item xs={4}>
                            <InputLabel htmlFor="API TOKEN">
                              <div className="label-subheading  align__label">
                                API Token<sup>*</sup>
                              </div>
                            </InputLabel>
                          </Grid>
                          <Grid item xs={7}>
                            <TextField
                              fullWidth
                              placeholder=""
                              className="text-area-region"
                              size="small"
                              name="token"
                              value={values?.token}
                              onChange={handleChange}
                            />
                            {errors?.token && touched?.token && (
                              <div className="input-feedback" style={{ color: "red" }}>
                                {errors?.token}
                              </div>
                            )}
                          </Grid>
                        </Grid>
                        <Grid container spacing={4} className="formGroupItem">
                          <Grid item xs={4}>
                            <InputLabel htmlFor="Select a Table">
                              <div className="label-subheading  align__label">
                                API Display Name<sup>*</sup>
                              </div>
                            </InputLabel>
                          </Grid>
                          <Grid item xs={7}>
                            <TextField
                              fullWidth
                              placeholder=""
                              className="text-area-region"
                              size="small"
                              name="display_name"
                              value={values?.display_name}
                              onChange={handleChange}
                            />
                            {errors?.display_name && touched?.display_name && (
                              <div className="input-feedback" style={{ color: "red" }}>
                                {errors?.display_name}
                              </div>
                            )}
                          </Grid>
                        </Grid>
                        <Grid container spacing={4} className="formGroupItem">
                          <Grid item xs={4}>
                            <InputLabel htmlFor="Select a Table">
                              <div className="label-subheading  align__label">
                                Status<sup>*</sup>
                              </div>
                            </InputLabel>
                          </Grid>
                          <Grid item xs={7}>
                            <Select
                              name="status"
                              fullWidth
                              value={values?.status}
                              onChange={handleChange}
                            >
                              {options?.map((status: any) => (
                                <MenuItem key={status} value={`${status}`}>
                                  {status}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors?.status && touched?.status && (
                              <div className="input-feedback" style={{ color: "red" }}>
                                {errors?.status}
                              </div>
                            )}
                          </Grid>
                        </Grid>
                      </Box>
                    </div>
                    {/* {externalResponseId && (
                      <>
                        <ViewExternalResponse externalResponseId={externalResponseId} />
                      </>
                    )} */}
                    {true && (
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
                          {!auth && (
                            <Button
                              type="submit"
                              variant="contained"
                              // disabled={isSubmitting ? true : false}
                              // isSubmitting={isSubmitting}
                              onClick={() => {
                                // validateForm().then(() => {
                                authenticateData(values);
                                // });
                              }}
                              sx={{ mr: 1 }}
                            >
                              Authenticate
                              {isFormLoading && (
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
                    )}
                    {typeof moduleNewValues === "object" && auth && externalResponseId && (
                      <>
                        <Typography variant="h3" style={{ padding: "10px" }}>
                          Unsaved Fields
                        </Typography>
                        <TableContainer>
                          <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                              <TableCell style={{ minWidth: 10 }}>
                                <Checkbox
                                  color="primary"
                                  checked={selectedRow?.length === moduleValues?.length}
                                  checkedIcon={
                                    <img src="/src/assets/icons/icon-check.svg" alt="check" />
                                  }
                                  icon={
                                    <img src="/src/assets/icons/icon-uncheck.svg" alt="uncheck" />
                                  }
                                  indeterminateIcon={
                                    <img
                                      src="/src/assets/icons/icon-check-remove.svg"
                                      alt="indeterminate"
                                    />
                                  }
                                  // onChange={onSelectAllClick}
                                  inputProps={{
                                    "aria-label": "select all desserts",
                                  }}
                                  onChange={(event) => {
                                    if (event.target.checked) {
                                      setSelectedRow(
                                        Object.keys(moduleValues)?.map(
                                          (data: any, index: any) => data,
                                        ),
                                      );
                                    } else {
                                      setSelectedRow([]);
                                    }
                                  }}
                                />
                              </TableCell>

                              <TableCell style={{ minWidth: 10 }}>External Name</TableCell>
                              <TableCell style={{ minWidth: 10 }}>
                                <div className="label-heading  align__label">
                                  Display Name <sup>*</sup>
                                </div>
                              </TableCell>
                              <TableCell style={{ minWidth: 10 }}>Status</TableCell>
                            </TableHead>

                            <TableBody>
                              {Object.keys(moduleNewValues)
                                ?.filter(
                                  (d) =>
                                    !moduleValues.some(
                                      (moduleValue: any) => moduleValue?.field === d,
                                    ),
                                )
                                ?.map((data: any, index: any) => {
                                  return (
                                    <TableCellCustom
                                      key={data}
                                      index={index}
                                      selectedRow={selectedRow}
                                      setSelectedRow={setSelectedRow}
                                      data={data}
                                      moduleValues={moduleValues}
                                      setModuleValues={setModuleValues}
                                      formikValues={props}
                                      externalResponseId={externalResponseId}
                                      apiId={apiId}
                                      isEdit={true}
                                    />
                                  );
                                })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </>
                    )}

                    {((moduleValues && auth) || (moduleValues && externalResponseId)) && (
                      <>
                        <Typography variant="h3" style={{ padding: "10px" }}>
                          Showing Results
                        </Typography>
                        <TableContainer>
                          <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                              {!externalResponseId && (
                                <TableCell style={{ minWidth: 10 }}>
                                  <Checkbox
                                    color="primary"
                                    checked={selectedRow?.length === moduleValues?.length}
                                    checkedIcon={
                                      <img src="/src/assets/icons/icon-check.svg" alt="check" />
                                    }
                                    icon={
                                      <img src="/src/assets/icons/icon-uncheck.svg" alt="uncheck" />
                                    }
                                    indeterminateIcon={
                                      <img
                                        src="/src/assets/icons/icon-check-remove.svg"
                                        alt="indeterminate"
                                      />
                                    }
                                    // onChange={onSelectAllClick}
                                    inputProps={{
                                      "aria-label": "select all desserts",
                                    }}
                                    onChange={(event) => {
                                      if (event.target.checked) {
                                        setSelectedRow(
                                          Object.keys(moduleValues)?.map(
                                            (data: any, index: any) => data,
                                          ),
                                        );
                                      } else {
                                        setSelectedRow([]);
                                      }
                                    }}
                                  />
                                </TableCell>
                              )}
                              <TableCell style={{ minWidth: 10 }}>External Name</TableCell>
                              <TableCell style={{ minWidth: 10 }}>
                                <div className="label-heading  align__label">
                                  Display Name <sup>*</sup>
                                </div>
                              </TableCell>
                              <TableCell style={{ minWidth: 10 }}>Status</TableCell>
                              {externalResponseId && (
                                <TableCell style={{ minWidth: 10 }}>Action</TableCell>
                              )}
                            </TableHead>

                            {externalResponseId && (
                              <TableBody>
                                {moduleValues?.map((data: any, index: any) => {
                                  return (
                                    <TableCellCustom
                                      key={data}
                                      index={index}
                                      selectedRow={selectedRow}
                                      setSelectedRow={setSelectedRow}
                                      data={data}
                                      moduleValues={moduleValues}
                                      setModuleValues={setModuleValues}
                                      formikValues={props}
                                      externalResponseId={externalResponseId}
                                      apiId={apiId}
                                    />
                                  );
                                })}
                              </TableBody>
                            )}
                            {!externalResponseId && typeof moduleValues === "object" && (
                              <TableBody>
                                {Object.keys(moduleValues)?.map((data: any, index: any) => {
                                  return (
                                    <TableCellCustom
                                      key={data}
                                      index={index}
                                      selectedRow={selectedRow}
                                      setSelectedRow={setSelectedRow}
                                      data={data}
                                      moduleValues={moduleValues}
                                      setModuleValues={setModuleValues}
                                      formikValues={props}
                                      externalResponseId={externalResponseId}
                                      apiId={apiId}
                                      isEdit={true}
                                    />
                                  );
                                })}
                              </TableBody>
                            )}
                          </Table>
                        </TableContainer>
                      </>
                    )}
                    <React.Fragment>
                      {/* {(selectedRow?.length && selectedRow?.length >0)  || externalResponseId && ( */}

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
                          variant="outlined"
                          onClick={() => {
                            navigate(-1);
                          }}
                          sx={{ mr: 1 }}
                        >
                          Cancel
                        </Button>

                        <Button
                          type="submit"
                          variant="contained"
                          // disabled={isSubmitting ? true : false}
                          // isSubmitting={isSubmitting}
                          onClick={() => {
                            setInitialValues(values);
                            handleSubmit();
                          }}
                          sx={{ mr: 1 }}
                        >
                          {externalResponseId ? "Update" : "Save"} & Proceed
                          {isFormLoading && (
                            <CircularProgress
                              color="inherit"
                              size={18}
                              sx={{ marginLeft: "10px" }}
                            />
                          )}
                        </Button>
                      </Box>
                      {/* )} */}
                    </React.Fragment>
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

export default ExternalResponseSetForm;
