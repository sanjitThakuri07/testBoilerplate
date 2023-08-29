import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { Formik, FormikProps, Field } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { BASConfigTableProps, ResponseSetPropsS, TableValue } from "src/src/interfaces/configs";
import { useSnackbar, SnackbarKey, SnackbarMessage, OptionsObject } from "notistack";
import { InternalResponseSetValidationSchema } from "src/validationSchemas/InternalResponseSet";
import FullPageLoader from "src/components/FullPageLoader";
// import "./form.style.scss";
import { postApiData, fetchApI, fetchInitialValues } from "src/modules/apiRequest/apiRequest";
import { putApiData } from "src/modules/apiRequest/apiRequest";
import { useLocation } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import BASDataTableUpdate from "src/modules/table/BASDataTable";

import TableRow from "@mui/material/TableRow";
import { TextField } from "@mui/material";
import ModalLayout from "src/components/ModalLayout";
import { usePermissionStore } from "src/store/zustand/permission";
import { permissionList } from "src/constants/permission";
import { getAPI } from "src/lib/axios";
import SampleTable from "./SampleTable";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useTemplateStore } from "src/store/zustand/templates/templateStore";
import useRelationStore from "src/store/zustand/responseSet/relationResponse";

const TableCellCustom = ({
  index,
  selectedRow,
  setSelectedRow,
  data,
  moduleValues,
  setModuleValues,
  formikValues,
  internalResponseId,
  sampleData,
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

  return (
    <TableRow key={index}>
      <TableCell width="10%">
        {!internalResponseId && (
          <Checkbox
            color="primary"
            id={index}
            checked={selectedRow.includes(data?.module)}
            checkedIcon={<img src="/src/assets/icons/icon-check.svg" alt="check" />}
            icon={<img src="/src/assets/icons/icon-uncheck.svg" alt="uncheck" />}
            indeterminateIcon={
              <img src="/src/assets/icons/icon-check-remove.svg" alt="indeterminate" />
            }
            onChange={(event) => {
              setFieldValue(`tableValues.${index}.checked`, event.target.checked);
              if (event.target.checked) {
                setSelectedRow([...selectedRow, data?.module]);
                setFieldValue(`tableValues.${index}.status`, "Active");
                console.log({ data });
                setFieldValue(`tableValues.${index}.form_id`, data?.form_id);
              } else {
                setSelectedRow(selectedRow.filter((row: any) => row !== data?.module));
              }
            }}
            inputProps={{
              "aria-label": "select all ",
            }}
          />
        )}
      </TableCell>
      <TableCell>
        {/* {internalResponseId ? data?.variable_name : data?.module} */}
        {data?.variable_name || ""}
        {/* {sampleData.map((it: string, i: number) => it)} */}
      </TableCell>
      <TableCell>
        <TextField
          fullWidth
          placeholder="Display Name"
          className="text-area-region"
          size="small"
          name={`tableValues.${index}.name`}
          value={internalResponseId ? data?.name : values.tableValues?.[`${index}`]?.name}
          onChange={(event: any) => {
            setFieldValue(`tableValues.${index}.name`, event.target.value);
            setFieldValue(`tableValues.${index}.field`, data?.module);
            if (internalResponseId) {
              data.name = event.target.value;
            }
          }}
          disabled={selectedRow.indexOf(data?.module) === -1 && !internalResponseId}
          variant="outlined"
        />
      </TableCell>
      <TableCell>
        <Grid item xs={7} overflow={"hidden"}>
          <Select
            MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
            id={internalResponseId ? `tableValues.status` : `tableValues.${index}.status`}
            size="small"
            fullWidth
            placeholder="Active"
            onChange={(event: any) => {
              if (internalResponseId) {
                data.status = event.target.value;
                setFieldValue(`tableValues.status`, event?.target?.value);
              } else {
                setFieldValue(`tableValues.${index}.field`, data?.module);
                setFieldValue(`tableValues.${index}.status`, event.target.value);
              }
            }}
            onBlur={handleBlur}
            name={internalResponseId ? `tableValues.status` : `tableValues.${index}.status`}
            value={
              internalResponseId
                ? `${values?.tableValues?.status}`
                : `${values?.tableValues?.[index]?.status || "Active"}`
            }
            disabled={selectedRow.indexOf(data?.module) === -1 && !internalResponseId}
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
    </TableRow>
  );
};

const InternalResponseSetForm: React.FC<{
  proceedToNextPage?: Function;
  initial_data?: ResponseSetPropsS;
  moduleData2?: Array<ResponseSetPropsS>;
  isFormLoading?: boolean;
  setIsFormLoading?: Function;
  internalResponseId?: string | null;
  viewMode?: any;
}> = ({
  proceedToNextPage,
  initial_data,
  isFormLoading,
  setIsFormLoading,
  moduleData2,
  internalResponseId,
  viewMode,
}) => {
  // form initial values
  const [moduleData, setModuleData] = useState([]);

  const initialModulerValues: {
    module?: null | string | undefined;
    tableValues: any;
  } = {
    module: null,
    tableValues: [
      {
        status: 1,
        name: null,
        field: "",
        module_id: null,
      },
    ],
    // onChange : ()=>{},
  };
  const intialModuleData: Array<ResponseSetPropsS> = [];
  const [initialValues, setInitialValues] = useState<ResponseSetPropsS>(initialModulerValues);
  const [moduleValues, setModuleValues] = useState(moduleData2);
  const [tableData, setTableData] = useState([]);
  const [selectedRow, setSelectedRow] = useState<any[] | undefined>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [buttonLoader, setButtonLoader] = React.useState<boolean>(false);
  const formId = React.useRef(null);

  const { enqueueSnackbar } = useSnackbar();
  // const handleOpen = () => setOpen(true);
  const [disableEntireField, setDisableEntireField] = useState(false);
  const [sampleDataLoading, setSampleDataLoading] = useState(false);

  const { templates, getTemplates }: any = useTemplateStore();
  const { sampleData, fieldList, fetchRelationSampleData, fetchFieldList }: any =
    useRelationStore();

  const navigate = useNavigate();
  const param = useParams();

  const location = useLocation();

  const GetDatasAPi = async ({ contractorId }: any) => {
    let promises = [
      fetchApI({
        setterFunction: setTableData,
        url: "module/internal-response/",
        enqueueSnackbar,
      }),
    ];
    await Promise.all(promises);
  };

  const sampleDataItems = sampleData?.items?.map((item: any) => item)[0];
  const sampleDataItemsKeys = Object.keys(sampleDataItems ?? {});

  const GetModuleAPi = async (module_tag: any) => {
    setSelectedRow([]);
    setIsFormLoading?.(true);

    let promises = [
      fetchApI({
        setterFunction: setModuleValues,
        url: "relation-response/field-list",
        enqueueSnackbar,
        queryParam: module_tag,
      }),
    ];
    await Promise.all(promises);

    setIsFormLoading?.(false);
  };

  // fetching data for both with and without ids
  const fetchData = async ({ contractorId }: any) => {
    setIsFormLoading?.(true);
    await GetDatasAPi({ contractorId });
    setIsFormLoading?.(false);
  };

  useEffect(() => {
    fetchData({ internalResponseId: internalResponseId });
  }, [internalResponseId]);

  const submitHandler = async (values: any, actions: any, selectedRow: any) => {
    let final_data;
    if (internalResponseId) {
      let tableDataId: any = tableData.find((it: any) => {
        return it?.name === (values?.tableValues?.module || values?.tableValues?.[0]?.module);
      });
      final_data = values.tableValues?.[0]
        ? {
            field: values?.tableValues?.variable_name,
            module_id: tableDataId?.id,
            status: values?.tableValues?.[0]?.status ?? values?.tableValues?.status,
            name: values?.tableValues?.[0]?.name ?? values?.tableValues?.variable_name,
          }
        : {
            name: values?.tableValues?.name,
            module_id: tableDataId?.id,
            field: values?.tableValues?.variable_name,
            status: values?.tableValues?.status,
          };
      await putApiData({
        values: final_data,
        id: +internalResponseId,
        url: "internal-response",
        enqueueSnackbar: enqueueSnackbar,
        navigateTo: (id?: number) => navigate(-1),
        domain: "",
        setterLoading: setButtonLoader,
      });
    } else {
      // let table_data = values?.tableValues?.filter(
      //   (element: any) => element !== undefined && selectedRow.includes(element?.field),
      // );
      // final_data = table_data?.map(
      //   ({
      //     status,
      //     name,
      //     field,
      //   }: {
      //     status: number;
      //     name: string | null;
      //     field: string | null;
      //   }) => ({
      //     name: name ? name : "",
      //     module_id: values?.module?.id,
      //     field: field,
      //     status: status ? status : "Active",
      //   }),
      // );
      console.log({ values });
      await postApiData({
        // setterFunction: setSomeState,
        values: values?.tableValues?.map((data: any) => ({ ...data, checked: undefined })),
        // queryParam: { form_id: 6 },
        url: "/relation-response/",
        enqueueSnackbar: enqueueSnackbar,
        // navigateTo: (id: number) => navigate(`/config/global-response-set/internal`),
        domain: "",
        setterLoading: setButtonLoader,
      });
    }
  };

  const handleModelSelect = async (e: SelectChangeEvent<number | string>, data: any) => {
    formId.current = e.target.value.id;
    let promises = [
      fetchFieldList({ query: { form_id: e.target.value.id } }),
      fetchRelationSampleData({ query: { form_id: e.target.value.id, getAll: true } }),
    ];

    await Promise.all(promises);
  };

  const { permissions } = usePermissionStore();

  console.log("modeuleValues", moduleValues);

  function convertToKeysArray(keysArray: string[]) {
    return keysArray.map((key) => ({
      display_name: "", // Set the display_name as needed
      module: key,
      status: 1, // Set the status as needed
    }));
  }

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <div className={viewMode ? "enable-booking-component" : ""}>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values: ResponseSetPropsS, actions) => {
              let finalValue: any = {};
              let { name, id, field, ...attr }: any = values;
              finalValue = { ...attr };
              submitHandler(finalValue, actions, selectedRow);
            }}
            // validationSchema={InternalResponseSetValidationSchema}
          >
            {(props: FormikProps<ResponseSetPropsS>) => {
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
              } = props;

              let duplicateValue: any = values;
              let selectValue: number = duplicateValue.tableValues.module_id;

              console.log({ values });

              return (
                <>
                  {isFormLoading && <FullPageLoader />}
                  <>
                    <div
                      className="tenant-page-container"
                      style={{
                        margin: "-30px 0 ",
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        padding: "10px",
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
                        {/* variables  */}
                        <Grid container spacing={4} className="formGroupItem">
                          <Grid item xs={3}>
                            <InputLabel htmlFor="Select a Table">
                              <div className="label-subheading  align__label">
                                Select a Table <sup>*</sup>
                              </div>
                            </InputLabel>
                          </Grid>
                          <Grid item xs={7}>
                            {param.internalResponseId ? (
                              <>
                                <Select
                                  MenuProps={{
                                    PaperProps: { style: { maxHeight: 200 } },
                                  }}
                                  name="module"
                                  displayEmpty
                                  id="module"
                                  size="small"
                                  fullWidth
                                  data-testid="module"
                                  placeholder="Select Module here"
                                  autoComplete="off"
                                  disabled={disableEntireField}
                                  value={Number(selectValue)}
                                  error={errors?.module && touched?.module ? true : false}
                                  onChange={(e, data) => {
                                    setSelectedRow([]);
                                    setModuleValues(intialModuleData);
                                    setInitialValues({
                                      ...initialValues,
                                      tableValues: [],
                                    });
                                    handleChange(e);
                                    handleModelSelect(e, data);
                                  }}
                                  onBlur={handleBlur}
                                >
                                  {tableData?.map((item: any, index: number) => (
                                    <MenuItem
                                      key={index}
                                      value={item.id}
                                      disabled={internalResponseId ? true : false}
                                    >
                                      {item.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </>
                            ) : (
                              <>
                                <Select
                                  MenuProps={{
                                    PaperProps: { style: { maxHeight: 200 } },
                                  }}
                                  name="module"
                                  displayEmpty
                                  id="module"
                                  size="small"
                                  fullWidth
                                  data-testid="module"
                                  placeholder="Select Module here"
                                  autoComplete="off"
                                  disabled={disableEntireField}
                                  value={values?.module || ""}
                                  error={errors?.module && touched?.module ? true : false}
                                  onChange={(e, data) => {
                                    setSelectedRow([]);
                                    setModuleValues(intialModuleData);
                                    setInitialValues({
                                      ...initialValues,
                                      tableValues: [],
                                    });
                                    handleChange(e);
                                    handleModelSelect(e, data);
                                  }}
                                  onBlur={handleBlur}
                                >
                                  {templates?.map((item: any, index: number) => (
                                    <MenuItem
                                      key={index}
                                      value={item}
                                      disabled={internalResponseId ? true : false}
                                    >
                                      {item.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </>
                            )}

                            {errors?.module && touched?.module && (
                              <div className="input-feedback" style={{ color: "red" }}>
                                {errors?.module}
                              </div>
                            )}
                          </Grid>
                          <Grid item xs={2}>
                            {values?.module && !internalResponseId && (
                              <Button
                                variant="outlined"
                                startIcon={
                                  openModal ? (
                                    <VisibilityOffOutlinedIcon />
                                  ) : (
                                    <VisibilityOutlinedIcon />
                                  )
                                }
                                onClick={() => {
                                  setOpenModal(!openModal);
                                }}
                                style={{
                                  float: "right",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {openModal ? <> Sample Data </> : <> Sample Data</>}
                              </Button>
                            )}
                          </Grid>
                        </Grid>
                      </Box>
                    </div>

                    {openModal && (
                      <Box
                        sx={{
                          marginBottom: "30px",
                          transform: "scale(0.9)",
                        }}
                      >
                        <SampleTable format={sampleData} />
                      </Box>
                    )}

                    {values?.module && (
                      <>
                        <Typography variant="h3" style={{ padding: "10px" }}>
                          Showing Results
                        </Typography>
                        <TableContainer>
                          <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                              <TableCell style={{ minWidth: 10 }}>
                                {!internalResponseId && (
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
                                          moduleValues?.map(
                                            (data: any, index: any) => data?.module,
                                          ),
                                        );
                                      } else {
                                        setSelectedRow([]);
                                      }
                                    }}
                                  />
                                )}
                              </TableCell>
                              <TableCell style={{ minWidth: 10 }}>Variable Name</TableCell>
                              <TableCell style={{ minWidth: 10 }}>
                                <div className="label-heading  align__label">
                                  Display Name <sup>*</sup>
                                </div>
                              </TableCell>
                              <TableCell style={{ minWidth: 10 }}>Status</TableCell>
                            </TableHead>
                            <TableBody>
                              {(() => {
                                let keys = Object.keys(fieldList || {}) || [];
                                let makeValue: any = keys?.map((key) => {
                                  return {
                                    display_name: fieldList?.[key], // Set the display_name as needed
                                    module: key,
                                    status: 1,
                                    variable_name: fieldList?.[key],
                                    form_id: formId?.current,
                                  };
                                });

                                console.log({ makeValue });

                                return (
                                  <>
                                    {makeValue?.map((data: any, index: any) => {
                                      return (
                                        <TableCellCustom
                                          key={data?.id}
                                          index={index}
                                          sampleData={sampleDataItemsKeys}
                                          selectedRow={selectedRow}
                                          setSelectedRow={setSelectedRow}
                                          data={data}
                                          moduleValues={moduleValues}
                                          setModuleValues={setModuleValues}
                                          formikValues={props}
                                          internalResponseId={internalResponseId}
                                        />
                                      );
                                    })}
                                  </>
                                );
                              })()}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </>
                    )}
                    <React.Fragment>
                      {/* {(selectedRow?.length && selectedRow?.length >0)  || internalResponseId && ( */}
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
                        {!internalResponseId && (
                          <Button
                            variant="outlined"
                            type="button"
                            onClick={() => {
                              props.resetForm();
                              props.setValues(props.initialValues);
                              props.setTouched({});
                              setInitialValues(initialModulerValues);
                            }}
                            sx={{ mr: 1 }}
                          >
                            Clear All
                          </Button>
                        )}
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
                          {internalResponseId ? "Update" : "Save"} & Proceed
                          {buttonLoader && (
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

export default InternalResponseSetForm;
