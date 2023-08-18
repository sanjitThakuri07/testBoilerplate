import React from "react";
import { Button, Checkbox, FormControlLabel, InputLabel, Popover, Typography } from "@mui/material";
import Select from "react-select";

import { Form, Formik, FormikProps } from "formik";
import ButtonLoaderSpinner from "src/components/ButtonLoaderSpinner/ButtonLoaderSpinner";

import { useTemplateAccessStore } from "src/store/zustand/templates/templateAccessStore";

const optionTypes: any = [
  {
    id: 1,
    name: "Start",
  },
  {
    id: 2,
    name: "Start, Edit",
  },
  {
    id: 3,
    name: "Start, Edit, Delete",
  },
];

const reportOptionTypes: any = [
  {
    id: 1,
    name: "View",
  },
  {
    id: 2,
    name: "View, Edit",
  },
  {
    id: 3,
    name: "View, Edit, Delete",
  },
];

const AccessForm = ({
  templateId,
  isLoading,
  formData,
  userRoles,
  organizationUsers,
  onUpdate,
  onCreate,
}: any) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [anchorElReport, setAnchorElReport] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClickReport = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElReport(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseReport = () => {
    setAnchorElReport(null);
  };

  const open = Boolean(anchorEl);
  const openReport = Boolean(anchorElReport);

  return (
    <>
      <Formik
        initialValues={
          formData
            ? {
                inspection_available_type: formData.inspection_available_type,
                inspection_access_level: optionTypes.find(
                  (optionType: any) => optionType.id === formData.inspection_access_level,
                ),
                inspection_users: formData.inspection_users.map((inspection_user: any) => ({
                  label: inspection_user.full_name,
                  value: inspection_user.id,
                })),
                inspection_groups: formData.inspection_groups
                  ? { label: formData.inspection_groups.name, value: formData.inspection_groups.id }
                  : 0,

                report_available_type: formData.report_available_type,
                report_access_level: reportOptionTypes.find(
                  (reportOptionType: any) => reportOptionType.id === formData.report_access_level,
                ),
                report_users: formData.report_users.map((report_user: any) => ({
                  label: report_user.full_name,
                  value: report_user.id,
                })),
                report_groups: formData.report_groups
                  ? { label: formData.report_groups.name, value: formData.report_groups.id }
                  : 0,

                template_id: formData.template_id,
              }
            : {
                inspection_available_type: 1,
                inspection_access_level: optionTypes[0],
                inspection_users: [],
                inspection_groups: null,
                report_available_type: 1,
                report_access_level: reportOptionTypes[0],
                report_users: [],
                report_groups: null,
                template_id: templateId,
              }
        }
        onSubmit={(values) => {
          let {
            inspection_access_level,
            report_access_level,
            inspection_users,
            report_users,
            inspection_groups,
            report_groups,
            ...datas
          }: any = values;
          datas = {
            ...datas,
            inspection_access_level: inspection_access_level.id,
            report_access_level: report_access_level.id,
            inspection_users: inspection_users?.map((list: any) => list?.value),
            report_users: report_users.length ? report_users?.map((list: any) => list?.value) : [],
            inspection_groups: inspection_groups ? inspection_groups.value : null,
            report_groups: report_groups ? report_groups.value : null,
          };
          formData
            ? onUpdate({ templateAccessId: formData.id, datas })
            : onCreate({ values: [datas], userRoles });
        }}
        // validationSchema={{}}
      >
        {(props: FormikProps<any>) => {
          const { values, touched, errors, setFieldValue, handleBlur, handleChange, isSubmitting } =
            props;
          return (
            <Form style={{ marginTop: "20px" }}>
              <InputLabel htmlFor="login_id" className="input_label">
                Template Available to
              </InputLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    defaultChecked={false}
                    name={`data`}
                    checked={values.inspection_available_type === 1}
                    onChange={(event) => {
                      setFieldValue(`inspection_available_type`, 1);
                      setFieldValue(`inspection_users`, []);
                      setFieldValue(`inspection_groups`, null);
                    }}
                  />
                }
                label="Owner"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    defaultChecked={false}
                    name={`data`}
                    checked={values.inspection_available_type === 2}
                    onChange={(event) => {
                      setFieldValue(`inspection_available_type`, 2);
                      setFieldValue(`inspection_users`, []);
                      setFieldValue(`inspection_groups`, null);
                    }}
                  />
                }
                label="All Users"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    defaultChecked={false}
                    name={`data`}
                    checked={values.inspection_available_type === 3}
                    onChange={(event) => {
                      setFieldValue(`inspection_available_type`, 3);
                      setFieldValue(`inspection_users`, []);
                    }}
                  />
                }
                label="Groups"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    defaultChecked={false}
                    name={`data`}
                    checked={values.inspection_available_type === 4}
                    onChange={(event) => {
                      setFieldValue(`inspection_available_type`, 4);
                      setFieldValue(`inspection_groups`, null);
                    }}
                  />
                }
                label="Individuals"
              />

              <Select
                name="inspection_users"
                onChange={(e: any) => {
                  setFieldValue(
                    values.inspection_available_type === 4
                      ? "inspection_users"
                      : "inspection_groups",
                    values.inspection_available_type === 4 ? e.map((item: any) => item) : e,
                  );
                }}
                value={
                  values.inspection_available_type === 4
                    ? values.inspection_users
                    : values.inspection_groups
                }
                defaultValue={values.inspection_users}
                closeMenuOnSelect={false}
                placeholder={
                  values.inspection_available_type === 1
                    ? "Owner"
                    : values.inspection_available_type === 2
                    ? "All Users"
                    : "Select"
                }
                isDisabled={[1, 2].includes(values.inspection_available_type) ? true : false}
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary: "#33426a",
                  },
                })}
                isMulti={values.inspection_available_type === 4 ? true : false}
                options={
                  values.inspection_available_type === 3
                    ? userRoles?.items?.map((role: any) => ({ label: role.name, value: role.id }))
                    : values.inspection_available_type === 4
                    ? organizationUsers?.items?.map((user: any) => ({
                        label: user.full_name,
                        value: user.user_id,
                      }))
                    : []
                }
              />
              <div style={{ marginTop: "0.5rem" }}>
                Access Level:{" "}
                <span
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                  aria-describedby={"inspection_access_level"}
                  onClick={(e: any) => handleClick(e)}
                >
                  {values.inspection_access_level.name}
                </span>
                <Popover
                  id={"inspection_access_level"}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  {optionTypes.map((option: any) => (
                    <Typography
                      sx={{ p: 1 }}
                      onClick={() => setFieldValue("inspection_access_level", option)}
                    >
                      {option.name}
                    </Typography>
                  ))}
                </Popover>
              </div>
              <br />
              <br />
              <InputLabel htmlFor="login_id" className="input_label">
                Inspection results available to
              </InputLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    defaultChecked={false}
                    name={`data`}
                    checked={values.report_available_type === 1}
                    onChange={(event) => {
                      setFieldValue(`report_available_type`, 1);
                      setFieldValue(`report_users`, []);
                      setFieldValue(`report_groups`, null);
                    }}
                  />
                }
                label="Owner"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    defaultChecked={false}
                    name={`data`}
                    checked={values.report_available_type === 2}
                    onChange={(event) => {
                      setFieldValue(`report_available_type`, 2);
                      setFieldValue(`report_users`, []);
                      setFieldValue(`report_groups`, null);
                    }}
                  />
                }
                label="All Users"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    defaultChecked={false}
                    name={`data`}
                    checked={values.report_available_type === 3}
                    onChange={(event) => {
                      setFieldValue(`report_available_type`, 3);
                      setFieldValue(`report_users`, []);
                    }}
                  />
                }
                label="Groups"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    defaultChecked={false}
                    name={`data`}
                    checked={values.report_available_type === 4}
                    onChange={(event) => {
                      setFieldValue(`report_available_type`, 4);
                      setFieldValue(`report_groups`, null);
                    }}
                  />
                }
                label="Individuals"
              />
              <Select
                name="report_users"
                onChange={(e: any) => {
                  setFieldValue(
                    values.report_available_type === 4 ? "report_users" : "report_groups",
                    values.report_available_type === 4 ? e.map((item: any) => item) : e,
                  );
                }}
                value={
                  values.report_available_type === 4 ? values.report_users : values.report_groups
                }
                defaultValue={values.report_users}
                closeMenuOnSelect={false}
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary: "#33426a",
                  },
                })}
                placeholder={
                  values.report_available_type === 1
                    ? "Owner"
                    : values.report_available_type === 2
                    ? "All Users"
                    : "Select"
                }
                isDisabled={[1, 2].includes(values.report_available_type) ? true : false}
                // components={animatedComponents}
                isMulti={values.report_available_type === 4 ? true : false}
                options={
                  values.report_available_type === 3
                    ? userRoles?.items?.map((role: any) => ({ label: role.name, value: role.id }))
                    : values.report_available_type === 4
                    ? organizationUsers?.items?.map((user: any) => ({
                        label: user.full_name,
                        value: user.user_id,
                      }))
                    : []
                }
              />

              <div style={{ marginTop: "0.5rem" }}>
                Access Level:{" "}
                <span
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                  aria-describedby={"report_access_level"}
                  onClick={(e: any) => handleClickReport(e)}
                >
                  {values.report_access_level.name}
                </span>
                <Popover
                  id={"report_access_level"}
                  open={openReport}
                  anchorEl={anchorElReport}
                  onClose={handleCloseReport}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  {reportOptionTypes.map((option: any) => (
                    <Typography
                      sx={{ p: 1 }}
                      onClick={() => setFieldValue("report_access_level", option)}
                    >
                      {option.name}
                    </Typography>
                  ))}
                </Popover>
              </div>

              <Button variant="contained" className="login_button" fullWidth type="submit">
                {isLoading ? <ButtonLoaderSpinner /> : "Done"}
              </Button>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default AccessForm;
