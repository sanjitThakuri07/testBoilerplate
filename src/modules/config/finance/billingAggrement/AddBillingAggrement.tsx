import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import {
  Button,
  Checkbox,
  CircularProgress,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  OutlinedInput,
  Autocomplete,
  TextField,
} from "@mui/material";
import { Formik, FormikProps } from "formik";
import { BillingAgreementProps } from "interfaces/configs";
import React, { FC, useEffect, useState } from "react";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import { useFinanceBillingAgreementStore } from "globalStates/config";
import { BillingAgreementSchema } from "validationSchemas/config";
import { useParams, useNavigate } from "react-router-dom";
import FullPageLoader from "src/components/FullPageLoader";

const BillingAggrementForm = ({ disabled }: any) => {
  const [inspectionOption, setInspectionOption] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [initialValues, setInitialValues] = useState<BillingAgreementProps>({
    name: "",
    status: "Active",
    inspections: [],
    id: null,
  });

  const { updateBillingAgreements, addBillingAgreements } = useFinanceBillingAgreementStore();
  const param = useParams<{ billingId: string }>();
  const navigate = useNavigate();

  const fetchInitialValues = async () => {
    if (param.billingId) {
      const { status, data } = await getAPI(`billing-agreement-names/${param.billingId}`);

      if (status === 200) {
        setInitialValues({
          name: data.name,
          status: data.status,
          inspections: data?.inspections?.map((opt: any) => {
            const data = { value: opt.id, label: opt.name };
            return data;
          }),
          id: data.id,
        });
      }
    }
  };

  const fetchInspection = async () => {
    const { status, data } = await getAPI("inspection-name/");

    if (status === 200) {
      const options = data;
      const inspections = options.items.map((opt: any) => {
        const data = { value: opt.id, label: opt.name };
        return data;
      });
      setInspectionOption(inspections);
    }
  };

  useEffect(() => {
    fetchInspection();
    fetchInitialValues();
  }, [param.billingId]);

  return (
    <div className="region-form-holder">
      <ConfirmationModal
        openModal={openModal}
        setOpenModal={() => setOpenModal(!openModal)}
        handelConfirmation={() => {
          setOpenModal(false);
          navigate(-1);
        }}
        confirmationHeading="Billing Agreement Name created successfully!"
        confirmationDesc="The Billing Agreement Name table content has been successfully updated according to the way you customized."
        status="success"
        confirmationIcon="/assets/icons/icon-success.svg"
        isSuccess
        IsSingleBtn
        btnText="Go to Billing Agreement Name"
      />

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={BillingAgreementSchema}
        onSubmit={async (values, formikHelpers) => {
          if (disabled) return;
          let payload = {
            id: values?.id,
            name: values.name,
            status: values.status,
            inspection_name: values?.inspections?.map((opt: any) => opt.value),
          };
          try {
            setLoading(true);
            if (values.id) {
              const { data } = await putAPI(`billing-agreement-names/${values.id}`, payload);
              updateBillingAgreements(values);
            } else {
              const { data } = await postAPI("/billing-agreement-names/", [payload]);
              addBillingAgreements(values);
            }
            setOpenModal(true);
            setLoading(false);
            formikHelpers.resetForm();
          } catch (error: any) {
            enqueueSnackbar(error?.response?.data?.detail?.message || "Something went wrong!", {
              variant: "error",
            });
            setLoading(false);
          }
        }}
      >
        {(props: FormikProps<BillingAgreementProps>) => {
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
            <form className="region-form position-relative" onSubmit={handleSubmit}>
              {loading && <FullPageLoader className="custom__page-loader" />}
              <div className="region-fieldset">
                <Grid container spacing={4} className="formGroupItem">
                  <Grid item xs={4}>
                    <InputLabel htmlFor="name">
                      <div className="label-heading">
                        Billing Agreement Name <sup>*</sup>
                      </div>
                    </InputLabel>
                  </Grid>
                  <Grid item xs={7}>
                    <FormGroup className="input-holder">
                      <OutlinedInput
                        id="name"
                        type="text"
                        placeholder="Enter here"
                        size="small"
                        fullWidth
                        name="name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                        error={Boolean(touched.name && errors.name)}
                        disabled={disabled}
                        className={disabled ? "disabled" : ""}
                      />
                      {Boolean(touched.name && errors.name) && (
                        <FormHelperText error>{errors.name}</FormHelperText>
                      )}
                    </FormGroup>
                  </Grid>
                </Grid>
                <Grid container spacing={4} className="formGroupItem">
                  <Grid item xs={4}>
                    <InputLabel htmlFor="inspections">
                      <div className="label-heading">Inspection Name</div>
                    </InputLabel>
                  </Grid>
                  <Grid item xs={7}>
                    <FormGroup className="input-holder custom-select-search-field-billing-aggrement">
                      <Autocomplete
                        multiple
                        id="inspections"
                        options={inspectionOption}
                        getOptionLabel={(option: any) => option.label}
                        value={values.inspections || []}
                        onChange={(event, newValue: any) => {
                          setFieldValue("inspections", newValue);
                          setFieldTouched("inspections");
                        }}
                        // defaultValue={[optionsHH[0]]}
                        disabled={disabled}
                        className={disabled ? "disabled" : ""}
                        filterSelectedOptions
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Search"
                            disabled={disabled}
                            className={`custom_textfield ${disabled ? "disabled" : ""}`}
                          />
                        )}
                      />
                      {Boolean(touched.inspections && errors.inspections) && (
                        <FormHelperText error>{errors.inspections}</FormHelperText>
                      )}
                    </FormGroup>
                  </Grid>
                </Grid>

                <Grid container spacing={4} className="formGroupItem">
                  <Grid item xs={4}>
                    <InputLabel htmlFor="status">
                      <div className="label-heading">Status</div>
                    </InputLabel>
                  </Grid>
                  <Grid item xs={7}>
                    <FormGroup className="input-holder">
                      <MuiSelect
                        id="status"
                        size="small"
                        fullWidth
                        placeholder="Active"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="status"
                        value={values.status}
                        disabled={disabled}
                        className={disabled ? "disabled" : ""}
                        error={Boolean(touched.status && errors.status)}
                      >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                      </MuiSelect>
                      {Boolean(touched.status && errors.status) && (
                        <FormHelperText error>{errors.status}</FormHelperText>
                      )}
                    </FormGroup>
                  </Grid>
                </Grid>
              </div>

              {!disabled && (
                <div className="action-button-holder">
                  <Grid container spacing={2} justifyContent="flex-end">
                    <div className="add_another_btn">
                      <Grid item>
                        <Button variant="outlined">Add Another Billing Agreement Name</Button>
                      </Grid>
                    </div>

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
              )}
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default BillingAggrementForm;
