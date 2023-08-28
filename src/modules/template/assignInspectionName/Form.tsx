import React, { useEffect, useRef } from "react";
import { Button, InputLabel } from "@mui/material";
import Select from "react-select";

import { Form, Formik, FormikProps } from "formik";
import ButtonLoaderSpinner from "src/components/ButtonLoaderSpinner/ButtonLoaderSpinner";
import { useInspectionNameStore } from "src/store/zustand/inspection/inspectionName";
import useGeneralStatusStore from "src/store/zustand/generalStatus";

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

  const removeRef = useRef(null);

  const {
    fetchGeneralStatuss,
    postGeneralStatus,
    updateGeneralStatus,
    fetchIndividualGeneralStatus,
    individualGeneralStatus,
    generalStatuss,
  }: any = useGeneralStatusStore();

  useEffect(() => {
    fetchGeneralStatuss({ query: { tag: "Form" } });
  }, []);

  return (
    <>
      <Formik
        initialValues={
          formData
            ? {
                template_id: formData.template_id,
                menu_id: formData.menu_id,
              }
            : {
                menu_id: selected.inspection_type
                  ? {
                      label: generalStatuss?.find(
                        (inspectionName: any) => inspectionName.id === selected?.inspection_type,
                      ).name,
                      value: generalStatuss?.find(
                        (inspectionName: any) => inspectionName.id === selected?.inspection_type,
                      ).id,
                    }
                  : "",
                template_id: selected.id,
              }
        }
        onSubmit={(values) => {
          console.log({ removeRef }, removeRef.current);
          let { menu_id, ...datas }: any = values;

          datas = {
            ...datas,
            menu_id: removeRef?.current === 0 ? 0 : menu_id.value,
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
                  name="menu_id"
                  onChange={(e: any) => {
                    setFieldValue("menu_id", e);
                  }}
                  value={values.menu_id}
                  defaultValue={values.menu_id}
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
                    generalStatuss?.length
                      ? generalStatuss?.map((status: any) => ({
                          label: status.name,
                          value: status.id,
                        }))
                      : []
                  }
                />
              </div>
              <div></div>
              <Button
                variant="contained"
                disabled={isLoading}
                className="login_button"
                fullWidth
                type="submit"
                onClick={() => {
                  removeRef.current = null;
                }}
              >
                {isLoading ? <ButtonLoaderSpinner /> : "Done"}
              </Button>
              <Button
                variant="outlined"
                disabled={isLoading}
                fullWidth
                type="submit"
                onClick={() => {
                  removeRef.current = 0;
                }}
              >
                {" "}
                Remove Menu
              </Button>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default AssignInspectionName;
