import { IOSSwitch } from "src/components/switch/IosSwitch";
import {
  CircularProgress,
  Divider,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { ChangeEvent, useState, useEffect } from "react";
import { SystemParamaterPayload } from "src/interfaces/systemParamaters";
import { useFormik } from "formik";
import { getAPI, postAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import { SystemParamatersSchema } from "src/validationSchemas/SystemParamaters";
import { FormikFormHelpers } from "src/interfaces/utils";
import SettingFooter from "src/components/footer/SettingFooter";
import * as yup from "yup";
import OrganizationConfiguration from "src/modules/config/generalSettings/OrganizationConfiguration";
import GeneralSettingLayout from "src/modules/config/generalSettings/GeneralSettingLayout";
import useAppStore from "src/store/zustand/app";
import HeightContainer from "src/components/FixHeightContainer";

const initialValues: SystemParamaterPayload = {
  rows_count: 0,
  region: false,
  region_code_length: 0,

  territory: false,
  territory_code_length: 0,

  inspection_type: false,
  inspection_type_code_length: 0,

  customer: false,
  customer_code_length: 0,

  quotation: false,
  quotation_prefix: "BAS",
  quotation_start_with: 0,
  quotation_code_length: 0,

  booking: false,
  booking_prefix: "BAS",
  booking_start_with: 0,
  booking_code_length: 0,

  invoice: false,
  invoice_prefix: "BAS",
  invoice_start_with: 0,
  invoice_code_length: 0,

  activity: false,
  activity_prefix: "BAS",
  activity_start_with: 0,
  activity_code_length: 0,

  tariff: false,
  tariff_prefix: "BAS",
  tariff_start_with: 0,
  tariff_code_length: 0,
};

const SystemParamaters = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [initialSecurityParameters, setInitialSecurityParameters] =
    useState<SystemParamaterPayload | null>(initialValues);
  const [isViewOnly, setIsViewOnly] = useState<boolean>(true);
  const [stateValues, setStateValues] = useState<SystemParamaterPayload>(initialValues);

  const { enqueueSnackbar } = useSnackbar();
  const { postSystemParameters }: any = useAppStore();

  const handleSystemParamater = async (values: SystemParamaterPayload) => {
    const payload = {
      rows_count: values.rows_count,

      region: values.region,
      region_code_length: values.region ? values.region_code_length : null,

      territory: values.territory,
      territory_code_length: values.territory ? values.territory_code_length : null,

      inspection_type: values.inspection_type,
      inspection_type_code_length: values.inspection_type
        ? values.inspection_type_code_length
        : null,

      customer: values.customer,
      customer_code_length: values.customer ? values.customer_code_length : null,

      quotation: values.quotation,
      quotation_prefix: values.quotation ? values.quotation_prefix : null,
      quotation_start_with: values.quotation ? values.quotation_start_with : null,
      quotation_code_length: values.quotation ? values.quotation_code_length : null,

      booking: values.booking,
      booking_prefix: values.booking ? values.booking_prefix : null,
      booking_start_with: values.booking ? values.booking_start_with : null,
      booking_code_length: values.booking ? values.booking_code_length : null,

      invoice: values.invoice,
      invoice_prefix: values.invoice ? values.invoice_prefix : null,
      invoice_start_with: values.invoice ? values.invoice_start_with : null,
      invoice_code_length: values.invoice ? values.invoice_code_length : null,

      activity: values.activity,
      activity_prefix: values.activity ? values.activity_prefix : null,
      activity_start_with: values.activity ? values.activity_start_with : null,
      activity_code_length: values.activity ? values.activity_code_length : null,

      tariff: values.tariff,
      tariff_prefix: values.tariff ? values.tariff_prefix : null,
      tariff_start_with: values.tariff ? values.tariff_start_with : null,
      tariff_code_length: values.tariff ? values.tariff_code_length : null,
    };

    setLoading(true);
    const response = await postSystemParameters({ values: payload, enqueueSnackbar });

    if (response) {
      setInitialSecurityParameters(values);
      setIsViewOnly(true);
      setLoading(false);
    } else {
      // resetForm();
      initialSecurityParameters && setValues(initialSecurityParameters);
    }
    setLoading(false);

    // try {
    //   setLoading(true);
    //   const { data, ...res } = await postAPI('/system-parameters/', payload);
    //   setInitialSecurityParameters(values);
    //   setIsViewOnly(true);
    //   setLoading(false);
    //   // enqueueSnackbar(res?.message || 'updated successfully', {
    //   //   variant: 'success',
    //   // });
    // } catch (error: any) {
    //   setLoading(false);
    //   resetForm();
    //   initialSecurityParameters && setValues(initialSecurityParameters);
    //   enqueueSnackbar(error?.detail || 'Error on update the user security', {
    //     variant: 'error',
    //   });
    // }
  };

  const formik = useFormik({
    enableReinitialize: true,
    onSubmit: handleSystemParamater,
    initialValues,
    validationSchema: SystemParamatersSchema(stateValues),
  });

  const {
    touched,
    values,
    errors,
    handleChange,
    handleBlur,
    setFieldTouched,
    setFieldValue,
    handleSubmit,
    resetForm,
    isValid,
    setValues,
    dirty,
  } = formik;

  useEffect(() => {
    setStateValues(values);
    SystemParamatersSchema(stateValues);
  }, [values, stateValues]);

  const fetchUserParamaters = async () => {
    try {
      setLoading(true);
      const { data } = await getAPI("system-parameters/");
      if (!data) {
        setValues(initialValues);
      } else {
        setValues(data);
      }
      initialSecurityParameters && setInitialSecurityParameters(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      resetForm();
      initialSecurityParameters && setValues(initialSecurityParameters);
    }
  };

  const handleSwitchChange = (ev: ChangeEvent<HTMLInputElement>): void => {
    const name = ev.target.name as keyof SystemParamaterPayload;
    setFieldValue(name, !values[name]);
    setFieldTouched(name);
  };

  const handleViewOnly = () => {
    setIsViewOnly(!isViewOnly);
    resetForm();
    initialSecurityParameters && setValues(initialSecurityParameters);
  };

  const formikHelpers: FormikFormHelpers = {
    isValid,
    dirty,
    touched: Object.values(touched).length > 0,
  };

  useEffect(() => {
    fetchUserParamaters();
  }, []);

  return (
    <>
      <OrganizationConfiguration>
        <GeneralSettingLayout>
          <HeightContainer>
            <div className="align-Box">
              <div className="position-sticky-edit">
                <SettingFooter
                  isViewOnly={isViewOnly}
                  loading={loading}
                  handleViewOnly={handleViewOnly}
                  formikHelpers={formikHelpers}
                  handleSubmit={handleSubmit}
                />
              </div>
            </div>
            <Box sx={{ p: "30px" }}>
              <div className="system_paramaters">
                <Box>
                  <Box sx={{ maxWidth: "1000px" }}>
                    <Typography variant="h3" color="primary">
                      System Parameters
                    </Typography>
                    <Typography variant="body1" component="p">
                      Update your private keys and others details here.
                    </Typography>
                  </Box>
                  <Divider sx={{ margin: "25px 0" }} />
                </Box>

                <Box>
                  <form className="profile-form" onSubmit={handleSubmit}>
                    {/* do not forget to use handle change */}
                    {loading && <CircularProgress className="page-loader" />}
                    <Grid
                      container
                      spacing={4}
                      className="formGroupItem"
                      sx={{ maxWidth: "1000px" }}
                    >
                      <Grid item xs={5}>
                        <InputLabel htmlFor="rows_count">
                          <div className="label-heading">
                            Number of rows for presenting data by default
                          </div>
                          <Typography variant="body1" component="p">
                            User can set the number of columns that has to be displayed by default
                          </Typography>
                        </InputLabel>
                      </Grid>
                      <Grid item xs={6}>
                        <FormGroup className="input-holder">
                          <OutlinedInput
                            name="rows_count"
                            id="rows_count"
                            type="number"
                            placeholder="000"
                            size="small"
                            fullWidth
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values?.rows_count}
                            error={Boolean(touched?.rows_count && errors?.rows_count)}
                            disabled={isViewOnly}
                            inputProps={{
                              maxLength: 15,
                            }}
                          />
                          {/* touched?.rows_count &&  */}
                          {Boolean(errors?.rows_count && touched?.rows_count) && (
                            <FormHelperText error>{errors?.rows_count}</FormHelperText>
                          )}
                        </FormGroup>
                      </Grid>
                    </Grid>

                    <Box sx={{ margin: "55px 0" }}>
                      <Box sx={{ maxWidth: "1000px" }}>
                        <Typography variant="h3" color="primary">
                          Code Creations
                        </Typography>
                        <Typography variant="body1" component="p">
                          Set your terms here.
                        </Typography>
                      </Box>
                      <Divider sx={{ margin: "15px 0" }} />
                    </Box>

                    <Box sx={{ maxWidth: "1000px" }}>
                      <Grid container spacing={4} className="formGroupItem">
                        <Grid item xs={5}>
                          <InputLabel htmlFor="region">
                            <div className="label-heading">Region</div>
                            <Typography variant="body1" component="p">
                              On enabling, system automatically generate codes on adding new region
                            </Typography>
                          </InputLabel>
                        </Grid>
                        <Grid item xs={6}>
                          <FormGroup className="input-holder">
                            <IOSSwitch
                              checked={values?.region}
                              name="region"
                              onChange={handleSwitchChange}
                              disabled={isViewOnly}
                            />
                          </FormGroup>
                        </Grid>
                      </Grid>

                      {values?.region && (
                        <Grid container spacing={4} className="formGroupItem">
                          <Grid item xs={5}>
                            <InputLabel htmlFor="region_code_length">
                              <div className="label-heading">
                                Length of the code generated by the system{" "}
                              </div>
                            </InputLabel>
                          </Grid>
                          <Grid item xs={6}>
                            <FormGroup className="input-holder">
                              <OutlinedInput
                                name="region_code_length"
                                id="region_code_length"
                                type="number"
                                placeholder="000"
                                size="small"
                                fullWidth
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values?.region_code_length}
                                error={Boolean(
                                  touched?.region_code_length && errors?.region_code_length,
                                )}
                                disabled={isViewOnly}
                              />
                              {Boolean(
                                touched?.region_code_length && errors?.region_code_length,
                              ) && (
                                <FormHelperText error>{errors?.region_code_length}</FormHelperText>
                              )}
                            </FormGroup>
                          </Grid>
                        </Grid>
                      )}

                      <Grid container spacing={4} className="formGroupItem">
                        <Grid item xs={5}>
                          <InputLabel htmlFor="territory">
                            <div className="label-heading">Territory</div>
                            <Typography variant="body1" component="p">
                              On enabling, system automatically generate codes on adding new
                              territory
                            </Typography>
                          </InputLabel>
                        </Grid>
                        <Grid item xs={6}>
                          <FormGroup className="input-holder">
                            <IOSSwitch
                              checked={values?.territory}
                              name="territory"
                              onChange={handleSwitchChange}
                              disabled={isViewOnly}
                            />
                          </FormGroup>
                        </Grid>
                      </Grid>

                      {values?.territory && (
                        <Box>
                          <Grid container spacing={4} className="formGroupItem">
                            <Grid item xs={5}>
                              <InputLabel htmlFor="territory_code_length">
                                <div className="label-heading">
                                  Length of the code generated by the system{" "}
                                </div>
                              </InputLabel>
                            </Grid>
                            <Grid item xs={6}>
                              <FormGroup className="input-holder">
                                <OutlinedInput
                                  name="territory_code_length"
                                  id="territory_code_length"
                                  type="number"
                                  placeholder="000"
                                  size="small"
                                  fullWidth
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values?.territory_code_length}
                                  error={Boolean(
                                    touched?.territory_code_length && errors?.territory_code_length,
                                  )}
                                  disabled={isViewOnly}
                                />
                                {Boolean(
                                  touched?.territory_code_length && errors?.territory_code_length,
                                ) && (
                                  <FormHelperText error>
                                    {errors?.territory_code_length}
                                  </FormHelperText>
                                )}
                              </FormGroup>
                            </Grid>
                          </Grid>
                        </Box>
                      )}

                      <Grid container spacing={4} className="formGroupItem">
                        <Grid item xs={5}>
                          <InputLabel htmlFor="inspection_type">
                            <div className="label-heading">Inspection types</div>
                            <Typography variant="body1" component="p">
                              On enabling, system automatically generate codes on adding new
                              inspection types
                            </Typography>
                          </InputLabel>
                        </Grid>
                        <Grid item xs={6}>
                          <FormGroup className="input-holder">
                            <IOSSwitch
                              checked={values?.inspection_type}
                              name="inspection_type"
                              onChange={handleSwitchChange}
                              disabled={isViewOnly}
                            />
                          </FormGroup>
                        </Grid>
                      </Grid>

                      {values?.inspection_type && (
                        <Box>
                          <Grid container spacing={4} className="formGroupItem">
                            <Grid item xs={5}>
                              <InputLabel htmlFor="inspection_type_code_length">
                                <div className="label-heading">
                                  Length of the code generated by the system{" "}
                                </div>
                              </InputLabel>
                            </Grid>
                            <Grid item xs={6}>
                              <FormGroup className="input-holder">
                                <OutlinedInput
                                  name="inspection_type_code_length"
                                  id="inspection_type_code_length"
                                  type="number"
                                  placeholder="000"
                                  size="small"
                                  fullWidth
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values?.inspection_type_code_length}
                                  error={Boolean(
                                    touched?.inspection_type_code_length &&
                                      errors?.inspection_type_code_length,
                                  )}
                                  disabled={isViewOnly}
                                />
                                {Boolean(
                                  touched?.inspection_type_code_length &&
                                    errors?.inspection_type_code_length,
                                ) && (
                                  <FormHelperText error>
                                    {errors?.inspection_type_code_length}
                                  </FormHelperText>
                                )}
                              </FormGroup>
                            </Grid>
                          </Grid>
                        </Box>
                      )}

                      <Grid container spacing={4} className="formGroupItem">
                        <Grid item xs={5}>
                          <InputLabel htmlFor="customer">
                            <div className="label-heading">Customer</div>
                            <Typography variant="body1" component="p">
                              On enabling, system automatically generate codes on adding new
                              customer
                            </Typography>
                          </InputLabel>
                        </Grid>
                        <Grid item xs={6}>
                          <FormGroup className="input-holder">
                            <IOSSwitch
                              checked={values?.customer}
                              name="customer"
                              onChange={handleSwitchChange}
                              disabled={isViewOnly}
                            />
                          </FormGroup>
                        </Grid>
                      </Grid>

                      {values?.customer && (
                        <Box>
                          <Grid container spacing={4} className="formGroupItem">
                            <Grid item xs={5}>
                              <InputLabel htmlFor="customer_code_length">
                                <div className="label-heading">
                                  Length of the code generated by the system{" "}
                                </div>
                              </InputLabel>
                            </Grid>
                            <Grid item xs={6}>
                              <FormGroup className="input-holder">
                                <OutlinedInput
                                  name="customer_code_length"
                                  id="customer_code_length"
                                  type="number"
                                  placeholder="000"
                                  size="small"
                                  fullWidth
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values?.customer_code_length}
                                  error={Boolean(
                                    touched?.customer_code_length && errors?.customer_code_length,
                                  )}
                                  disabled={isViewOnly}
                                />
                                {Boolean(
                                  touched?.customer_code_length && errors?.customer_code_length,
                                ) && (
                                  <FormHelperText error>
                                    {errors?.customer_code_length}
                                  </FormHelperText>
                                )}
                              </FormGroup>
                            </Grid>
                          </Grid>
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ maxWidth: "1000px" }}>
                      <Box>
                        <Box sx={{ margin: "55px 0" }}>
                          <Box sx={{ maxWidth: "1000px" }}>
                            <Typography variant="h3" color="primary">
                              Sequence Creations
                            </Typography>
                            <Typography variant="body1" component="p">
                              Set your terms here.
                            </Typography>
                          </Box>
                          <Divider sx={{ margin: "15px 0" }} />
                        </Box>
                      </Box>

                      <div id="Sequence_creation">
                        <div className="sequence_creation_item">
                          <Grid container spacing={4} className="formGroupItem">
                            <Grid item xs={5}>
                              <InputLabel htmlFor="quotation">
                                <div className="label-heading">Quotation ID</div>
                                <Typography variant="body1" component="p">
                                  On enabling, system allows you to set prefixes and length of the
                                  Quotation ID for continuous reoccurrence.
                                </Typography>
                              </InputLabel>
                            </Grid>
                            <Grid item xs={6}>
                              <FormGroup className="input-holder">
                                <IOSSwitch
                                  checked={values?.quotation}
                                  name="quotation"
                                  onChange={handleSwitchChange}
                                  disabled={isViewOnly}
                                />
                              </FormGroup>
                            </Grid>
                          </Grid>

                          {values?.quotation && (
                            <>
                              <Grid container spacing={4} className="formGroupItem">
                                <Grid item xs={5}>
                                  <InputLabel htmlFor="quotation_prefix">
                                    <div className="label-heading">Prefix</div>
                                  </InputLabel>
                                </Grid>
                                <Grid item xs={6}>
                                  <FormGroup className="input-holder">
                                    <OutlinedInput
                                      name="quotation_prefix"
                                      id="quotation_prefix"
                                      type="text"
                                      placeholder="BAS"
                                      size="small"
                                      fullWidth
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values?.quotation_prefix}
                                      error={Boolean(
                                        touched?.quotation_prefix && errors?.quotation_prefix,
                                      )}
                                      disabled={isViewOnly}
                                    />
                                    {Boolean(
                                      touched?.quotation_prefix && errors?.quotation_prefix,
                                    ) && (
                                      <FormHelperText error>
                                        {errors?.quotation_prefix}
                                      </FormHelperText>
                                    )}
                                  </FormGroup>
                                </Grid>
                              </Grid>

                              <Grid container spacing={4} className="formGroupItem">
                                <Grid item xs={5}>
                                  <InputLabel htmlFor="quotation_start_with">
                                    <div className="label-heading">Start with</div>
                                  </InputLabel>
                                </Grid>
                                <Grid item xs={6}>
                                  <FormGroup className="input-holder">
                                    <OutlinedInput
                                      name="quotation_start_with"
                                      id="quotation_start_with"
                                      type="number"
                                      placeholder="000001"
                                      size="small"
                                      fullWidth
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      inputProps={{ maxLength: 6 }}
                                      value={values?.quotation_start_with}
                                      error={Boolean(
                                        touched?.quotation_start_with &&
                                          errors?.quotation_start_with,
                                      )}
                                      disabled={isViewOnly}
                                    />
                                    {Boolean(
                                      touched?.quotation_start_with && errors?.quotation_start_with,
                                    ) && (
                                      <FormHelperText error>
                                        {errors?.quotation_start_with}
                                      </FormHelperText>
                                    )}
                                  </FormGroup>
                                </Grid>
                              </Grid>

                              <Grid container spacing={4} className="formGroupItem">
                                <Grid item xs={5}>
                                  <InputLabel htmlFor="quotation_code_length">
                                    <div className="label-heading">Maximum Length</div>
                                  </InputLabel>
                                </Grid>
                                <Grid item xs={6}>
                                  <FormGroup className="input-holder">
                                    <OutlinedInput
                                      name="quotation_code_length"
                                      id="quotation_code_length"
                                      placeholder="000"
                                      size="small"
                                      type="number"
                                      fullWidth
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values?.quotation_code_length}
                                      error={Boolean(
                                        touched?.quotation_code_length &&
                                          errors?.quotation_code_length,
                                      )}
                                      disabled={isViewOnly}
                                    />
                                    {Boolean(
                                      touched?.quotation_code_length &&
                                        errors?.quotation_code_length,
                                    ) && (
                                      <FormHelperText error>
                                        {errors?.quotation_code_length}
                                      </FormHelperText>
                                    )}
                                  </FormGroup>
                                </Grid>
                              </Grid>
                              <Divider />
                            </>
                          )}
                        </div>

                        {/* ---------------- */}

                        <div
                          className="sequence_creation_item"
                          style={{
                            marginTop: "20px",
                          }}
                        >
                          <Grid container spacing={4} className="formGroupItem">
                            <Grid item xs={5}>
                              <InputLabel htmlFor="booking">
                                <div className="label-heading">Booking ID</div>
                                <Typography variant="body1" component="p">
                                  On enabling, system allows you to set prefixes and length of the
                                  Booking ID for continuous reoccurrence.
                                </Typography>
                              </InputLabel>
                            </Grid>
                            <Grid item xs={6}>
                              <FormGroup className="input-holder">
                                <IOSSwitch
                                  checked={values?.booking}
                                  name="booking"
                                  onChange={handleSwitchChange}
                                  disabled={isViewOnly}
                                />
                              </FormGroup>
                            </Grid>
                          </Grid>

                          {values?.booking && (
                            <>
                              <Grid container spacing={4} className="formGroupItem">
                                <Grid item xs={5}>
                                  <InputLabel htmlFor="booking_prefix">
                                    <div className="label-heading">Prefix</div>
                                  </InputLabel>
                                </Grid>
                                <Grid item xs={6}>
                                  <FormGroup className="input-holder">
                                    <OutlinedInput
                                      name="booking_prefix"
                                      id="booking_prefix"
                                      type="text"
                                      placeholder="BAS"
                                      size="small"
                                      fullWidth
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values?.booking_prefix}
                                      error={Boolean(
                                        touched?.booking_prefix && errors?.booking_prefix,
                                      )}
                                      disabled={isViewOnly}
                                    />
                                    {Boolean(touched?.booking_prefix && errors?.booking_prefix) && (
                                      <FormHelperText error>
                                        {errors?.booking_prefix}
                                      </FormHelperText>
                                    )}
                                  </FormGroup>
                                </Grid>
                              </Grid>

                              <Grid container spacing={4} className="formGroupItem">
                                <Grid item xs={5}>
                                  <InputLabel htmlFor="booking_start_with">
                                    <div className="label-heading">Start with</div>
                                  </InputLabel>
                                </Grid>
                                <Grid item xs={6}>
                                  <FormGroup className="input-holder">
                                    <OutlinedInput
                                      name="booking_start_with"
                                      id="booking_start_with"
                                      type="number"
                                      placeholder="000001"
                                      size="small"
                                      fullWidth
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values?.booking_start_with}
                                      error={Boolean(
                                        touched?.booking_start_with && errors?.booking_start_with,
                                      )}
                                      disabled={isViewOnly}
                                    />
                                    {Boolean(
                                      touched?.booking_start_with && errors?.booking_start_with,
                                    ) && (
                                      <FormHelperText error>
                                        {errors?.booking_start_with}
                                      </FormHelperText>
                                    )}
                                  </FormGroup>
                                </Grid>
                              </Grid>

                              <Grid container spacing={4} className="formGroupItem">
                                <Grid item xs={5}>
                                  <InputLabel htmlFor="booking_code_length">
                                    <div className="label-heading">Maximum Length</div>
                                  </InputLabel>
                                </Grid>
                                <Grid item xs={6}>
                                  <FormGroup className="input-holder">
                                    <OutlinedInput
                                      name="booking_code_length"
                                      id="booking_code_length"
                                      placeholder="000"
                                      size="small"
                                      type="number"
                                      fullWidth
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values?.booking_code_length}
                                      error={Boolean(
                                        touched?.booking_code_length && errors?.booking_code_length,
                                      )}
                                      disabled={isViewOnly}
                                    />
                                    {Boolean(
                                      touched?.booking_code_length && errors?.booking_code_length,
                                    ) && (
                                      <FormHelperText error>
                                        {errors?.booking_code_length}
                                      </FormHelperText>
                                    )}
                                  </FormGroup>
                                </Grid>
                              </Grid>
                              <Divider />
                            </>
                          )}
                        </div>

                        {/* ---------------- */}

                        <div
                          className="sequence_creation_item"
                          style={{
                            marginTop: "20px",
                          }}
                        >
                          <Grid container spacing={4} className="formGroupItem">
                            <Grid item xs={5}>
                              <InputLabel htmlFor="invoice">
                                <div className="label-heading">Invoice ID</div>
                                <Typography variant="body1" component="p">
                                  On enabling, system allows you to set prefixes and length of the
                                  Invoice ID for continuous reoccurrence.
                                </Typography>
                              </InputLabel>
                            </Grid>
                            <Grid item xs={6}>
                              <FormGroup className="input-holder">
                                <IOSSwitch
                                  checked={values?.invoice}
                                  name="invoice"
                                  onChange={handleSwitchChange}
                                  disabled={isViewOnly}
                                />
                              </FormGroup>
                            </Grid>
                          </Grid>

                          {values?.invoice && (
                            <>
                              <Grid container spacing={4} className="formGroupItem">
                                <Grid item xs={5}>
                                  <InputLabel htmlFor="invoice_prefix">
                                    <div className="label-heading">Prefix</div>
                                  </InputLabel>
                                </Grid>
                                <Grid item xs={6}>
                                  <FormGroup className="input-holder">
                                    <OutlinedInput
                                      name="invoice_prefix"
                                      id="invoice_prefix"
                                      type="text"
                                      placeholder="BAS"
                                      size="small"
                                      fullWidth
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values?.invoice_prefix}
                                      error={Boolean(
                                        touched?.invoice_prefix && errors?.invoice_prefix,
                                      )}
                                      disabled={isViewOnly}
                                    />
                                    {Boolean(touched?.invoice_prefix && errors?.invoice_prefix) && (
                                      <FormHelperText error>
                                        {errors?.invoice_prefix}
                                      </FormHelperText>
                                    )}
                                  </FormGroup>
                                </Grid>
                              </Grid>

                              <Grid container spacing={4} className="formGroupItem">
                                <Grid item xs={5}>
                                  <InputLabel htmlFor="invoice_start_with">
                                    <div className="label-heading">Start with</div>
                                  </InputLabel>
                                </Grid>
                                <Grid item xs={6}>
                                  <FormGroup className="input-holder">
                                    <OutlinedInput
                                      name="invoice_start_with"
                                      id="invoice_start_with"
                                      type="number"
                                      placeholder="000001"
                                      size="small"
                                      fullWidth
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values?.invoice_start_with}
                                      error={Boolean(
                                        touched?.invoice_start_with && errors?.invoice_start_with,
                                      )}
                                      disabled={isViewOnly}
                                    />
                                    {Boolean(
                                      touched?.invoice_start_with && errors?.invoice_start_with,
                                    ) && (
                                      <FormHelperText error>
                                        {errors?.invoice_start_with}
                                      </FormHelperText>
                                    )}
                                  </FormGroup>
                                </Grid>
                              </Grid>

                              <Grid container spacing={4} className="formGroupItem">
                                <Grid item xs={5}>
                                  <InputLabel htmlFor="invoice_code_length">
                                    <div className="label-heading">Maximum Length</div>
                                  </InputLabel>
                                </Grid>
                                <Grid item xs={6}>
                                  <FormGroup className="input-holder">
                                    <OutlinedInput
                                      name="invoice_code_length"
                                      id="invoice_code_length"
                                      placeholder="000"
                                      size="small"
                                      type="number"
                                      fullWidth
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values?.invoice_code_length}
                                      error={Boolean(
                                        touched?.invoice_code_length && errors?.invoice_code_length,
                                      )}
                                      disabled={isViewOnly}
                                    />
                                    {Boolean(
                                      touched?.invoice_code_length && errors?.invoice_code_length,
                                    ) && (
                                      <FormHelperText error>
                                        {errors?.invoice_code_length}
                                      </FormHelperText>
                                    )}
                                  </FormGroup>
                                </Grid>
                              </Grid>
                              <Divider />
                            </>
                          )}
                        </div>

                        {/* ---------------- */}

                        <div
                          className="sequence_creation_item"
                          style={{
                            marginTop: "20px",
                          }}
                        >
                          <Grid container spacing={4} className="formGroupItem">
                            <Grid item xs={5}>
                              <InputLabel htmlFor="invoice">
                                <div className="label-heading">Activity ID</div>
                                <Typography variant="body1" component="p">
                                  On enabling, system allows you to set prefixes and length of the
                                  Activity ID for continuous reoccurrence.
                                </Typography>
                              </InputLabel>
                            </Grid>
                            <Grid item xs={6}>
                              <FormGroup className="input-holder">
                                <IOSSwitch
                                  checked={values?.activity}
                                  name="activity"
                                  onChange={handleSwitchChange}
                                  disabled={isViewOnly}
                                />
                              </FormGroup>
                            </Grid>
                          </Grid>

                          {values?.activity && (
                            <>
                              <Grid container spacing={4} className="formGroupItem">
                                <Grid item xs={5}>
                                  <InputLabel htmlFor="activity_prefix">
                                    <div className="label-heading">Prefix</div>
                                  </InputLabel>
                                </Grid>
                                <Grid item xs={6}>
                                  <FormGroup className="input-holder">
                                    <OutlinedInput
                                      name="activity_prefix"
                                      id="activity_prefix"
                                      type="text"
                                      placeholder="BAS"
                                      size="small"
                                      fullWidth
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values?.activity_prefix}
                                      error={Boolean(
                                        touched?.activity_prefix && errors?.activity_prefix,
                                      )}
                                      disabled={isViewOnly}
                                    />
                                    {Boolean(
                                      touched?.activity_prefix && errors?.activity_prefix,
                                    ) && (
                                      <FormHelperText error>
                                        {errors?.activity_prefix}
                                      </FormHelperText>
                                    )}
                                  </FormGroup>
                                </Grid>
                              </Grid>

                              <Grid container spacing={4} className="formGroupItem">
                                <Grid item xs={5}>
                                  <InputLabel htmlFor="activity_start_with">
                                    <div className="label-heading">Start with</div>
                                  </InputLabel>
                                </Grid>
                                <Grid item xs={6}>
                                  <FormGroup className="input-holder">
                                    <OutlinedInput
                                      name="activity_start_with"
                                      id="activity_start_with"
                                      type="number"
                                      placeholder="000001"
                                      size="small"
                                      fullWidth
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values?.activity_start_with}
                                      error={Boolean(
                                        touched?.activity_start_with && errors?.activity_start_with,
                                      )}
                                      disabled={isViewOnly}
                                    />
                                    {Boolean(
                                      touched?.activity_start_with && errors?.activity_start_with,
                                    ) && (
                                      <FormHelperText error>
                                        {errors?.activity_start_with}
                                      </FormHelperText>
                                    )}
                                  </FormGroup>
                                </Grid>
                              </Grid>

                              <Grid container spacing={4} className="formGroupItem">
                                <Grid item xs={5}>
                                  <InputLabel htmlFor="activity_code_length">
                                    <div className="label-heading">Maximum Length</div>
                                  </InputLabel>
                                </Grid>
                                <Grid item xs={6}>
                                  <FormGroup className="input-holder">
                                    <OutlinedInput
                                      name="activity_code_length"
                                      id="activity_code_length"
                                      placeholder="000"
                                      size="small"
                                      type="number"
                                      fullWidth
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values?.activity_code_length}
                                      error={Boolean(
                                        touched?.activity_code_length &&
                                          errors?.activity_code_length,
                                      )}
                                      disabled={isViewOnly}
                                    />
                                    {Boolean(
                                      touched?.activity_code_length && errors?.activity_code_length,
                                    ) && (
                                      <FormHelperText error>
                                        {errors?.activity_code_length}
                                      </FormHelperText>
                                    )}
                                  </FormGroup>
                                </Grid>
                              </Grid>
                              <Divider />
                            </>
                          )}
                        </div>

                        {/* ---------------- */}

                        <div
                          className="sequence_creation_item"
                          style={{
                            marginTop: "20px",
                          }}
                        >
                          <Grid container spacing={4} className="formGroupItem">
                            <Grid item xs={5}>
                              <InputLabel htmlFor="invoice">
                                <div className="label-heading">Tariff ID</div>
                                <Typography variant="body1" component="p">
                                  On enabling, system allows you to set prefixes and length of the
                                  Tariff ID for continuous reoccurrence.
                                </Typography>
                              </InputLabel>
                            </Grid>
                            <Grid item xs={6}>
                              <FormGroup className="input-holder">
                                <IOSSwitch
                                  checked={values?.tariff}
                                  name="tariff"
                                  onChange={handleSwitchChange}
                                  disabled={isViewOnly}
                                />
                              </FormGroup>
                            </Grid>
                          </Grid>

                          {values?.tariff && (
                            <>
                              <Grid container spacing={4} className="formGroupItem">
                                <Grid item xs={5}>
                                  <InputLabel htmlFor="tariff_prefix">
                                    <div className="label-heading">Prefix</div>
                                  </InputLabel>
                                </Grid>
                                <Grid item xs={6}>
                                  <FormGroup className="input-holder">
                                    <OutlinedInput
                                      name="tariff_prefix"
                                      id="tariff_prefix"
                                      type="text"
                                      placeholder="BAS"
                                      size="small"
                                      fullWidth
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values?.tariff_prefix}
                                      error={Boolean(
                                        touched?.tariff_prefix && errors?.tariff_prefix,
                                      )}
                                      disabled={isViewOnly}
                                    />
                                    {Boolean(touched?.tariff_prefix && errors?.tariff_prefix) && (
                                      <FormHelperText error>{errors?.tariff_prefix}</FormHelperText>
                                    )}
                                  </FormGroup>
                                </Grid>
                              </Grid>

                              <Grid container spacing={4} className="formGroupItem">
                                <Grid item xs={5}>
                                  <InputLabel htmlFor="tariff_start_with">
                                    <div className="label-heading">Start with</div>
                                  </InputLabel>
                                </Grid>
                                <Grid item xs={6}>
                                  <FormGroup className="input-holder">
                                    <OutlinedInput
                                      name="tariff_start_with"
                                      id="tariff_start_with"
                                      type="number"
                                      placeholder="000001"
                                      size="small"
                                      fullWidth
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values?.tariff_start_with}
                                      error={Boolean(
                                        touched?.tariff_start_with && errors?.tariff_start_with,
                                      )}
                                      disabled={isViewOnly}
                                    />
                                    {Boolean(
                                      touched?.tariff_start_with && errors?.tariff_start_with,
                                    ) && (
                                      <FormHelperText error>
                                        {errors?.tariff_start_with}
                                      </FormHelperText>
                                    )}
                                  </FormGroup>
                                </Grid>
                              </Grid>

                              <Grid container spacing={4} className="formGroupItem">
                                <Grid item xs={5}>
                                  <InputLabel htmlFor="tariff_code_length">
                                    <div className="label-heading">Maximum Length</div>
                                  </InputLabel>
                                </Grid>
                                <Grid item xs={6}>
                                  <FormGroup className="input-holder">
                                    <OutlinedInput
                                      name="tariff_code_length"
                                      id="tariff_code_length"
                                      placeholder="000"
                                      size="small"
                                      type="number"
                                      fullWidth
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values?.tariff_code_length}
                                      error={Boolean(
                                        touched?.tariff_code_length && errors?.tariff_code_length,
                                      )}
                                      disabled={isViewOnly}
                                    />
                                    {Boolean(
                                      touched?.tariff_code_length && errors?.tariff_code_length,
                                    ) && (
                                      <FormHelperText error>
                                        {errors?.tariff_code_length}
                                      </FormHelperText>
                                    )}
                                  </FormGroup>
                                </Grid>
                              </Grid>
                              <Divider />
                            </>
                          )}
                        </div>
                      </div>
                    </Box>
                  </form>
                </Box>
              </div>
            </Box>
          </HeightContainer>
        </GeneralSettingLayout>
      </OrganizationConfiguration>
    </>
  );
};

export default SystemParamaters;
