import {
  Box,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Popover,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { FormikProps } from "formik";
import { ChromePicker } from "react-color";

import { MenuOptions, Profile } from "src/interfaces/profile";
import { getAPI } from "src/lib/axios";
import DynamicSelectField from "./DynamicSelectField";

interface IProps {
  formikBag: FormikProps<Profile>;
  isViewOnly: boolean;
}

const generateMenuOptions = (options: any[], extraKey?: string): MenuOptions[] => {
  return options.map((opt: MenuOptions) => {
    return {
      value: opt.id,
      label: extraKey ? opt[extraKey] : opt.name,
    };
  }) as MenuOptions[];
};

const ProfileFormat: FC<IProps> = ({ formikBag, isViewOnly }) => {
  const [languageOptions, setLanguageOptions] = useState<MenuOptions[]>([]);
  const [dateFormatOptions, setDateFormatOptions] = useState<MenuOptions[]>([]);
  const [timeFormatOptions, setTimeFormatOptions] = useState<MenuOptions[]>([]);
  const [timeZoneOptions, setTimeZoneOptions] = useState<MenuOptions[]>([]);
  const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);
  const { errors, values, touched, setFieldTouched, setFieldValue, handleChange, handleBlur } =
    formikBag;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [brandColor, setBrandColor] = useState<string>(values.brandColor || "#283352");
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

  const handleSelectTouch = (key: string): void => {
    setFieldTouched(key);
  };

  const handleColorChange = ({ hex = "" }) => {
    setBrandColor(hex);
    setFieldValue("brandColor", hex);
    setFieldTouched("brandColor");
  };

  // const fetchLangauges = async () => {
  //   const { status, data } = await getAPI('config/language');
  //   if (status === 200) {
  //     const options = data;
  //     const menuOptions = generateMenuOptions(options);
  //     setLanguageOptions(menuOptions);
  //     return data;
  //   }
  // };

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

  const fetchTimeZones = async () => {
    const { status, data } = await getAPI("config/time-zone");
    if (status === 200) {
      const options = data;
      const menuOptions = generateMenuOptions(options, "timezone");
      setTimeZoneOptions(menuOptions);
      return data;
    }
  };

  useEffect(() => {
    // if (languageOptions?.length === 0) fetchLangauges();
    if (dateFormatOptions?.length === 0) fetchDateFormats();
    if (timeFormatOptions?.length === 0) fetchTimeFormats();
    if (timeZoneOptions?.length === 0) fetchTimeZones(); // wrong data
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (values?.brandColor) {
      setBrandColor(values?.brandColor);
    }
  }, [values?.brandColor]);

  return (
    <Box>
      <div className="setting-form-group">
        {/* <Grid container spacing={4} className="formGroupItem">
          <Grid item xs={4}>
            <InputLabel htmlFor="langauge">
              <div className="label-heading">
                Language <sup>*</sup>
              </div>
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
        </Grid> */}
        <Grid container spacing={4} className="formGroupItem">
          <Grid item xs={4}>
            <InputLabel htmlFor="dateFormat">
              <div className="label-heading">
                Date Format <sup>*</sup>
              </div>
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
              <div className="label-heading">
                Time Format <sup>*</sup>
              </div>
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
            <InputLabel htmlFor="timeZone">
              <div className="label-heading">
                Time Zone <sup>*</sup>
              </div>
            </InputLabel>
          </Grid>
          <Grid item xs={7}>
            <DynamicSelectField
              isViewOnly={isViewOnly}
              handleChange={handleChange}
              handleBlur={handleBlur}
              handleSelectTouch={handleSelectTouch}
              id="timeZone"
              menuOptions={timeZoneOptions}
              value={values.timeZone}
              error={errors.timeZone}
              touched={touched.timeZone}
            />
          </Grid>
        </Grid>
        <Grid container spacing={4} className="formGroupItem">
          <Grid item xs={4}>
            <InputLabel htmlFor="brandColor">
              <div className="label-heading">
                Brand Colour <sup>*</sup>
              </div>
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
      </div>
    </Box>
  );
};

export default ProfileFormat;
