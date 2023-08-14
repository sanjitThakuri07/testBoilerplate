import React, { useEffect, useState } from "react";
import { Formik, FormikProps } from "formik";
import {
  Button,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { fetchApI } from "src/modules/apiRequest/apiRequest";
import MultiSelect from "src/components/CustomMultiSelect/version2";

const GeneralSettingTableFilter = ({
  type,
  initialValue,
  setFilterUrl,
  filterModal,
  setFilterModal,
  dynamicProperties,
  filterObj,
}: any) => {
  const [options, setOptions] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<any>({
    ...dynamicProperties?.initialValue,
  });

  const [value, setValue] = useState([]);

  async function APICall({ type }: any) {
    if (type) {
      setIsLoading(true);
      await fetchApI({
        setterFunction: setOptions,
        url: dynamicProperties?.optionApi,
        queryParam: "size=99",
      });
    }
  }

  useEffect(() => {
    if (!dynamicProperties?.type) return;
    APICall({ type: dynamicProperties?.type });
  }, [dynamicProperties?.type]);

  const getFieldsName = (type: any) => {
    switch (type) {
      case "territory":
        return { fieldName: "territory" };
      case "location":
        return { fieldName: "location" };
      case "country":
        return { fieldName: "country" };
      default:
        return { fieldName: "region" };
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={false}
      //   validationSchema={validation}
      onSubmit={async (values, formikHelpers) => {
        setFilterUrl((prev: any) => {
          console.log({ values });
          let query = values?.[`${getFieldsName(dynamicProperties?.type)?.fieldName}`]?.reduce(
            (acc: any, cur: any, index: number, wholeArr: any) => {
              return (
                acc +
                `${
                  wholeArr?.[index + 1]
                    ? `${cur}&${getFieldsName(dynamicProperties?.type)?.fieldName}=`
                    : `${cur}`
                }`
              );
            },
            `${getFieldsName(dynamicProperties?.type)?.fieldName}=`,
          );
          console.log({ query });
          return { ...prev, filterQuery: `${query}` };
        });
        const getValue = options.filter((it: any) =>
          values?.[`${getFieldsName(dynamicProperties?.type)?.fieldName}`]?.includes(it?.id),
        );
        console.log({ getValue });
        console.log({ filterObj });
        filterObj?.setFilterValue(getValue);
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
          <form className="" onSubmit={handleSubmit} style={{ margin: ".8rem 0" }}>
            <div className="region-fieldset">
              {/* <MultiSelect
                onChange={(val: any) => {
                  setValue(val);
                }}
                value={value}
                options={newOptions}
                multiple={true}
              /> */}
              <div style={{ marginBottom: "1rem" }}>
                <InputLabel htmlFor="name">
                  <div className="label-heading">Choose {dynamicProperties?.type}</div>
                </InputLabel>
                <FormGroup className="input-holder">
                  <Select
                    MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                    name={getFieldsName(dynamicProperties?.type)?.fieldName}
                    multiple
                    id={getFieldsName(dynamicProperties?.type)?.fieldName}
                    size="small"
                    fullWidth
                    data-testid="country"
                    placeholder="Select here"
                    autoComplete="off"
                    value={values?.[`${getFieldsName(dynamicProperties?.type)?.fieldName}`] || []}
                    renderValue={(val: any) => {
                      const value = options.filter((it: any) => val?.includes(it?.id));

                      const getValue = value?.map((value: any) => value?.name)?.join(",");
                      return getValue;
                    }}
                    error={Boolean(
                      touched?.[`${getFieldsName(dynamicProperties?.type)?.fieldName}`] &&
                        errors?.[`${getFieldsName(dynamicProperties?.type)?.fieldName}`],
                    )}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    {options?.map((item: any, index: number) => (
                      <MenuItem key={index} value={item?.id}>
                        {item?.[`${dynamicProperties?.fieldName}`]}
                      </MenuItem>
                    ))}
                  </Select>
                  {Boolean(
                    touched?.[`${getFieldsName(dynamicProperties?.type)?.fieldName}`] &&
                      errors?.[`${getFieldsName(dynamicProperties?.type)?.fieldName}`],
                  ) && (
                    <FormHelperText error>
                      {errors?.[`${getFieldsName(dynamicProperties?.type)?.fieldName}`]}
                    </FormHelperText>
                  )}
                </FormGroup>
              </div>
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

export default GeneralSettingTableFilter;
