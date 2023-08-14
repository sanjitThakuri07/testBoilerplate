import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import {
  Button,
  Checkbox,
  CircularProgress,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Select as MuiSelect,
  OutlinedInput,
  SelectChangeEvent,
  TextareaAutosize,
} from "@mui/material";
import { Formik, FormikProps } from "formik";
import { TariffRateTypeProps } from "src/interfaces/configs";
import React, { FC, useEffect, useState } from "react";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import { useFinanceBillingAgreementStore } from "src/store/zustand/globalStates/config";
import { BillingAgreementSchema } from "validationSchemas/config";
import { useNavigate, useParams } from "react-router-dom";
import { fetchIndividualApi, postApiData, putApiData } from "src/modules/apiRequest/apiRequest";
import {
  INSPECTION_NAMES_DEFAULT,
  NAVIGATE_ROUTES,
  TARIFF_RATE_TYPE,
} from "src/modules/config/generalSettings/constantsForm";
import FullPageLoader from "src/components/FullPageLoader";

const TariffRateType = ({ disabled, updateCard }: any) => {
  //   const initialValues: BillingAgreementProps;
  // const initialValues: TariffRateTypeProps = {
  //   name: '',
  //   status: 'Active',
  //   notes: '',
  // };

  const [initialValues, setInitialValues] = useState<TariffRateTypeProps>({
    name: "",
    status: "Active",
    notes: "",
    id: null,
  });

  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addAnother, setAddAnother] = useState(false);

  const { updateBillingAgreements, addBillingAgreements, billingAgreements } =
    useFinanceBillingAgreementStore();
  const param = useParams<{ tariffId: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const fetchInitialValues = async () => {
    if (param.tariffId) {
      await fetchIndividualApi({
        id: +param?.tariffId,
        url: "tariff-rate-types",
        // enqueueSnackbar,
        setterFunction: (data: any) => {
          if (!data) return;
          setInitialValues((prev: any) => ({
            ...data,
          }));
        },
      });
      // const { status, data } = await getAPI(`tariff-rate-types/${param.tariffId}`);
      // if (status === 200) {
      //   setInitialValues({
      //     name: data.name,
      //     status: data.status,
      //     notes: data.notes,
      //     id: data.id,
      //   });
      // }
    }
  };

  useEffect(() => {
    fetchInitialValues();
  }, [param.tariffId, param]);

  function ADD_ANOTHER_HANDLER() {
    if (addAnother) {
      setInitialValues(TARIFF_RATE_TYPE);
      setOpenModal(false);
    } else if (!addAnother) {
      navigate(NAVIGATE_ROUTES?.addTariffRateType);
    }
  }
  return (
    <div className="region-form-holder">
      <ConfirmationModal
        openModal={openModal}
        setOpenModal={() => setOpenModal(!openModal)}
        handelConfirmation={() => {
          setOpenModal(false);
          navigate(-1);
        }}
        confirmationHeading="Tarifff Rate Type created successfully!"
        confirmationDesc="The tarifff Rate Type table content has been successfully updated according to the way you customized."
        status="success"
        confirmationIcon="/assets/icons/icon-success.svg"
        isSuccess
        IsSingleBtn
        btnText="Go to Tarifff Rate Type"
      />

      {loading && <FullPageLoader />}

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={BillingAgreementSchema}
        onSubmit={async (values, formikHelpers) => {
          if (disabled) return;
          let apiResponse: any = false;
          setLoading(true);
          if (values?.id) {
            apiResponse = await putApiData({
              values: { ...values },
              id: +values?.id,
              url: "tariff-rate-types",
              enqueueSnackbar: enqueueSnackbar,
              setterFunction: (data: any) => {
                updateCard?.((prev: any) => {
                  let filterDatas = prev?.filter(
                    (data: { id?: number }) => data?.id !== Number(values?.id),
                  );
                  return [data?.data, ...filterDatas];
                });
              },
            });
            updateBillingAgreements(values);
            // setOpenModal(true);

            setLoading(false);
          } else {
            apiResponse = await postApiData({
              setterFunction: (data: any) => {
                // console.log({ data });
                if (!data.data) return;
                updateCard?.((prev: any) => [data?.data[0], ...prev]);
              },
              values: [
                {
                  ...values,
                },
              ],
              url: `/tariff-rate-types/`,
              enqueueSnackbar: enqueueSnackbar,
            });
            addBillingAgreements(values);
          }
          if (apiResponse) {
            formikHelpers.resetForm({ values: INSPECTION_NAMES_DEFAULT });
            ADD_ANOTHER_HANDLER();
          }
          setLoading(false);
        }}
      >
        {(props: FormikProps<TariffRateTypeProps>) => {
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
              <div className="region-fieldset">
                <Grid container spacing={4} className="formGroupItem">
                  <Grid item xs={4}>
                    <InputLabel htmlFor="name">
                      <div className="label-heading">
                        Tariiff Rate Type Name <sup>*</sup>
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
                        error={Boolean(touched.status && errors.status)}
                        disabled={disabled}
                        className={disabled ? "disabled" : ""}
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

                <Grid container spacing={4} className="formGroupItem">
                  <Grid item xs={4}>
                    <InputLabel htmlFor="notes">
                      <div className="label-heading"> Notes</div>
                    </InputLabel>
                  </Grid>
                  <Grid item xs={7}>
                    <FormGroup className="input-holder">
                      <TextareaAutosize
                        placeholder="Type any message that has to be passed on."
                        minRows={3}
                        id="notes"
                        onChange={(ev) => {
                          setFieldValue("notes", ev.target.value);
                          setFieldTouched("notes");
                        }}
                        className={`text__area-style ${disabled ? "disabled" : ""}`}
                        disabled={disabled}
                        name="notes"
                        value={values.notes}
                        onBlur={handleBlur}
                        maxLength={300}
                      />
                      <FormHelperText>
                        {300 - Number(values?.notes?.length || 0)} characters left
                      </FormHelperText>
                      {Boolean(touched.notes && errors.notes) && (
                        <FormHelperText error>{errors.notes}</FormHelperText>
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
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setAddAnother(true);
                            handleSubmit();
                          }}
                        >
                          Add Another Tariff Rate Type
                        </Button>
                      </Grid>
                    </div>

                    <Grid item>
                      <Button
                        variant="contained"
                        type="submit"
                        onClick={() => {
                          setAddAnother(false);
                          handleSubmit();
                        }}
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

export default TariffRateType;
