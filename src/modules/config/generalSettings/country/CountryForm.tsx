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
  TextareaAutosize,
  TextField,
} from "@mui/material";
import { Formik, FormikProps } from "formik";
import { CountryProps, RegionProps } from "src/interfaces/configs";
import { FC, useEffect, useState } from "react";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import { useConfigStore } from "src/store/zustand/globalStates/config";
import DynamicSelectField from "containers/setting/profile/DynamicSelectField";
import { MenuOptions } from "src/interfaces/profile";
import { ConfigCountriesSchema } from "validationSchemas/config";
import { useNavigate, useParams } from "react-router-dom";
import ModalLayout from "src/components/ModalLayout";
import RegionForm from "../region/RegionForm";
import { fetchApI, postApiData, putApiData } from "src/modules/apiRequest/apiRequest";
import FullPageLoader from "src/components/FullPageLoader";
import MultiEmailCustom from "src/components/MultiEmail/MultiEmail2";

import { COUNTRY_DEFAULT_DATA, NAVIGATE_ROUTES } from "../constantsForm";
import useRegionStore "src/store/zustand/generalSettings/region";
import useCountryStore "src/store/zustand/generalSettings/country";

const CountryForm: FC<{
  country: CountryProps;
  disabled?: boolean;
  updateCard?: Function;
  subSelectField?: boolean;
}> = ({ country, disabled, updateCard, subSelectField }) => {
  const [initialValues, setInitialValues]: any = useState(country);
  const [regionOptions, setRegionOptions] = useState<any>([]);
  const [countryOptions, setCountryOptions] = useState<any>([]);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [currentRegion, setCurrentRegion] = useState<RegionProps>({
    code: "",
    name: "",
    status: "Active",
    notes: "",
    notification_email: [],
  });

  const [addAnother, setAddAnother] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { addCountries, updateCountries } = useConfigStore();
  const navigate = useNavigate();

  const param = useParams<{ countryId: string }>();

  const {
    fetchRegions,
    postRegion,
    updateRegionStore,
    fetchIndividualRegion,
    individualRegion,
    regions,
  }: any = useRegionStore();

  const {
    fetchCountrys,
    postCountry,
    updateCountryStore,
    fetchIndividualCountry,
    individualCountry,
    countrys,
  }: any = useCountryStore();

  const FetchInitialValues = async () => {
    if (param.countryId) {
      setLoading(true);
      await fetchApI({
        setterFunction: (data: any) => {
          setInitialValues((prev: any) => ({ ...data }));
        },
        url: `country/${param.countryId}`,
        queryParam: "size=99",
        getAll: true,
        enqueueSnackbar,
      });
      setLoading(false);
    }
  };

  const fetchRegion = async () => {
    // const { status, data } = await getAPI('region/');

    // if (status === 200) {
    //   const options = data;
    //   const menuOptions: MenuOptions[] = options.items.map((opt: MenuOptions) => {
    //     return {
    //       value: opt.id,
    //       label: opt.name,
    //       phone_code: opt.phone_code,
    //     };
    //   });
    //   setRegionOptions(menuOptions);
    // }
    await fetchRegions({ changeFormat: true });
  };

  const fetchCountry = async () => {
    const { status, data } = await getAPI("config/country");

    if (status === 200) {
      const options = data;
      const menuOptions: MenuOptions[] = options.map((opt: MenuOptions) => {
        return {
          value: opt.id,
          label: opt.name,
          phone_code: opt.phone_code,
        };
      });
      setCountryOptions(menuOptions);
    }
  };

  useEffect(() => {
    FetchInitialValues();
    fetchRegion();
    fetchCountry();
  }, [param.countryId, param]);

  function ADD_ANOTHER_HANDLER() {
    if (addAnother) {
      setInitialValues(COUNTRY_DEFAULT_DATA);
      setOpenModal(false);
    } else if (!addAnother && !subSelectField) {
      navigate(NAVIGATE_ROUTES?.country);
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
        confirmationHeading={`Country ${
          param.countryId === undefined ? "created" : "updated"
        } successfully!`}
        confirmationDesc={`The country table content has been successfully ${
          param.countryId === undefined ? "created" : "updated"
        }  according to the way you customized.`}
        status="success"
        confirmationIcon="/assets/icons/icon-success.svg"
        isSuccess
        IsSingleBtn
        btnText="Go to Country"
      />

      <ModalLayout
        children={
          <>
            <div className="config_modal_form_css">
              <div className="config_modal_heading">
                <div className="config_modal_title">Add Region</div>
                <div className="config_modal_text">
                  <div>Fill in the details for adding the new region.</div>
                </div>
              </div>

              <RegionForm region={currentRegion} subSelectField={true} />
            </div>
          </>
        }
        openModal={openFormModal}
        setOpenModal={() => {
          setOpenFormModal(!openFormModal);
        }}
      />
      {loading ? (
        <FullPageLoader />
      ) : (
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={ConfigCountriesSchema}
          onSubmit={async (values: any, formikHelpers) => {
            setInitialValues(values);
            if (disabled) return;
            let apiResponse: any = false;
            setLoading(true);
            if (values.id) {
              apiResponse = await updateCountryStore({
                values: {
                  ...values,
                  notification_email: values.notification_email,
                  name: countryOptions?.find((it: any) => it?.value === values.country)?.label,
                },
                id: values?.id,
                updateState: (data: any) => {
                  updateCard?.((prev: any) => {
                    let filterDatas = prev?.filter(
                      (data: { id?: number }) => data?.id !== Number(values?.id),
                    );
                    return [
                      {
                        ...data?.data,
                        name: countryOptions?.find((it: any) => it?.value === data?.data?.country)
                          ?.label,
                      },
                      ...filterDatas,
                    ];
                  });
                },
                enqueueSnackbar: enqueueSnackbar,
              });
              // apiResponse = await putApiData({
              //   values: { ...values, notification_email: values.notification_email },
              //   id: values?.id,
              //   url: 'country',
              //   enqueueSnackbar: enqueueSnackbar,
              //   setterFunction: (data: any) => {
              //     updateCard?.((prev: any) => {
              //       let filterDatas = prev?.filter(
              //         (data: { id?: number }) => data?.id !== Number(values?.id),
              //       );
              //       return [
              //         {
              //           ...data?.data,
              //           name: countryOptions?.find((it: any) => it?.value === data?.data?.country)
              //             ?.label,
              //         },
              //         ...filterDatas,
              //       ];
              //     });
              //   },
              // });
              updateCountries(values);
            } else {
              apiResponse = await postCountry({
                values: [
                  {
                    ...values,
                    name: countryOptions?.find((it: any) => {
                      return it?.value === values?.country;
                    })?.label,
                  },
                ],
                enqueueSnackbar: enqueueSnackbar,
                updateState: (data: any) => {
                  if (!data.data) return;
                  updateCard?.((prev: any) => [
                    {
                      ...data?.data[0],
                      name: countryOptions?.find(
                        (it: any) => it?.value === data?.data[0]?.country_id,
                      )?.label,
                    },
                    ...prev,
                  ]);
                },
              });
              // apiResponse = await postApiData({
              //   setterFunction: (data: any) => {
              //     if (!data.data) return;
              //     updateCard?.((prev: any) => [
              //       {
              //         ...data?.data[0],
              //         name: countryOptions?.find(
              //           (it: any) => it?.value === data?.data[0]?.country_id,
              //         )?.label,
              //       },
              //       ...prev,
              //     ]);
              //   },
              //   values: [
              //     {
              //       ...values,
              //     },
              //   ],
              //   url: `/country/`,
              //   enqueueSnackbar: enqueueSnackbar,
              // });
              addCountries(values);
            }
            if (!apiResponse) {
              setLoading(false);
              return;
            }
            ADD_ANOTHER_HANDLER();
            apiResponse && formikHelpers.resetForm({ values: COUNTRY_DEFAULT_DATA });
            setLoading(false);
          }}
        >
          {(props: FormikProps<CountryProps>) => {
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
                      <InputLabel htmlFor="region">
                        <div className="label-heading">
                          Region <sup>*</sup>
                        </div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <FormGroup className="input-holder">
                        <DynamicSelectField
                          isViewOnly={false}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          handleSelectTouch={() => setFieldTouched("region", true)}
                          id="region"
                          menuOptions={regions?.map((opt: any) => ({
                            value: opt?.id,
                            label: opt?.name,
                            phone_code: opt?.phone_code,
                          }))}
                          value={values.region}
                          error={touched.region && errors.region ? errors.region : ""}
                          touched={touched.region}
                          addChildren={true}
                          children={"+ Add New Region"}
                          openModal={() => setOpenFormModal(true)}
                          disabled={disabled}
                        />
                      </FormGroup>
                    </Grid>
                  </Grid>
                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="country">
                        <div className="label-heading">
                          Country <sup>*</sup>
                        </div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <FormGroup className="input-holder">
                        <DynamicSelectField
                          isViewOnly={false}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          handleSelectTouch={() => setFieldTouched("country", true)}
                          id="country"
                          menuOptions={countryOptions}
                          value={values.country}
                          error={errors.country}
                          touched={touched.country}
                          disabled={disabled}
                        />
                      </FormGroup>
                    </Grid>
                  </Grid>
                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="code">
                        <div className="label-heading">
                          Country Code <sup>*</sup>
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
                          className={disabled ? "disabled" : ""}
                          disabled={disabled}
                        />
                        {Boolean(touched.code && errors.code) && (
                          <FormHelperText error>{errors.code}</FormHelperText>
                        )}
                      </FormGroup>
                    </Grid>
                  </Grid>

                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="currency">
                        <div className="label-heading">
                          Currency
                          <sup>*</sup>
                        </div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <FormGroup className="input-holder">
                        <OutlinedInput
                          id="currency"
                          type="text"
                          placeholder="Enter here"
                          size="small"
                          fullWidth
                          name="currency"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.currency}
                          error={Boolean(touched.currency && errors.currency)}
                          className={disabled ? "disabled" : ""}
                          disabled={disabled}
                        />
                        {Boolean(touched.currency && errors.currency) && (
                          <FormHelperText error>{errors.currency}</FormHelperText>
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
                          className={disabled ? "disabled" : ""}
                          disabled={disabled}
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
                  <Grid
                    container
                    spacing={4}
                    className="formGroupItem"
                    id="multiple_email_address_id"
                  >
                    <Grid item xs={4}>
                      <InputLabel htmlFor="notification_email">
                        <div className="label-heading">Notification Email ID</div>
                        <p>Multiple Email ID can be added.</p>
                      </InputLabel>
                    </Grid>

                    <Grid item xs={7} className="multiple_email_address_id">
                      <MultiEmailCustom
                        placeholder="Notification emails"
                        value={values.notification_email || []}
                        onChange={(emails: string[]) => {
                          setFieldValue("notification_email", emails);
                          setFieldTouched("notification_email", true);
                        }}
                        disabled={disabled}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="tax_type">
                        <div className="label-heading">Tax Type *</div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <FormGroup className="input-holder">
                        <OutlinedInput
                          id="tax_type"
                          type="text"
                          placeholder="Enter here"
                          size="small"
                          fullWidth
                          name="tax_type"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.tax_type}
                          error={Boolean(touched.tax_type && errors.tax_type)}
                          className={disabled ? "disabled" : ""}
                          disabled={disabled}
                        />
                        {Boolean(touched.tax_type && errors.tax_type) && (
                          <FormHelperText error>{errors.tax_type}</FormHelperText>
                        )}
                      </FormGroup>
                    </Grid>
                  </Grid>

                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="tax_percentage">
                        <div className="label-heading">Tax Percentage *</div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <FormGroup className="input-holder">
                        <OutlinedInput
                          id="tax_percentage"
                          type="text"
                          placeholder="Enter here"
                          size="small"
                          fullWidth
                          name="tax_percentage"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.tax_percentage}
                          error={Boolean(touched.tax_percentage && errors.tax_percentage)}
                          className={disabled ? "disabled" : ""}
                          disabled={disabled}
                        />
                        {Boolean(touched.tax_percentage && errors.tax_percentage) && (
                          <FormHelperText error>{errors.tax_percentage}</FormHelperText>
                        )}
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
                        <TextareaAutosize
                          placeholder="Type any message that has to be passed on."
                          minRows={3}
                          id="notes"
                          onChange={(ev) => {
                            setFieldValue("notes", ev.target.value);
                            setFieldTouched("notes");
                          }}
                          onBlur={handleBlur}
                          value={values.notes}
                          name="notes"
                          className={`text__area-style text__area-style-color ${
                            disabled ? "disabled" : ""
                          }`}
                          disabled={disabled}
                          maxLength={300}
                        />
                        <FormHelperText>
                          {300 - Number(values?.notes?.length || 0)} characters left
                        </FormHelperText>
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
                            type="submit"
                            onClick={() => {
                              setAddAnother(true);
                              handleSubmit();
                            }}
                            disabled={!isValid || !dirty || isSubmitting}
                          >
                            Add Another Country
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
                          // disabled={!isValid || !dirty || isSubmitting}
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
      )}
    </div>
  );
};

export default CountryForm;
