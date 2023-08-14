import {
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import SettingFooter from "src/components/footer/SettingFooter";
import { FormikFormHelpers } from "src/interfaces/utils";
import { useFormik } from "formik";
import { OrganizationSettingAddressSchema } from "validationSchemas/OrganizationSetting";
import { IOrganizationSettingAddress } from "src/interfaces/organizationSetting";
import { MenuOptions } from "src/interfaces/profile";
import DynamicSelectField from "containers/setting/profile/DynamicSelectField";
import { getAPI, postAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";

const initialValues: IOrganizationSettingAddress = {
  addressLine: "",
  addressType: "",
  city: "",
  country: "",
  stateOrProvince: "",
  territory: "",
  zipOrPostalCode: "",
};

const OrganizationAddress = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(true);
  const [countryOptions, setCountryOptions] = useState<MenuOptions[]>([]);
  const [initialFormInitialValues, setInitialFormInitialValues] =
    useState<IOrganizationSettingAddress>(initialValues);

  // addressLine: data.org_address_line,
  // addressType: data.org_address_type,
  // city: data.org_city,
  // country: data.org_country_id,
  // stateOrProvince: data.org_state_province,
  // territory: data.org_territory,
  // zipOrPostalCode: data.org_zip,

  const handleFormSubmit = async (values: IOrganizationSettingAddress): Promise<void> => {
    try {
      setLoading(true);
      const { data, ...res } = await postAPI("/organization-global-settings/address", {
        org_address_line: values.addressLine,
        org_address_type: values.addressType,
        org_city: values.city,
        org_country_id: values.country,
        org_state_province: values.stateOrProvince,
        org_territory: values.territory,
        org_zip: values.zipOrPostalCode,
      });
      setInitialFormInitialValues(values);
      setIsViewOnly(true);
      setLoading(false);
      enqueueSnackbar(res?.message || "Organization address updated successfully", {
        variant: "success",
      });
    } catch (error: any) {
      setLoading(false);
      initialValues && setValues(initialValues);
      enqueueSnackbar(error?.detail || "Error on updatating organization address", {
        variant: "error",
      });
    }
  };

  const formikBags = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: OrganizationSettingAddressSchema,
    onSubmit: handleFormSubmit,
  });

  const {
    handleSubmit,
    setValues,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    isValid,
    dirty,
    touched,
    resetForm,
    values,
    errors,
  } = formikBags;

  const handleSelectTouch = (key: string): void => {
    setFieldTouched(key);
  };

  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>): void => {
    const key = ev.target.name;
    handleChange(ev);
    setFieldTouched(key);
  };

  const handleViewOnly = () => {
    setIsViewOnly(!isViewOnly);
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

  const fetchOrganizationAddress = async () => {
    const { status, data } = await getAPI("organization-global-settings/address");
    if (status === 200) {
      const initialData = {
        addressLine: data.org_address_line,
        addressType: data.org_address_type,
        city: data.org_city,
        country: data.org_country_id,
        stateOrProvince: data.org_state_province,
        territory: data.org_territory,
        zipOrPostalCode: data.org_zip,
      };
      setInitialFormInitialValues(initialData);
      setValues(initialData);
    }
  };

  useEffect(() => {
    fetchCountry();
    fetchOrganizationAddress();
  }, []);

  const formikHelpers: FormikFormHelpers = {
    isValid,
    dirty,
    touched: Object.values(touched).length > 0,
  };

  return (
    <div className="organization-holder">
      <div className="header-holder org_update">
        <div>
          <Typography variant="h3" color="primary">
            Organisation Address
          </Typography>
          <Typography variant="body1" component="p">
            Update your personal address details here.
          </Typography>
        </div>
        <div>
          <SettingFooter
            isViewOnly={isViewOnly}
            loading={loading}
            handleViewOnly={handleViewOnly}
            formikHelpers={formikHelpers}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
      <form className="setting-form-group" onSubmit={handleSubmit}>
        <Grid container spacing={4} className="formGroupItem">
          <Grid item xs={4}>
            <InputLabel htmlFor="addressType">
              <div className="label-heading">Address Type</div>
            </InputLabel>
          </Grid>
          <Grid item xs={6}>
            <FormGroup className="input-holder">
              <OutlinedInput
                id="addressType"
                type="text"
                placeholder=""
                size="small"
                fullWidth
                name="addressType"
                onChange={handleInputChange}
                onBlur={handleBlur}
                value={values.addressType}
                error={Boolean(touched.addressType && errors.addressType)}
                disabled={isViewOnly}
              />
              {Boolean(touched.addressType && errors.addressType) && (
                <FormHelperText error>{errors.addressType}</FormHelperText>
              )}
            </FormGroup>
          </Grid>
        </Grid>
        <Grid container spacing={4} className="formGroupItem">
          <Grid item xs={4}>
            <InputLabel htmlFor="addressLine">
              <div className="label-heading">Address Line</div>
            </InputLabel>
          </Grid>
          <Grid item xs={6}>
            <FormGroup className="input-holder">
              <OutlinedInput
                id="addressLine"
                type="text"
                placeholder=""
                size="small"
                fullWidth
                name="addressLine"
                onChange={handleInputChange}
                onBlur={handleBlur}
                value={values.addressLine}
                error={Boolean(touched.addressLine && errors.addressLine)}
                disabled={isViewOnly}
              />
              {Boolean(touched.addressLine && errors.addressLine) && (
                <FormHelperText error>{errors.addressLine}</FormHelperText>
              )}
            </FormGroup>
          </Grid>
        </Grid>
        <Grid container spacing={4} className="formGroupItem">
          <Grid item xs={4}>
            <InputLabel htmlFor="city">
              <div className="label-heading">City</div>
            </InputLabel>
          </Grid>
          <Grid item xs={6}>
            <FormGroup className="input-holder">
              <OutlinedInput
                id="city"
                type="text"
                placeholder=""
                size="small"
                fullWidth
                name="city"
                onChange={handleInputChange}
                onBlur={handleBlur}
                value={values.city}
                error={Boolean(touched.city && errors.city)}
                disabled={isViewOnly}
              />
              {Boolean(touched.city && errors.city) && (
                <FormHelperText error>{errors.city}</FormHelperText>
              )}
            </FormGroup>
          </Grid>
        </Grid>
        <Grid container spacing={4} className="formGroupItem">
          <Grid item xs={4}>
            <InputLabel htmlFor="stateOrProvince">
              <div className="label-heading">State/Province</div>
            </InputLabel>
          </Grid>
          <Grid item xs={6}>
            <FormGroup className="input-holder">
              <OutlinedInput
                id="stateOrProvince"
                type="text"
                placeholder=""
                size="small"
                fullWidth
                name="stateOrProvince"
                onChange={handleInputChange}
                onBlur={handleBlur}
                value={values.stateOrProvince}
                error={Boolean(touched.stateOrProvince && errors.stateOrProvince)}
                disabled={isViewOnly}
              />
              {Boolean(touched.stateOrProvince && errors.stateOrProvince) && (
                <FormHelperText error>{errors.stateOrProvince}</FormHelperText>
              )}
            </FormGroup>
          </Grid>
        </Grid>
        <Grid container spacing={4} className="formGroupItem">
          <Grid item xs={4}>
            <InputLabel htmlFor="territory">
              <div className="label-heading">Territory</div>
            </InputLabel>
          </Grid>
          <Grid item xs={6}>
            <FormGroup className="input-holder">
              <OutlinedInput
                id="territory"
                type="text"
                placeholder=""
                size="small"
                fullWidth
                name="territory"
                onChange={handleInputChange}
                onBlur={handleBlur}
                value={values.territory}
                error={Boolean(touched.territory && errors.territory)}
                disabled={isViewOnly}
              />
              {Boolean(touched.territory && errors.territory) && (
                <FormHelperText error>{errors.territory}</FormHelperText>
              )}
            </FormGroup>
          </Grid>
        </Grid>
        <Grid container spacing={4} className="formGroupItem">
          <Grid item xs={4}>
            <InputLabel htmlFor="country">
              <div className="label-heading">Country</div>
            </InputLabel>
          </Grid>
          <Grid item xs={6}>
            <DynamicSelectField
              isViewOnly={isViewOnly}
              handleChange={handleChange}
              handleBlur={handleBlur}
              handleSelectTouch={handleSelectTouch}
              id="country"
              menuOptions={countryOptions}
              value={values.country}
              error={errors.country}
              touched={false}
            />
          </Grid>
        </Grid>
        <Grid container spacing={4} className="formGroupItem">
          <Grid item xs={4}>
            <InputLabel htmlFor="zipOrPostalCode">
              <div className="label-heading">ZIP/Postal code</div>
            </InputLabel>
          </Grid>
          <Grid item xs={6}>
            <FormGroup className="input-holder">
              <OutlinedInput
                id="zipOrPostalCode"
                type="text"
                placeholder=""
                size="small"
                fullWidth
                name="zipOrPostalCode"
                onChange={handleInputChange}
                onBlur={handleBlur}
                value={values.zipOrPostalCode}
                error={Boolean(touched.zipOrPostalCode && errors.zipOrPostalCode)}
                disabled={isViewOnly}
              />
              {Boolean(touched.zipOrPostalCode && errors.zipOrPostalCode) && (
                <FormHelperText error>{errors.zipOrPostalCode}</FormHelperText>
              )}
            </FormGroup>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default OrganizationAddress;
