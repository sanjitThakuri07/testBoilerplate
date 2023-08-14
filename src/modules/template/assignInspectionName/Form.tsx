import React, { useEffect } from "react";
import { Button, InputLabel } from "@mui/material";
import Select from "react-select";

import { Form, Formik, FormikProps } from "formik";
import ButtonLoaderSpinner from "src/components/ButtonLoaderSpinner/ButtonLoaderSpinner";
import { useInspectionNameStore } "src/store/zustand/inspection/inspectionName";

const AssignInspectionName = ({
  templateId,
  isLoading,
  formData,
  userRoles,
  onUpdate,
  onCreate,
  selected,
}: any) => {
  const { getInspectionNames, inspectionNames } = useInspectionNameStore();
  useEffect(() => {
    getInspectionNames({});
  }, []);
  return (
    <>
      <Formik
        initialValues={
          formData
            ? {
                template_id: formData.template_id,
                inspection_id: formData.inspection_id,
              }
            : {
                inspection_id: selected.inspection_type
                  ? {
                      label: inspectionNames?.items?.find(
                        (inspectionName: any) => inspectionName.id === selected?.inspection_type,
                      ).name,
                      value: inspectionNames?.items?.find(
                        (inspectionName: any) => inspectionName.id === selected?.inspection_type,
                      ).id,
                    }
                  : "",
                template_id: selected.id,
              }
        }
        onSubmit={(values) => {
          let {
            inspection_id,

            ...datas
          }: any = values;
          datas = {
            ...datas,
            inspection_id: inspection_id.value,
          };
          formData
            ? onUpdate({ templateAccessId: formData.id, datas })
            : onCreate({
                values: datas,
              });
        }}
        // validationSchema={{}}
        enableReinitialize={true}
      >
        {(props: FormikProps<any>) => {
          const { values, touched, errors, setFieldValue, handleBlur, handleChange, isSubmitting } =
            props;
          return (
            <Form style={{ margin: "1.25rem 0" }}>
              <div style={{ margin: "1rem 0" }}>
                <InputLabel
                  htmlFor="login_id"
                  className="input_label"
                  style={{ marginBottom: "0.375rem" }}
                >
                  Inspection Name
                </InputLabel>

                <Select
                  name="inspection_id"
                  onChange={(e: any) => {
                    setFieldValue("inspection_id", e);
                  }}
                  value={values.inspection_id}
                  defaultValue={values.inspection_id}
                  closeMenuOnSelect={true}
                  //   isDisabled={true}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary: "#33426a",
                    },
                  })}
                  isMulti={false}
                  options={
                    inspectionNames.items?.length
                      ? inspectionNames?.items?.map((inspectionName: any) => ({
                          label: inspectionName.name,
                          value: inspectionName.id,
                        }))
                      : []
                  }
                />
              </div>
              <Button
                variant="contained"
                disabled={isLoading}
                className="login_button"
                fullWidth
                type="submit"
              >
                {isLoading ? <ButtonLoaderSpinner /> : "Done"}
              </Button>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default AssignInspectionName;
