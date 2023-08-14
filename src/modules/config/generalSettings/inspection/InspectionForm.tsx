import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import {
  Button,
  CircularProgress,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import { Formik, FormikProps } from "formik";
import { RegionProps } from "interfaces/configs";
import React, { FC, useState } from "react";
import { ConfigRegionsSchema } from "validationSchemas/config";
import { postAPI, putAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import { useConfigStore } from "globalStates/config";
import { useParams } from "react-router-dom";

const InspectionForm: FC<{ region: RegionProps }> = ({ region }) => {
  const initialValues: RegionProps = region;
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { addRegions, updateRegions } = useConfigStore();

  return (
    <div className="region-form-holder">
      <ConfirmationModal
        openModal={openModal}
        setOpenModal={() => setOpenModal(!openModal)}
        handelConfirmation={() => {}}
        confirmationHeading="Region created successfully!"
        confirmationDesc="The region table content has been successfully updated according to the way you customized."
        status="success"
        confirmationIcon="/assets/icons/icon-success.svg"
        isSuccess
        IsSingleBtn
        btnText="View"
      />
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={ConfigRegionsSchema}
        onSubmit={async (values, formikHelpers) => {
          try {
            setLoading(true);
            if (values.id) {
              const { data } = await putAPI(`region/${values.id}`, {
                ...values,
                // notification_email: [values.notification_email],
              });
              updateRegions(values);
            } else {
              const { data } = await postAPI("/region/", [
                {
                  ...values,
                  notification_email: [values.notification_email],
                },
              ]);
              addRegions(values);
            }
            setOpenModal(true);
            setLoading(false);
            formikHelpers.resetForm();
          } catch (error: any) {
            enqueueSnackbar(error.response.data.message || "Something went wrong!", {
              variant: "error",
            });
            setLoading(false);
          }
        }}
      >
        {(props: FormikProps<RegionProps>) => {
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
            <form className="region-form" onSubmit={handleSubmit}>
              {loading && <CircularProgress className="page-loader" />}
              <div className="region-fieldset">
                <Grid container spacing={4} className="formGroupItem">
                  <Grid item xs={4}>
                    <InputLabel htmlFor="name">
                      <div className="label-heading">
                        Region Name <sup>*</sup>
                      </div>
                    </InputLabel>
                  </Grid>
                  <Grid item xs={7}>
                    <FormGroup className="input-holder">
                      <OutlinedInput
                        id="name"
                        type="text"
                        placeholder="Select here"
                        size="small"
                        fullWidth
                        name="name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                        error={Boolean(touched.name && errors.name)}
                      />
                      {Boolean(touched.name && errors.name) && (
                        <FormHelperText error>{errors.name}</FormHelperText>
                      )}
                    </FormGroup>
                  </Grid>
                </Grid>
                <Grid container spacing={4} className="formGroupItem">
                  <Grid item xs={4}>
                    <InputLabel htmlFor="code">
                      <div className="label-heading">
                        Region Code <sup>*</sup>
                      </div>
                    </InputLabel>
                  </Grid>
                  <Grid item xs={7}>
                    <FormGroup className="input-holder">
                      <OutlinedInput
                        id="code"
                        type="text"
                        placeholder="Enter here"
                        size="small"
                        fullWidth
                        name="code"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.code}
                        error={Boolean(touched.code && errors.code)}
                      />
                      {Boolean(touched.code && errors.code) && (
                        <FormHelperText error>{errors.code}</FormHelperText>
                      )}
                    </FormGroup>
                  </Grid>
                </Grid>
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
                        id="status"
                        size="small"
                        fullWidth
                        placeholder="Active"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="status"
                        value={values.status}
                        error={Boolean(touched.status && errors.status)}
                      >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                      </Select>
                      {Boolean(touched.status && errors.status) && (
                        <FormHelperText error>{errors.status}</FormHelperText>
                      )}
                    </FormGroup>
                  </Grid>
                </Grid>
                <Grid container spacing={4} className="formGroupItem">
                  <Grid item xs={4}>
                    <InputLabel htmlFor="notification_email">
                      <div className="label-heading">Notification Email ID</div>
                      <p>Multiple Email ID can be added.</p>
                    </InputLabel>
                  </Grid>
                  <Grid item xs={7}>
                    <FormGroup className="input-holder">
                      <OutlinedInput
                        id="notification_email"
                        type="text"
                        placeholder="Enter here"
                        size="small"
                        fullWidth
                        name="notification_email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.notification_email}
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
                <Grid container spacing={4} className="formGroupItem text-area">
                  <Grid item xs={4}>
                    <InputLabel htmlFor="notes">
                      <div className="label-heading">Add Notes</div>
                      <p>A message from you that has to communicated to.</p>
                    </InputLabel>
                  </Grid>
                  <Grid item xs={7}>
                    <FormGroup className="input-holder">
                      {/* <OutlinedInput
                        id="notes"
                        type="textarea"
                        placeholder="Type any message that has to be passed on."
                        size="small"
                        fullWidth
                        name="notes"
                        minRows={2}
                        multiline
                        maxRows={2}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        defaultValue={values.notes}
                        value={values.notes}
                      /> */}
                      <TextareaAutosize
                        placeholder="Type any message that has to be passed on."
                        // rows={3}
                        // InputProps={{
                        //   rows: 1,
                        // }}
                        // maxRows={3}
                        className="text-area-region"
                        id="notes"
                        name="notes"
                        onChange={(ev) => {
                          setFieldValue("notes", ev.target.value);
                          setFieldTouched("notes");
                        }}
                        onBlur={handleBlur}
                        value={values.notes}
                        minRows={3}
                        maxLength={300}
                      />
                      <FormHelperText>
                        {300 - Number(values.notes?.length)} characters left
                      </FormHelperText>
                    </FormGroup>
                  </Grid>
                </Grid>
              </div>
              <div className="action-button-holder">
                <Grid container spacing={2} justifyContent="flex-end">
                  <Grid item>
                    <Button variant="outlined">Add Another Region</Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={!isValid || !dirty || isSubmitting}
                    >
                      Save & Proceed
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default InspectionForm;
