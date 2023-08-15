import {
  Button,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { FormikProps } from "formik";
import { MenuOptions, Phone, Profile } from "src/interfaces/profile";
import { FC, useEffect, useState } from "react";
import UploadImage from "src/assets/icons/Icon.svg";
import "./phoneNumberInput.scss";
import { loggedUserDataStore } from "src/store/zustand/globalStates/loggedUserData";

interface IProps {
  formikBag: FormikProps<Profile>;
  isViewOnly: boolean;
  countryOptions: MenuOptions[];
  disableAdd?: boolean;
  addButtonClassName?: string;
  className?: string;
  defaultCode?: Number;
}

// IconComponent={() => <img src="/src/assets/icons/cheveron-down.svg" />}>

const PhoneNumberInput: FC<IProps> = ({
  formikBag,
  isViewOnly,
  countryOptions,
  disableAdd,
  addButtonClassName,
  className,
  defaultCode = 14,
}) => {
  const { errors, values, touched, setFieldValue, handleChange, handleBlur } = formikBag;
  const { country_code } = loggedUserDataStore();

  const countryMenuDrops = countryOptions?.map((mn) => {
    return {
      label: mn.phone_code,
      value: mn.phone_code,
      name: mn.label,
      country_code: mn.id,
    };
  });

  const code = !!country_code
    ? countryMenuDrops?.find((mn) => mn.country_code == country_code)
    : countryMenuDrops?.find((mn) => mn.country_code == defaultCode);

  const [phoneNumbers, setPhoneNumbers] = useState<Phone[]>([]);

  const handleAddPhoneNumber = () => {
    let phoneNumber = [...phoneNumbers];
    setPhoneNumbers([
      ...phoneNumbers,
      {
        code: "",
        phone: "",
      },
    ]);

    // setFieldValue(`phone.${phoneNumbers?.length}.code`, `${code?.value}`);
  };

  useEffect(() => {
    if (values?.phone?.length <= 0 || !values?.phone) {
      setPhoneNumbers([
        {
          code: `${code?.value}`,
          phone: "",
        },
      ]);
    } else {
      setPhoneNumbers(values?.phone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.phone]);

  if (countryOptions?.length <= 0) return null;
  //   const getCurrentError:string = (index:number) => {
  //     return errors.phone[index].number
  //   };

  return (
    <div className="phone-input-holder">
      <Grid container spacing={2} justifyContent="space-between">
        {phoneNumbers?.map((ph, index) => {
          return (
            <Grid item xs={12} key={index} className={`${className ? className : ""}`}>
              <div className="phone-holder">
                <Select
                  MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                  className={`${isViewOnly ? "disabled" : ""} phone-select`}
                  sx={{ border: "1px solid rgba(0, 0, 0, 0.23);" }}
                  disabled={isViewOnly}
                  data-testid="phone-select"
                  value={values?.phone?.[index]?.code || `${code?.value}`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name={`phone.${index}.code`}
                >
                  {countryMenuDrops?.map((option, index) => (
                    <MenuItem key={index} value={option.value}>
                      +{option.label}
                    </MenuItem>
                  ))}
                </Select>
                <OutlinedInput
                  name={`phone.${index}.phone`}
                  className={`${isViewOnly ? "disabled" : ""} phone-input`}
                  disabled={isViewOnly}
                  value={values?.phone?.[index]?.phone || ""}
                  error={Boolean(errors.phone?.[index])}
                  onChange={(ev) => {
                    !values?.phone?.[index]?.code &&
                      setFieldValue(`phone.${index}.code`, `${code?.value}`);
                    const inputRegex = /^[0-9\b\x7F]+$/; // allow only digits and backspace
                    const newValue = ev.target.value;
                    if (inputRegex.test(newValue) || Number(newValue?.toString().length) === 0) {
                      handleChange(ev);
                    }
                  }}
                  onBlur={(ev) => {
                    !values?.phone?.[index]?.code &&
                      setFieldValue(`phone.${index}.code`, `${code?.value}`);
                    handleBlur(ev);
                  }}
                />
                {Boolean(touched.phone?.[index] && errors.phone?.[index]) && (
                  <div className="input-feedback" style={{ color: "red" }}>
                    Phone number is not valid
                  </div>
                )}
              </div>
              {phoneNumbers?.length > 1 && !isViewOnly && (
                <div
                  onClick={() => {
                    let prevNumbers = [...phoneNumbers];
                    prevNumbers?.splice(index, 1);
                    setFieldValue(`phone`, prevNumbers);
                    setPhoneNumbers(prevNumbers);
                  }}
                >
                  <IconButton size="small">
                    {/* <DeleteOutlinedIcon /> */}
                    <img src={UploadImage} alt="" />
                  </IconButton>
                </div>
              )}
            </Grid>
          );
        })}
        {!disableAdd && !isViewOnly && (
          <Grid
            item
            xs={4}
            className={`grid-align-right ${addButtonClassName ? addButtonClassName : ""}`}
          >
            <Button
              disabled={isViewOnly}
              type="button"
              onClick={handleAddPhoneNumber}
              startIcon={
                <img
                  alt=""
                  src="/src/assets/icons/plus.svg"
                  style={{
                    opacity: isViewOnly ? 0.5 : 1,
                  }}
                />
              }
              className="link-icon"
            >
              Add another
            </Button>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default PhoneNumberInput;
