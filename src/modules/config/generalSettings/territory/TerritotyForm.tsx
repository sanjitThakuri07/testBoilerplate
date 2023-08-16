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
import { CountryProps, TerritoryProps } from "src/src/interfaces/configs";
import { FC, useEffect, useState } from "react";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import { useConfigStore } from "src/store/zustand/globalStates/config";
import DynamicSelectField from "src/modules/setting/profile/DynamicSelectField";
import { MenuOptions } from "src/interfaces/profile";
import {
  ConfigTerritoriesSchema,
  ConfigTerritoriesSchemaOptional,
} from "src/validationSchemas/config";
import ModalLayout from "src/components/ModalLayout";
import CountryForm from "../country/CountryForm";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchApI } from "src/modules/apiRequest/apiRequest";
import { TERRITORY_DEFAULT_DATA, NAVIGATE_ROUTES } from "../constantsForm";
import { postApiData, putApiData } from "src/modules/apiRequest/apiRequest";
import FullPageLoader from "src/components/FullPageLoader";
import useCountryStore from "src/store/zustand/generalSettings/country";
import useTerriotryStore from "src/store/zustand/generalSettings/territory";
import useAppStore from "src/store/zustand/app";

const TerritoryForm: FC<{
  territory: TerritoryProps;
  disabled?: boolean;
  updateCard?: Function;
  subSelectField?: boolean;
}> = ({ territory, disabled, updateCard, subSelectField }) => {
  const { systemParameters }: any = useAppStore();
  const [initialValues, setInitialValues]: any = useState(territory);
  const [countryOptions, setCountryOptions] = useState<MenuOptions[]>([]);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [addAnother, setAddAnother] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [territoryStatus, setTerritoryStatus] = useState(false);
  const [territoryCodeLength, setTerritoryCodeLength] = useState(0);
  const [currentCountry, setCurrentCountry] = useState<CountryProps>({
    region: "",
    country: "",
    code: "",
    status: "Active",
    notification_email: [],
  });
  const { addTerritories, updateTerritories } = useConfigStore();
  const param = useParams<{ territoryId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    fetchCountrys,
    postCountry,
    updateCountryStore,
    fetchIndividualCountry,
    individualCountry,
    countrys,
  }: any = useCountryStore();

  const {
    fetchTerriotrys,
    postTerriotry,
    updateTerriotryStore,
    fetchIndividualTerriotry,
    individualTerriotry,
    terriotrys,
  }: any = useTerriotryStore();

  const fetchInitialValues = async () => {
    if (param.territoryId) {
      setLoading(true);
      await fetchApI({
        setterFunction: (data: any) => {
          setInitialValues((prev: any) => ({ ...data }));
        },
        url: `territory/${param.territoryId}`,
        queryParam: "size=99",
        getAll: true,
        enqueueSnackbar,
      });
      setLoading(false);
    }
  };

  const fetchCountry = async () => {
    // const { status, data } = await getAPI('country/');

    // if (status === 200) {
    //   const options = data;
    //   const menuOptions: MenuOptions[] = options.items.map((opt: MenuOptions) => {
    //     return {
    //       value: opt.id,
    //       label: opt.name,
    //       phone_code: opt.phone_code,
    //     };
    //   });
    //   setCountryOptions(menuOptions);
    // }
    await fetchCountrys({});
  };

  // const fetchRegionStatus = async () => {
  //   const { status, data } = await getAPI('territory/check-autofill');

  //   if (status === 200) {
  //     setTerritoryStatus(data.status);
  //     setTerritoryCodeLength(data.code_length);
  //   }
  // };

  useEffect(() => {
    fetchCountry();
    // fetchRegionStatus();
    fetchInitialValues();
  }, [param.territoryId, param, location.pathname]);

  function ADD_ANOTHER_HANDLER() {
    if (addAnother) {
      setInitialValues(TERRITORY_DEFAULT_DATA);
      setOpenModal(false);
      navigate(`${NAVIGATE_ROUTES?.territory}/add`);
    } else if (!addAnother && !subSelectField) {
      navigate(NAVIGATE_ROUTES?.territory);
    }
  }

  const checkTerritoryStatus: any =
    location.pathname.includes("edit") ||
    (location.pathname.includes("add") && !systemParameters?.territory);

  return (
    <div className="region-form-holder">
      <ConfirmationModal
        openModal={openModal}
        setOpenModal={() => setOpenModal(!openModal)}
        handelConfirmation={() => {
          setOpenModal(false);
          navigate(-1);
        }}
        confirmationHeading={`Territory ${
          param.territoryId === undefined ? "created" : "updated"
        } successfully!`}
        confirmationDesc={`The territory table content has been successfully ${
          param.territoryId === undefined ? "created" : "updated"
        }  according to the way you customized.`}
        status="success"
        confirmationIcon="src/assets/icons/icon-success.svg"
        isSuccess
        IsSingleBtn
        btnText="Go to Territory"
      />

      <ModalLayout
        large
        children={
          <>
            <div className="config_modal_form_css">
              <div className="config_modal_heading">
                <div className="config_modal_title">Add Country</div>
                <div className="config_modal_text">
                  <div>Fill in the details for adding the new country.</div>
                </div>
              </div>

              <CountryForm country={currentCountry} subSelectField={true} />
            </div>
          </>
        }
        openModal={openFormModal}
        setOpenModal={() => {
          setOpenFormModal(!openFormModal);
        }}
      />

      {loading && <FullPageLoader />}
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={
          checkTerritoryStatus ? ConfigTerritoriesSchema : ConfigTerritoriesSchemaOptional
        }
        onSubmit={async (values, formikHelpers) => {
          if (disabled) return;
          setLoading(true);
          let apiResponse: any = false;
          if (values.id) {
            apiResponse = await updateTerriotryStore({
              values: { ...values, notification_email: values.notification_email },
              id: values?.id,
              updateState: (data: any) => {
                updateCard?.((prev: any) => {
                  let filterDatas = prev?.filter(
                    (data: { id?: number }) => data?.id !== Number(values?.id),
                  );
                  return [data?.data, ...filterDatas];
                });
              },
              enqueueSnackbar,
            });
            // apiResponse = await putApiData({
            //   values: { ...values, notification_email: values.notification_email },
            //   id: values?.id,
            //   url: 'territory',
            //   enqueueSnackbar: enqueueSnackbar,
            //   setterFunction: (data: any) => {
            //     updateCard?.((prev: any) => {
            //       let filterDatas = prev?.filter(
            //         (data: { id?: number }) => data?.id !== Number(values?.id),
            //       );
            //       return [data?.data, ...filterDatas];
            //     });
            //   },
            // });
            updateTerritories(values);
          } else {
            apiResponse = await postTerriotry({
              values: [
                {
                  ...values,
                  auto_generate: systemParameters?.territory || false,
                  code_length: systemParameters?.territory_code_length
                    ? systemParameters?.territory_code_length
                    : null,
                  notification_email: values.notification_email,
                },
              ],

              enqueueSnackbar,
              updateState: (data: any) => {
                if (!data.data) return;
                updateCard?.((prev: any) => [data?.data[0], ...prev]);
              },
            });
            // apiResponse = await postApiData({
            //   setterFunction: (data: any) => {
            //     // console.log({ data });
            //     if (!data.data) return;
            //     updateCard?.((prev: any) => [data?.data[0], ...prev]);
            //   },
            //   values: [
            //     {
            //       ...values,
            //       auto_generate: territoryStatus,
            //       code_length: territoryCodeLength,
            //       notification_email: values.notification_email,
            //     },
            //   ],
            //   url: `/territory/`,
            //   enqueueSnackbar: enqueueSnackbar,
            // });
            addTerritories(values);
          }
          if (!apiResponse) {
            setLoading(false);
            return;
          }
          ADD_ANOTHER_HANDLER();
          // setOpenModal(true);
          formikHelpers.resetForm({ values: TERRITORY_DEFAULT_DATA });
          setLoading(false);
        }}
      >
        {(props: FormikProps<TerritoryProps>) => {
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
              {/* {loading && <CircularProgress className="page-loader" />} */}
              <div className="region-fieldset">
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
                        // countryOptions
                        menuOptions={countrys?.map((opt: any) => ({
                          value: opt.id,
                          label: opt.name,
                          phone_code: opt.phone_code,
                        }))}
                        value={values.country}
                        error={errors.country}
                        touched={touched.country}
                        addChildren={true}
                        children={"+ Add New Country"}
                        openModal={() => setOpenFormModal(true)}
                        disabled={disabled}
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
                <Grid container spacing={4} className="formGroupItem">
                  <Grid item xs={4}>
                    <InputLabel htmlFor="name">
                      <div className="label-heading">
                        Territory <sup>*</sup>
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
                        className={disabled ? "disabled" : ""}
                        disabled={disabled}
                      />
                      {Boolean(touched.name && errors.name) && (
                        <FormHelperText error>{errors.name}</FormHelperText>
                      )}
                    </FormGroup>
                  </Grid>
                </Grid>

                {location.pathname.includes("edit") ||
                (location.pathname.includes("add") && !systemParameters?.territory) ? (
                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="code">
                        <div className="label-heading">
                          Territory Code
                          <sup>*</sup>
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
                ) : (
                  <></>
                )}

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
                        className={disabled ? "disabled" : ""}
                        disabled={disabled}
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
                      <p>Notifications will be send to this Email ID</p>
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
                        className={disabled ? "disabled" : ""}
                        disabled={disabled}
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
                      <TextareaAutosize
                        placeholder="Type any message that has to be passed on."
                        minRows={3}
                        id="notes"
                        onChange={(ev) => {
                          setFieldValue("notes", ev?.target?.value);
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
                          type="button"
                          onClick={() => {
                            setAddAnother(true);
                            handleSubmit();
                          }}
                        >
                          Add Another Territory
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

export default TerritoryForm;
