import React, { useEffect, useState } from "react";
import { Field, Formik, FormikProps } from "formik";
import {
  Button,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import { fetchApI } from "src/modules/apiRequest/apiRequest";
import DeletableChips from "src/modules/config/generalSettings/Filters/FilterChip";
import { Android12Switch } from "./styles";

import NewCustomMultiSelect from "src/components/NewCustomMultiSelect/NewCustomMultiSelect";
import { MultiSelectComponent } from "src/components/MultiSelectComponent/index";
import { valuesIn } from "lodash";

const options = [
  { name: "First", value: 1 },
  { name: "Second", value: 2 },
  { name: "Third", value: 3 },
  { name: "Fourth", value: 4 },
  { name: "Fifth", value: 5 },
];

// re-initiliazing formik initial values and options
export function converToProperFormikFormat({ data, getFilterValue }: any) {
  // previous format
  // const getValue = Array.isArray(getFilterValue?.[curr]?.value)
  // ? getFilterValue?.[curr]?.value?.map((it: any) => it?.id)
  // : getFilterValue?.[curr]?.value || '';

  let datas = Object.keys(data || {})?.reduce((acc: any, curr: any) => {
    const getValue = Array.isArray(getFilterValue?.[curr]?.value)
      ? getFilterValue?.[curr]?.value
      : getFilterValue?.[curr]?.value || "";
    // { value: getValue, options: [] }
    const dataObje =
      getFilterValue?.[curr]?.type === "Select" ? { value: getValue } : { value: getValue };

    // acc[curr?.initialValue] = { ...curr, ...dataObje };
    acc[getFilterValue[curr]?.initialValue] = {
      ...(getFilterValue[curr] || {}),
      ...(dataObje || {}),
    };
    return acc;
  }, {});

  return datas;
}

// filtered chip options
export const FilteredValue = ({ getFilterValue, setFilterValue, onDataTableChange }: any) => {
  console.log({ getFilterValue });
  let collectionOfDatas = Object.keys(getFilterValue || {})?.reduce((acc: any, curr: any) => {
    let keyName = getFilterValue?.[curr]?.fieldKey?.label || getFilterValue?.[curr]?.fieldName;
    if (Array.isArray(getFilterValue?.[curr]?.value)) {
      acc.push([
        ...(getFilterValue?.[curr]?.value?.map((it: any) => ({
          ...it,
          initialValue: getFilterValue?.[curr]?.initialValue,
          showValue: it?.[keyName],
        })) || []),
      ]);
    } else if (typeof getFilterValue?.[curr]?.value === "object") {
      acc.push({
        ...getFilterValue?.[curr],
        showValue: getFilterValue?.[curr]?.value?.[keyName],
      });
    } else {
      acc.push({ ...getFilterValue?.[curr], showValue: getFilterValue?.[curr]?.value || "" });
    }

    return acc;
  }, []);

  return (
    <div className="filtered__content">
      {collectionOfDatas.flat()?.map((it: any) => {
        return (
          <DeletableChips
            filterData={{ name: it?.showValue || "" }}
            onDelete={(data: any) => {
              let filterObjCopy: any = { ...(getFilterValue || {}) };
              if (!Array.isArray(getFilterValue?.[it?.initialValue]?.value)) {
                filterObjCopy[it?.initialValue].value = "";
              } else if (Array.isArray(getFilterValue?.[it?.initialValue]?.value)) {
                filterObjCopy[it?.initialValue].value = filterObjCopy[
                  it?.initialValue
                ].value.filter((data: any) => data?.id !== it?.id);
              }
              setFilterValue((prev: any) => ({ ...filterObjCopy }));
              let filterQuery = Object.entries(filterObjCopy || {})?.reduce(
                (acc: any, curr: any, index) => {
                  let key = curr?.[0];
                  let value = curr?.[1]?.value;
                  if (!value) {
                    return acc;
                  } else if (Array?.isArray(value)) {
                    let subQuery = value.reduce((acc: any, curr: any) => {
                      return (acc = acc + `${key}=${curr?.id}&`);
                    }, "");
                    acc = acc + `${subQuery}`;
                  } else {
                    acc = acc + `${key}=${value}&`;
                  }
                  return acc;
                },
                "",
              );
              console.log({ filterQuery });
              onDataTableChange({
                key: "filterQuery",
                value: filterQuery,
              });
            }}
          />
        );
      })}
    </div>
  );
};

export const SwitchComponent = ({ label, onChange, disabled = false, value }: any) => {
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Android12Switch
            disabled={disabled}
            checked={value}
            defaultChecked={false}
            onChange={(e: any) => {
              onChange(e.target.checked);
            }}
          />
        }
        label={label}
      />
    </FormGroup>
  );
};

// filter component
const CommonFilter = ({
  setFilterUrl,
  filterModal,
  setFilterModal,
  INITIAL_VALUES,
  filterObj,
  setPresentFilter,
}: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<any>({
    ...INITIAL_VALUES,
  });

  const initialVal = Object.keys(INITIAL_VALUES || {}).reduce((acc: any, curr: any) => {
    const getValue = INITIAL_VALUES?.[curr]?.value;
    // acc[curr] = INITIAL_VALUES?.[curr]?.type?.toLowerCase() === 'select' ? [] : '';
    acc[curr] = getValue;
    return acc;
  }, {});

  const [INITIALVALUE, SETINITIALVALUE] = useState({ ...initialVal });

  async function APICall({ type, field, setInitialValues, objKey }: any) {
    if (objKey && field?.api) {
      //   setIsLoading(true);
      await fetchApI({
        setterFunction: (data: any) => {
          setInitialValues?.((prev: any) => ({
            ...prev,
            [objKey]: { ...prev?.[objKey], options: data },
          }));
        },
        url: field?.api,
        queryParam: "size=99",
        // getAll: true,
      });
    }
  }

  let initialValueKeyLength = Object.keys(INITIAL_VALUES || {})?.length;

  useEffect(() => {
    if (!initialValueKeyLength) return;
    Object.keys(INITIAL_VALUES || {})?.forEach(async (field: any) => {
      await APICall({ objKey: field, field: INITIAL_VALUES?.[field], setInitialValues });
    });
  }, [initialValueKeyLength]);

  function hasFilter({ values }: any) {
    const status = Object.keys(values || {})?.some((key) => {
      return Array.isArray(values?.[key])
        ? values?.[key]?.length
        : typeof values?.[key] === "object"
        ? Object?.keys(values?.[key])?.length
        : values?.[key]?.length;
    });
    setPresentFilter?.(status);
  }

  return (
    <Formik
      initialValues={INITIALVALUE}
      enableReinitialize={true}
      //   validationSchema={validation}
      onSubmit={async (values, formikHelpers) => {
        hasFilter({ values });
        const querys: { query: string; formValues: any } = Object.entries(values || {}).reduce(
          (acc: any, [key, value]: any) => {
            if (Array.isArray(value)) {
              let subQuery = value.reduce((acc: any, curr: any) => {
                let keyName = initialValues?.[key]?.fieldKey?.value || "id";
                return (acc =
                  acc +
                  `${initialValues[key]?.backendName}=${
                    typeof curr === "object" ? curr?.[keyName] : curr
                  }&`);
              }, "");
              acc.query += `${subQuery}`;
            } else if (typeof value === "object") {
              let keyName = initialValues?.[key]?.fieldKey?.value || "id";
              acc.query += `${initialValues[key]?.backendName}=${value?.[keyName] || ""}&`;
            } else {
              acc.query += `${initialValues[key]?.backendName}=${value}&`;
            }

            // const getValue = Array.isArray(value)
            //   ? (initialValues[key]?.options || []).filter((it: any) => value.includes(it.id))
            //   : value || '';
            const getValue = value;

            acc.formValues = {
              ...(acc.formValues || {}),
              [key]: {
                ...(acc.formValues?.[key] || {}),
                ...(initialValues[key] || {}),
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
        setFilterUrl((prev: any) => ({ ...prev, filterQuery: querys?.query }));
        filterObj?.setFilterValue({ ...querys?.formValues });
        setFilterModal?.(false);
      }}
    >
      {(props: any) => {
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
          <form
            className="common__filter-component"
            onSubmit={handleSubmit}
            style={{ margin: ".8rem 0" }}
          >
            <div className="region-fieldset">
              {Object.keys(INITIAL_VALUES || {})?.map((field: any, index: number) => {
                return (() => {
                  switch (INITIAL_VALUES?.[field]?.type) {
                    case "Select":
                      return (
                        <div style={{ marginBottom: "1rem" }}>
                          <InputLabel htmlFor="name">
                            <div className="label-heading">
                              {INITIAL_VALUES?.[field]?.label || ""}{" "}
                            </div>
                          </InputLabel>
                          <FormGroup>
                            {/* <Select
                              MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                              name={field}
                              multiple={INITIAL_VALUES?.[field]?.multiple}
                              id={field}
                              size="small"
                              fullWidth
                              data-testid={field}
                              placeholder="Select here"
                              autoComplete="off"
                              value={values?.[`${field}`] || []}
                              renderValue={(val: any) => {
                                if (INITIAL_VALUES?.[field]?.multiple) {
                                  const value = initialValues?.[field]?.options?.filter((it: any) =>
                                    val?.includes(it?.id),
                                  );
                                  const getValue = value
                                    ?.map(
                                      (value: any) => value?.[INITIAL_VALUES?.[field]?.fieldName],
                                    )
                                    ?.join(',');
                                  return getValue;
                                }
                                return val;
                              }}
                              error={Boolean(touched?.[`${field}`] && errors?.[`${field}`])}
                              onChange={(e: any) => {
                                handleChange(e);
                              }}
                              onBlur={handleBlur}>
                              {initialValues?.[field]?.options?.map((item: any, index: number) => (
                                <MenuItem key={index} value={item?.id}>
                                  {item?.[initialValues?.[field]?.fieldName] || ''}
                                </MenuItem>
                              ))}
                            </Select> */}
                            <div style={{ position: "relative" }}>
                              <MultiSelectComponent
                                // key={index}
                                value={values?.[`${field}`] || []}
                                // options={initialValues?.[field]?.options}
                                options={initialValues?.[field]?.options}
                                onChange={(data: any) => {
                                  setFieldValue(
                                    `${initialValues?.[`${field}`]?.initialValue}`,
                                    data,
                                  );
                                }}
                                fieldKey={
                                  initialValues?.[field]?.fieldKey ||
                                  initialValues?.[field]?.fieldName || {
                                    label: "name",
                                    value: "value",
                                  }
                                }
                                name={initialValues?.[field]?.initialValue}
                                multiple={initialValues?.[field].multiple}
                                // fieldKey={{
                                //   label: INITIAL_VALUES?.[field]?.fieldName,
                                //   value: 'id',
                                // }}
                              ></MultiSelectComponent>
                            </div>

                            {/* <NewCustomMultiSelect
                              selected={values?.[`${field}`] || []}
                              menuOptions={initialValues?.[field]?.options || []}
                              setSelected={(val: any) => {
                                setFieldValue(field, val);
                              }}
                              menuLabel={'Select All'}
                              labelKey={INITIAL_VALUES?.[field]?.fieldName || ''}
                              multiple={INITIAL_VALUES?.[field].multiple}
                              valueKey="id"
                            /> */}

                            {Boolean(touched?.[`${field}`] && errors?.[`${field}`]) && (
                              <FormHelperText error>{errors?.[`${field}`]}</FormHelperText>
                            )}
                          </FormGroup>
                        </div>
                      );

                    case "Date":
                      return (
                        <div style={{ marginBottom: "1rem" }}>
                          <InputLabel htmlFor="name">
                            <div className="label-heading">
                              {INITIAL_VALUES?.[field]?.label || ""}{" "}
                            </div>
                          </InputLabel>
                          <FormGroup className="input-holder">
                            <TextField
                              id="date"
                              type="date"
                              name={field}
                              size="small"
                              data-testid={field}
                              placeholder="Select here"
                              autoComplete="off"
                              value={values?.[`${field}`] || []}
                              error={Boolean(touched?.[`${field}`] && errors?.[`${field}`])}
                              onChange={(e: any) => {
                                handleChange(e);
                              }}
                              onBlur={handleBlur}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </FormGroup>
                        </div>
                      );

                    default:
                      return (
                        <div style={{ marginBottom: "1rem" }}>
                          <InputLabel htmlFor="name">
                            <div className="label-heading">
                              {" "}
                              {INITIAL_VALUES?.[field]?.label || ""}
                            </div>
                          </InputLabel>
                          <FormGroup className="input-holder">
                            <Field
                              as={OutlinedInput}
                              name={field}
                              id="website"
                              data-testid="website"
                              type="text"
                              autoComplete="off"
                              placeholder="Enter here"
                              size="small"
                              fullWidth
                              value={values?.[field] || ""}
                              //   error={errors?.website && touched?.website ? true : false}
                              onChange={(e: any) => {
                                handleChange(e);
                              }}
                              onBlur={handleBlur}
                            />
                          </FormGroup>
                        </div>
                      );
                  }
                })();
              })}
            </div>

            <div className="">
              <Grid container spacing={2} justifyContent="flex-end">
                <Grid item>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setFilterModal?.(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={!isValid || !dirty || isSubmitting}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default CommonFilter;
