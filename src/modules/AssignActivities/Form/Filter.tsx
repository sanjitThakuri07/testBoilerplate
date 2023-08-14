import {
  Button,
  Container,
  Divider,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { getAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import FilterTabs from "./FilterTabs";
import moment from "moment";
import { Field, Formik, FormikProps } from "formik";
import { fetchApI, fetchIndividualApi } from "src/modules/apiRequest/apiRequest";

export const AssigneesField = ({
  label,
  fieldName,
  initValues,
  dropdownData = [],
  keyName,
  setValues,
  setPresentFilter,
  filterValues,
  setFilterModal,
  filterObj,
}: any) => {
  return (
    <Formik
      initialValues={initValues}
      enableReinitialize
      onSubmit={async (values, formikHelpers) => {
        setValues?.(values);
        const status = Object.keys(values || {})?.some((key) => values?.[key]?.length);
        setPresentFilter?.(status);

        // const assigneeQuery = values?.users?.map((it: any) => `assignees=${it}`).join('&');
        // const inspectionQuery = values?.inspection?.map((it: any) => `inspection=${it}`).join('&');

        // const statusQuery = `status= ${values?.status}`;
        // // const due_dateQuery = `due_date=${values?.due_date}`;
        // const due_dateQuery = `due_date=${moment(values?.due_date).format('YYYY-MM-DD')}` || '';

        // const departmentQuery: any = values?.user_department
        //   ?.map((it: any) => `user_dept=${it}`)
        //   .join('&');
        // let filterValue = !values?.due_date ? '' : values?.due_date;

        // const query = filterValue
        //   ? [assigneeQuery, departmentQuery, inspectionQuery, statusQuery, due_dateQuery]
        //       .filter(Boolean)
        //       .join('&')
        //   : [assigneeQuery, departmentQuery, inspectionQuery, statusQuery]
        //       .filter(Boolean)
        //       .join('&');
        // filterValues?.({ key: 'filterQuery', value: query });
        const querys: { query: string; formValues: any } = Object.entries(values || {})?.reduce(
          (acc: any, [key, value]: any) => {
            if (Array.isArray(value)) {
              if (value?.length > 0) {
                let subQuery = value.reduce((acc: any, curr: any) => {
                  return (acc = acc + `${key}=${curr}&`);
                }, "");
                acc.query += `${subQuery}`;
              }
            } else if (value instanceof Date || key === "due_date") {
              acc.query += `${key}=${value === null ? "" : moment(value).format("YYYY-MM-DD")}&`;
            } else if ((value?.length > 0 || typeof value === "number") && key !== "due_date") {
              acc.query += `${key}=${value || ""}&`;
            }

            const getValue = Array.isArray(value)
              ? (initValues[key]?.options || []).filter((it: any) => value.includes(it.id))
              : value || "";

            acc.formValues = {
              ...(acc.formValues || {}),
              [key]: {
                ...(acc.formValues?.[key] || {}),
                ...(initValues[key] || {}),
                value: getValue,
              },
            };

            return acc;
          },
          {
            query: "",
            formValues: {},
          },
        );
        filterValues((prev: any) => ({ ...prev, filterQuery: querys?.query }));
        filterObj?.setFilterValue({ ...querys?.formValues });
        setFilterModal?.(false);
      }}
    >
      {(props: FormikProps<any>) => {
        const {
          values,
          touched,
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isValid,
          dirty,
          isSubmitting,
          setFieldValue,
          setFieldTouched,
        } = props;

        return (
          <Grid container flexDirection="row" alignItems="center" spacing={2}>
            {fieldName !== "created_by&modified_by" && (
              <Grid item xs={3}>
                <InputLabel htmlFor={fieldName}>
                  <div className="label-heading">{label}</div>
                </InputLabel>
              </Grid>
            )}
            {fieldName === "status" && (
              <Grid item xs={6}>
                <Select
                  MenuProps={{
                    PaperProps: { style: { maxHeight: 200 } },
                  }}
                  sx={{ overflow: "hidden" }}
                  id="status"
                  size="small"
                  fullWidth
                  placeholder="Active"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="status"
                  value={values?.status}
                >
                  {dropdownData?.map((item: any, index: number) => (
                    <MenuItem value={item.id} key={item.id}>
                      {item?.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            )}
            {fieldName === "inspected_by" && (
              <Grid item xs={6}>
                <Select
                  MenuProps={{
                    PaperProps: { style: { maxHeight: 200 } },
                  }}
                  multiple
                  id="inspected_by"
                  size="small"
                  fullWidth
                  placeholder="Active"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="inspection"
                  value={values.inspection || []}
                  renderValue={(val: any) => {
                    const fullNames = val.map((id: any) => {
                      const assignee = dropdownData.find((item: any) => item.id === id);
                      return assignee ? assignee.full_name : "";
                    });
                    return fullNames.join(", ");
                  }}
                >
                  {dropdownData?.map((item: any, index: number) => {
                    return (
                      <MenuItem key={item?.id} value={item?.id}>
                        {item?.full_name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>
            )}
            {fieldName === "due_date" ? (
              <Grid item xs={9}>
                <FormGroup className="input-holder __date__time">
                  <input
                    id={fieldName}
                    type="datetime-local"
                    placeholder=""
                    name={fieldName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    // value={values.due_date}
                    value={moment(values?.[`${fieldName}`]).format("YYYY-MM-DDTHH:mm")}
                    style={{ fontFamily: "Inter" }}
                  />
                </FormGroup>
              </Grid>
            ) : (
              fieldName === "created_by&modified_by" &&
              [...fieldName.split("&")].map((item: any, index: number) => (
                <React.Fragment key={index}>
                  <Grid item xs={3}>
                    {(() => {
                      return <></>;
                    })()}
                    <InputLabel htmlFor={item}>
                      <div className="label-heading" style={{ textTransform: "capitalize" }}>
                        {item?.replace("_", " ")}
                      </div>
                    </InputLabel>
                  </Grid>
                  <Grid item xs={9}>
                    <Grid className="input-holder">
                      <Select
                        MenuProps={{
                          PaperProps: { style: { maxHeight: 200 } },
                        }}
                        id={item}
                        sx={{ overflow: "hidden" }}
                        size="small"
                        fullWidth
                        placeholder="Active"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name={item}
                        value={values?.[`${item}`] || ""}
                        renderValue={(val: any) => {
                          const fullNames = dropdownData.find((item: any) => item.id === val);
                          return fullNames?.full_name;
                        }}
                      >
                        {dropdownData.map((item: any, index: number) => (
                          <MenuItem key={item?.id} value={item?.id}>
                            {values?.[`${item}`]?.map((it: any) => it?.id).includes(item.id) &&
                              "active"}
                            {item.full_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                  </Grid>
                </React.Fragment>
              ))
            )}{" "}
            {fieldName === "users" && (
              <Grid item xs={6}>
                <Grid className="input-holder">
                  <Select
                    MenuProps={{
                      PaperProps: { style: { maxHeight: 200 } },
                    }}
                    multiple
                    id="assignees"
                    size="small"
                    fullWidth
                    placeholder="Active"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="assignees"
                    value={values.assignees || []}
                    renderValue={(val: any) => {
                      const fullNames = val.map((id: any) => {
                        const assignee = dropdownData.find((item: any) => item.id === id);
                        return assignee ? assignee.full_name : "";
                      });
                      return fullNames.join(", ");
                    }}
                  >
                    {dropdownData?.map((item: any, index: number) => {
                      return (
                        <MenuItem key={item?.id} value={item?.id}>
                          {item?.full_name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </Grid>
              </Grid>
            )}{" "}
            {fieldName === "user_department" && (
              <Grid item xs={6}>
                <Select
                  MenuProps={{
                    PaperProps: { style: { maxHeight: 200 } },
                  }}
                  sx={{ overflow: "hidden" }}
                  multiple
                  id="user_department"
                  size="small"
                  fullWidth
                  placeholder="Active"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="user_dept"
                  value={values.user_dept}
                  renderValue={(val: any[]) => {
                    let newVal = val.map((it: any) => Number(it));
                    const matchedValues = dropdownData
                      ?.filter((item: any) => newVal.includes(item?.id))
                      ?.map((value: any) => value.name)
                      ?.join(",");

                    return matchedValues;
                  }}
                >
                  {dropdownData?.map((item: any, index: number) => (
                    <MenuItem key={item?.id} value={item?.id}>
                      {item?.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            )}
            <div className="">
              <Grid container spacing={2} justifyContent="flex-end" padding={"10px 20px"}>
                <Grid item>
                  <Button variant="outlined" onClick={() => {}}>
                    Reset All
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    type="submit"
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    Apply
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Grid>
        );
      }}
    </Formik>
  );
};

const Filter = ({
  filterValues,
  values,
  setValues,
  setPresentFilter,
  setFilterModal,
  filterObj,
}: any) => {
  const [activeFilter, setActiveFilter] = React.useState<string>("");
  const [loading, setLoading] = useState(false);
  const [userDepartmentData, setUserDepartmentData] = useState<any>([]);
  const [assigneesData, setAssigneesData] = useState<any>([]);
  const [activityStatus, setActivityStatus] = useState<any>([]);
  const [clearData, setClearData] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const getUserDepartment = async () => {
    const returnedParams = "user-department";
    try {
      setLoading(true);
      const { status, data } = await getAPI(`${returnedParams}/?q=&archived=&page=1&size=100`);

      setLoading(false);
      setUserDepartmentData(data?.items);
    } catch (error: any) {
      setLoading(false);
      enqueueSnackbar(error.response.data.message || "Something went wrong!", {
        variant: "error",
      });
    }
  };
  const getAssignees = async () => {
    const returnedParams = "organization-user";
    await fetchApI({ url: "organization-user/", setterFunction: setAssigneesData });
  };

  const getStatus = async () => {
    const returnedParams = "activity-status/";

    try {
      setLoading(true);
      const { status, data } = await getAPI(`${returnedParams}`);

      setActivityStatus(data.items);
    } catch (error: any) {
      setLoading(false);
      enqueueSnackbar(error.response.data.message || "Something went wrong!", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    if (activeFilter === "" || activeFilter === "created_by&modified_by") {
      getAssignees();
    } else if (activeFilter === "user_department") {
      getUserDepartment();
    } else if (activeFilter === "status") {
      getStatus();
    }

    //     getStatus();
  }, [activeFilter]);

  const activeTab = (activeFilter: string) => {
    switch (activeFilter) {
      case "":
        return (
          <AssigneesField
            filterObj={filterObj}
            setFilterModal={setFilterModal}
            setPresentFilter={setPresentFilter}
            label="Assignees"
            fieldName="users"
            dropdownData={assigneesData}
            initValues={values}
            setValues={setValues}
            filterValues={filterValues}
            keyName="full_name"
          />
        );
        break;
      case "user_department":
        return (
          <AssigneesField
            filterObj={filterObj}
            setFilterModal={setFilterModal}
            setPresentFilter={setPresentFilter}
            label="User Department"
            fieldName="user_department"
            initValues={values}
            setValues={setValues}
            keyName="name"
            dropdownData={userDepartmentData}
            filterValues={filterValues}
          />
        );
        break;
      case "due_date":
        return (
          <AssigneesField
            filterObj={filterObj}
            setFilterModal={setFilterModal}
            setPresentFilter={setPresentFilter}
            label="Due Date"
            fieldName="due_date"
            initValues={values}
            setValues={setValues}
            filterValues={filterValues}
          />
        );
        break;
      case "created_by&modified_by":
        return (
          <AssigneesField
            filterObj={filterObj}
            setFilterModal={setFilterModal}
            setPresentFilter={setPresentFilter}
            label="created_by&modified_by"
            fieldName="created_by&modified_by"
            initValues={values}
            setValues={setValues}
            dropdownData={assigneesData}
            filterValues={filterValues}
          />
        );
        break;
      case "status":
        return (
          <AssigneesField
            filterObj={filterObj}
            setFilterModal={setFilterModal}
            setPresentFilter={setPresentFilter}
            label="status"
            fieldName="status"
            dropdownData={activityStatus}
            initValues={values}
            setValues={setValues}
            filterValues={filterValues}
          />
        );
        break;
      case "inspected_by":
        return (
          <AssigneesField
            filterObj={filterObj}
            setFilterModal={setFilterModal}
            setPresentFilter={setPresentFilter}
            label="Inspected By"
            fieldName="inspected_by"
            dropdownData={assigneesData}
            initValues={values}
            setValues={setValues}
            filterValues={filterValues}
          />
        );
        break;

      default:
        break;
    }
  };

  return (
    <>
      <Container maxWidth="lg">
        <FilterTabs setActiveFilter={setActiveFilter} activeFilter={activeFilter} />
        {activeTab(activeFilter)}
      </Container>
      <Divider />
    </>
  );
};

export default Filter;
