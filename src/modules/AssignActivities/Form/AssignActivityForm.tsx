import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  Container,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextFieldProps,
  Box,
  Button,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import React, { ReactHTMLElement, useEffect, useState } from "react";

import moment from "moment";
import { useTemplateStore } from "src/store/zustand/templates/templateStore";
import { useNavigate, useParams } from "react-router-dom";
import TextEditor from "src/components/MyTextEditor/MyEditor";

const AssignActivityForm = ({
  handleChange,
  handleBlur,
  values,
  touched,
  errors,
  userDepartmentData,
  assigneesData,
  setFieldValue,
  activityStatus,
  clearData,
  setClearData,
  isEdit,
  prevData = {},
  disabled = false,
  loading = false,
}: any) => {
  const [contentState, setContentState] = React.useState<string | null>(null);
  const [openMultiImage, setOpenMultiImage] = React.useState<boolean>(false);
  // const [clearData, setClearData] = React.useState(false);
  const [selected, setSelected] = React.useState([]);
  const { templates, getTemplates }: any = useTemplateStore();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const navigate = useNavigate();
  const { assignActivityId } = useParams();

  useEffect(() => {
    if (contentState) {
      setFieldValue(`description`, contentState);
    }
  }, [contentState]);

  useEffect(() => {
    getTemplates({});
  }, []);

  return (
    <Box padding={"0 15px"}>
      <Grid item xs={12} flexDirection="column" margin={"20px 0"}>
        <Grid item xs={12}>
          <InputLabel htmlFor="title">
            <div className="label-heading">
              Activity Title <sup>*</sup>
            </div>
          </InputLabel>
        </Grid>
        <Grid item xs={12}>
          <FormGroup className="input-holder">
            <OutlinedInput
              id="title"
              type="text"
              placeholder=""
              size="small"
              fullWidth
              name="title"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.title}
              className={disabled ? "disabled" : ""}
              disabled={disabled}
              error={Boolean(touched.title && errors.title)}
            />
          </FormGroup>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={1}
        className="formGroupItem"
        flexDirection="row"
        justifyContent="space-between"
        paddingRight={"0px"}
      >
        <Grid item xs={2.4} flexDirection="column">
          <Grid item xs={12}>
            <InputLabel htmlFor="user_department">
              <div className="label-heading">
                User Department <sup>*</sup>
              </div>
            </InputLabel>
          </Grid>
          <Grid item xs={12}>
            <FormGroup className="input-holder">
              <Select
                MenuProps={{
                  PaperProps: { style: { maxHeight: 200 } },
                }}
                multiple
                id="user_department"
                size="small"
                sx={{ overflow: "hidden" }}
                fullWidth
                className={disabled ? "disabled" : ""}
                disabled={disabled}
                placeholder="Active"
                onChange={handleChange}
                onBlur={handleBlur}
                name="user_department"
                value={values.user_department}
                renderValue={(val: any[]) => {
                  let newVal = val.map((it: any) => Number(it));
                  const matchedValues = userDepartmentData
                    ?.filter((item: any) => newVal.includes(item?.id))
                    ?.map((value: any) => value.name)
                    ?.join(",");

                  return matchedValues;
                }}
                error={Boolean(touched.user_department && errors.user_department)}
              >
                {userDepartmentData?.map((item: any, index: number) => (
                  <MenuItem key={item?.id} value={item?.id}>
                    {item?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormGroup>
          </Grid>
        </Grid>

        <Grid item xs={2.4} flexDirection="column">
          <Grid item xs={12}>
            <InputLabel htmlFor="users">
              <div className="label-heading">
                Assignees <sup>*</sup>
              </div>
            </InputLabel>
          </Grid>
          <Grid item xs={12}>
            <FormGroup className="input-holder">
              <Select
                MenuProps={{
                  PaperProps: { style: { maxHeight: 200 } },
                }}
                multiple
                id="users"
                size="small"
                fullWidth
                placeholder="Active"
                onChange={handleChange}
                onBlur={handleBlur}
                name="users"
                className={!values.user_department ? "disabled" : ""}
                disabled={values.user_department?.length === 0 || disabled}
                value={values.users || []}
                renderValue={(val: any) => {
                  if (loading) {
                    return (
                      <Box display={"flex"} alignItems="center">
                        <CircularProgress size={20} />
                      </Box>
                    );
                  }
                  const fullNames = val.map((id: any) => {
                    const assignee = assigneesData.find((item: any) => item.id === id);
                    return assignee ? assignee.full_name : "";
                  });
                  return fullNames.join(", ");
                }}
                error={Boolean(touched.users && errors.users)}
              >
                {assigneesData?.map((item: any, index: number) => {
                  return (
                    <MenuItem key={item?.id} value={item?.id}>
                      {item?.full_name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormGroup>
          </Grid>
        </Grid>
        <Grid item xs={2.4} flexDirection="column">
          <Grid item xs={12}>
            <InputLabel htmlFor="priority">
              <div className="label-heading">
                Priority <sup>*</sup>
              </div>
            </InputLabel>
          </Grid>
          <Grid item xs={12}>
            <FormGroup className="input-holder">
              <Select
                MenuProps={{
                  PaperProps: { style: { maxHeight: 200 } },
                }}
                id="priority"
                size="small"
                fullWidth
                placeholder="Active"
                onChange={handleChange}
                onBlur={handleBlur}
                name="priority"
                className={disabled ? "disabled" : ""}
                disabled={disabled}
                value={values.priority}
                error={Boolean(touched.priority && errors.priority)}
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
              </Select>
            </FormGroup>
          </Grid>
        </Grid>
        <Grid item xs={2.4} flexDirection="column">
          <Grid item xs={12}>
            <InputLabel htmlFor="status">
              <div className="label-heading">
                Status <sup>*</sup>
              </div>
            </InputLabel>
          </Grid>
          <Grid item xs={12}>
            <FormGroup className="input-holder">
              <Select
                MenuProps={{
                  PaperProps: { style: { maxHeight: 200 } },
                }}
                id="status"
                size="small"
                fullWidth
                placeholder="Active"
                onChange={handleChange}
                onBlur={handleBlur}
                name="status"
                className={disabled ? "disabled" : ""}
                disabled={disabled}
                value={values?.status}
                error={Boolean(touched.status && errors.status)}
              >
                {activityStatus?.map((item: any, index: number) => (
                  <MenuItem value={item.id} key={item.id}>
                    {item?.name}
                  </MenuItem>
                ))}

                {/* <MenuItem value="Todo">Todo</MenuItem> */}
                {/* <MenuItem value="In Progress">In Progress</MenuItem> */}
                {/* <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Done">Done</MenuItem> */}
              </Select>
            </FormGroup>
          </Grid>
        </Grid>
        <Grid item xs={2.4} flexDirection="column">
          <Grid item xs={12}>
            <InputLabel htmlFor="due_date">
              <div className="label-heading">
                Due Date <sup>*</sup>
              </div>
            </InputLabel>
          </Grid>
          <Grid item xs={12}>
            <FormGroup className="input-holder __date__time">
              <input
                id="due_date"
                type="datetime-local"
                placeholder=""
                name="due_date"
                onChange={handleChange}
                onBlur={handleBlur}
                className={disabled ? "disabled" : ""}
                disabled={disabled}
                // value={values.due_date}
                value={moment(values.due_date).format("YYYY-MM-DDTHH:mm")}
                style={{ fontFamily: "Inter", fontSize: "16px" }}
              />
            </FormGroup>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={1}
        className="formGroupItem"
        flexDirection="column"
        justifyContent="start"
        paddingRight={"0px"}
      >
        <Grid item xs={2}>
          <Box sx={{ fontWeight: 500 }}>Issue</Box>
          <FormControlLabel
            control={
              <Checkbox
                className={disabled ? "disabled" : ""}
                name={`is_issue`}
                checked={values.is_issue}
                onChange={(e: any) => {
                  setFieldValue("is_issue", e?.target?.checked);
                }}
                disabled={disabled}
              />
            }
            label={<span style={{ fontSize: "14px" }}>Issue</span>}
          />
        </Grid>
        {values?.is_issue && isEdit && (
          <Grid item xs={6}>
            <Box sx={{ fontWeight: 500 }}>Forms</Box>
            <Box
              sx={{ display: "flex", alignItems: "center", justifyContent: "start", gap: "10px" }}
            >
              <Box sx={{ width: "70%" }}>
                <Select
                  // MenuProps={{
                  //   PaperProps: { style: { maxHeight: 200 } },
                  // }}
                  sx={{ overflow: "hidden" }}
                  id="selectedTemplated"
                  size="small"
                  fullWidth
                  placeholder="Active"
                  onChange={(e: any) => {
                    setSelectedTemplate(e.target.value);
                  }}
                  onBlur={handleBlur}
                  name="selectedTemplated"
                  value={selectedTemplate}
                  className={disabled ? "disabled" : ""}
                  disabled={disabled}
                  error={Boolean(touched.status && errors.status)}
                >
                  {templates &&
                    templates?.items?.map((item: any, index: number) => (
                      <MenuItem value={item.id} key={item.id}>
                        {item?.name}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
              <Button
                variant="contained"
                onClick={() => {
                  navigate({
                    pathname: `/template/inspection/${Number(selectedTemplate)}`,
                    search: `?issue=${assignActivityId}`,
                  });
                }}
                // type="button"
                disabled={!selectedTemplate}
              >
                Start Inspection
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
      <Grid item xs={12} margin={"20px 0"} className="text__editor-assign">
        {/* <AssignTextEditor
          // clearData={clearData}
          disabled={disabled}
          setContentState={setContentState}
          templateHeight={true}
          contentValueState={values?.description}
          values={values}
          name={'description'}
        /> */}
        <TextEditor name="description" initialContent={values?.description} />
      </Grid>
    </Box>
  );
};

export default AssignActivityForm;
