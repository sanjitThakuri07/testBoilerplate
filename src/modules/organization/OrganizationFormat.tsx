import {
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Popover,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import SettingFooter from "src/components/footer/SettingFooter";
import { FormikFormHelpers } from "interfaces/utils";
import { useFormik } from "formik";
import { OrganizationSettingFormatSchema } from "validationSchemas/OrganizationSetting";
import { IOrganizationSettingFormats } from "interfaces/organizationSetting";
import { getAPI, postAPI } from "src/lib/axios";
import { MenuOptions } from "interfaces/profile";
import DynamicSelectField from "containers/setting/profile/DynamicSelectField";
import { ChromePicker } from "react-color";
import { useSnackbar } from "notistack";

const initialValues: IOrganizationSettingFormats = {
  brandColor: "#000000",
  dateFormat: "",
  language: "",
  timeFormat: "",
};

const generateMenuOptions = (options: any[], extraKey?: string): MenuOptions[] => {
  return options.map((opt: MenuOptions) => {
    return {
      value: opt.id,
      label: extraKey ? opt[extraKey] : opt.name,
    };
  }) as MenuOptions[];
};

const OrganizationFormat = () => {
  const [loading, setLoading] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(true);
  const [languageOptions, setLanguageOptions] = useState<MenuOptions[]>([]);
  const [dateFormatOptions, setDateFormatOptions] = useState<MenuOptions[]>([]);
  const [timeFormatOptions, setTimeFormatOptions] = useState<MenuOptions[]>([]);
  const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);
  const [initialFormInitialValues, setInitialFormInitialValues] =
    useState<IOrganizationSettingFormats>(initialValues);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const [brandColor, setBrandColor] = useState<string>("#283352");
  const handleClick = (event: React.MouseEvent<any>) => {
    if (isViewOnly) return;
    setDisplayColorPicker(!displayColorPicker);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setDisplayColorPicker(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleFormSubmit = async (values: IOrganizationSettingFormats): Promise<void> => {
    try {
      setLoading(true);
      const { data, ...res } = await postAPI("/organization-global-settings/format", {
        barnd_color: values.brandColor.length ? values.brandColor : null,
        date_format: values.dateFormat.length ? values.dateFormat : null,
        language: values.language.length ? values.language : null,
        time_format: values.timeFormat.length ? values.timeFormat : null,
      });
      setInitialFormInitialValues(values);
      setIsViewOnly(true);
      setLoading(false);
      enqueueSnackbar(res?.message || "Organization format updated successfully", {
        variant: "success",
      });
    } catch (error: any) {
      setLoading(false);
      initialValues && setValues(initialValues);
      enqueueSnackbar(error?.detail || "Error on updatating organization format", {
        variant: "error",
      });
    }
  };

  const formikBags = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: OrganizationSettingFormatSchema,
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

  const handleColorChange = ({ hex = "" }) => {
    setBrandColor(hex);
    setFieldValue("brandColor", hex);
    setFieldTouched("brandColor");
  };

  const fetchLangauges = async () => {
    const { status, data } = await getAPI("config/language");
    if (status === 200) {
      const options = data;
      const menuOptions = generateMenuOptions(options);
      setLanguageOptions(menuOptions);
      return data;
    }
  };

  const fetchDateFormats = async () => {
    const { status, data } = await getAPI("config/date-format");
    if (status === 200) {
      const options = data;
      const menuOptions = generateMenuOptions(options);
      setDateFormatOptions(menuOptions);
      return data;
    }
  };

  const fetchTimeFormats = async () => {
    const { status, data } = await getAPI("config/time-format");
    if (status === 200) {
      const options = data;
      const menuOptions = generateMenuOptions(options);
      setTimeFormatOptions(menuOptions);
      return data;
    }
  };

  const fetchOrganizationDetails = async () => {
    const { status, data } = await getAPI("organization-global-settings/format");
    if (status === 200) {
      const { brand_color, date_format, language, time_format } = data;
      const initialData = {
        brandColor: brand_color,
        dateFormat: date_format,
        language,
        timeFormat: time_format,
      };

      setInitialFormInitialValues(initialData);
      setValues(initialData);
    }
  };

  useEffect(() => {
    if (languageOptions?.length === 0) fetchLangauges();
    if (dateFormatOptions?.length === 0) fetchDateFormats();
    if (timeFormatOptions?.length === 0) fetchTimeFormats();
    fetchOrganizationDetails();
  }, []);

  const handleViewOnly = () => {
    setIsViewOnly(!isViewOnly);
    resetForm();
  };

  const formikHelpers: FormikFormHelpers = {
    isValid,
    dirty,
    touched: Object.values(touched).length > 0,
  };

  return (
    <div className="organization-holder">
      <div className="header-holder org_update org_update">
        <div>
          {" "}
          <Typography variant="h3" color="primary">
            Organisation Formats
          </Typography>
          <Typography variant="body1" component="p">
            Update your personal format details here.
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
            <InputLabel htmlFor="langauge">
              <div className="label-heading">Language</div>
            </InputLabel>
          </Grid>
          <Grid item xs={7}>
            <DynamicSelectField
              isViewOnly={isViewOnly}
              handleChange={handleChange}
              handleBlur={handleBlur}
              handleSelectTouch={handleSelectTouch}
              id="language"
              menuOptions={languageOptions}
              value={values.language}
              error={errors.language}
              touched={touched.language}
            />
          </Grid>
        </Grid>
        <Grid container spacing={4} className="formGroupItem">
          <Grid item xs={4}>
            <InputLabel htmlFor="dateFormat">
              <div className="label-heading">Date Format</div>
            </InputLabel>
          </Grid>
          <Grid item xs={7}>
            <DynamicSelectField
              isViewOnly={isViewOnly}
              handleChange={handleChange}
              handleBlur={handleBlur}
              handleSelectTouch={handleSelectTouch}
              id="dateFormat"
              menuOptions={dateFormatOptions}
              value={values.dateFormat}
              error={errors.dateFormat}
              touched={touched.dateFormat}
            />
          </Grid>
        </Grid>
        <Grid container spacing={4} className="formGroupItem">
          <Grid item xs={4}>
            <InputLabel htmlFor="timeFormat">
              <div className="label-heading">Time Format</div>
            </InputLabel>
          </Grid>
          <Grid item xs={7}>
            <DynamicSelectField
              isViewOnly={isViewOnly}
              handleChange={handleChange}
              handleBlur={handleBlur}
              handleSelectTouch={handleSelectTouch}
              id="timeFormat"
              menuOptions={timeFormatOptions}
              value={values.timeFormat}
              error={errors.timeFormat}
              touched={touched.timeFormat}
            />
          </Grid>
        </Grid>
        <Grid container spacing={4} className="formGroupItem">
          <Grid item xs={4}>
            <InputLabel htmlFor="brandColor">
              <div className="label-heading">Brand Colour</div>
            </InputLabel>
          </Grid>
          <Grid item xs={7}>
            <FormGroup className="input-holder">
              {displayColorPicker ? (
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <ChromePicker color={brandColor} onChange={handleColorChange} />
                </Popover>
              ) : null}
              <OutlinedInput
                id="brandColor"
                type="text"
                size="small"
                fullWidth
                name="brandColor"
                sx={{
                  color: `${brandColor} !important`,
                }}
                onClick={handleClick}
                startAdornment={
                  <span
                    className="color-preview"
                    style={{
                      background: brandColor,
                    }}
                  />
                }
                value={brandColor}
                error={Boolean(touched.brandColor && errors.brandColor)}
                disabled={isViewOnly}
              />
              {Boolean(touched.brandColor && errors.brandColor) && (
                <FormHelperText error>{errors.brandColor}</FormHelperText>
              )}
            </FormGroup>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default OrganizationFormat;
