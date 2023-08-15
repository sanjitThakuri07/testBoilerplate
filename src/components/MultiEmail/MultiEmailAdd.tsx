import {
  Button,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { FormikProps, getIn } from "formik";
import { MenuOptions, Phone, Profile } from "interfaces/profile";
import { FC, useEffect, useState } from "react";
import UploadImage from "src/assets/icons/Icon.svg";
import "./multiEmailAdd.scss";

interface IProps {
  formikBag: FormikProps<Profile>;
  isViewOnly: boolean;
  disableAdd?: boolean;
  name?: string;
  clearData?: boolean;
  setClearData?: React.Dispatch<React.SetStateAction<boolean>>;
  countryOptions?: any[];
  inputType?: string;
  validateFieldType?: string;
  returnType?: string;
  addAnotherButton?: any;
  nestedName?: boolean;
  disabled?: boolean;
}
interface NotificationType {
  [key: string]: string;
}

export const validateFieldTypeNames = {
  FLOAT: "FLOAT",
  NUMBER: "NUMBER",
};

export const inputFieldType: NotificationType = {
  EMAIL: "EMAIL",
  EMAIL_OPTION: "EMAIL-OPTION",
  NORMAL: "NORMAL",
  NORMAL_OPTION: "NORMAL_OPTION",
};

interface Accessor {
  [key: string]: any;
}

// IconComponent={() => <img src="/src/assets/icons/cheveron-down.svg" />}>

export function validateField(validateFieldType: string, value: string) {
  const regexFloat = /^[0-9]*\.?[0-9]*$/i;
  const numberRegex = /^[0-9\b\x7F]+$/;
  let testPass = false;
  switch (validateFieldType) {
    case validateFieldTypeNames?.FLOAT:
      testPass = regexFloat.test(value);
      break;
    case validateFieldTypeNames?.NUMBER:
      testPass = numberRegex.test(value);
      break;
    default:
      testPass = true;
      break;
  }

  return testPass;
}

const MultiEmailInput: FC<IProps> = ({
  formikBag,
  isViewOnly,
  disableAdd,
  name,
  clearData,
  setClearData,
  countryOptions,
  inputType = inputFieldType.EMAIL,
  validateFieldType = "string",
  returnType = "multiple",
  addAnotherButton,
  nestedName = false,
  disabled,
}) => {
  const {
    errors,
    values,
    touched,
    setFieldValue,
    handleChange,
    handleBlur,
    isSubmitting,
    initialTouched,
  }: any = formikBag;
  const newValue: Accessor = values;

  const [emails, setEmails] = useState<string[]>([""]);
  const [objData, setObjData] = useState<any>([{ data: "", code: "" }]);

  const handleObjData = () => {
    setObjData([...objData, { code: "", data: "" }]);
  };

  const handleEmails = () => {
    setEmails([...emails, ""]);
  };

  // for showing errors
  const getError = (name: string, index: number) => {
    return Boolean(
      touched[`${name}`] &&
        touched[`${name}`][index] &&
        errors[`${name}`] &&
        errors[`${name}`][index],
    );
  };

  useEffect(() => {
    if (clearData) {
      setEmails([""]);
      setObjData([[]]);
      setClearData?.(false);
    }
  }, [clearData]);

  useEffect(() => {
    if (!newValue[`${name}`]?.length) return;
    if (
      inputFieldType?.[`${inputType}`] === inputFieldType?.EMAIL_OPTION ||
      inputFieldType?.[`${inputType}`] === inputFieldType?.NORMAL_OPTION
    ) {
      setObjData(newValue[`${name}`]);
    } else {
      setEmails(newValue[`${name}`]);
    }
    // need to check and update the set object value
  }, [newValue[`${name}`]]);

  useEffect(() => {
    const keys: any = name?.toString().split(".");
    if (keys?.length && returnType === "single") {
      let value: any = newValue;
      for (const key of keys) {
        value = value[key];
      }
      setEmails([value]);
    }
    if (Number(keys?.length) > 1) {
      if (Array.isArray(getIn(newValue, `${name}`))) {
        setEmails(getIn(newValue, `${name}`));
      } else {
        setEmails([getIn(newValue, `${name}`)]);
      }
    }
  }, [name, newValue, returnType]);

  return (
    <div className="email-input-holder">
      {inputFieldType?.[`${inputType}`] === inputFieldType?.EMAIL_OPTION ||
      inputFieldType?.[`${inputType}`] === inputFieldType?.NORMAL_OPTION ? (
        <>
          <Grid container spacing={2} justifyContent="space-between" className="group__container">
            {objData?.map((data: any, index: any) => {
              return (
                <Grid item key={index} className="email__container">
                  <div className="select__option-present">
                    <Select
                      MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                      className={`${isViewOnly ? "disabled" : ""} option__box`}
                      sx={{ border: "1px solid rgba(0, 0, 0, 0.23);" }}
                      disabled={isViewOnly}
                      data-testid="phone-select"
                      // value={values?.phone?.[index]?.code || countryOptions?.[0].value}
                      value={values?.[`${name}`]?.[index]?.code || countryOptions?.[0]?.value || ""}
                      onChange={(ev) => {
                        const newData = [...objData];
                        if (!newData?.length) {
                          newData.push({ code: "", data: "" });
                        }
                        newData[index].code = ev?.target?.value;
                        setObjData(newData);
                        handleChange(ev);
                      }}
                      onBlur={handleBlur}
                      name={`${name}.${index}.code`}
                    >
                      {countryOptions?.map((option, index) => (
                        <MenuItem key={index} value={option.value}>
                          {option?.code}
                        </MenuItem>
                      ))}
                    </Select>
                    <OutlinedInput
                      name={`${name}.${index}`}
                      className="email-input another__box"
                      disabled={isViewOnly}
                      //   value={newValue[`${name}`][index] || ''}
                      value={objData[index]?.data || ""}
                      error={getError(`${name}`, index)}
                      onChange={(ev) => {
                        const newData = [...objData];
                        if (!newData?.length) {
                          newData.push({ code: "", data: "" });
                        }
                        if (!newData[index]?.code) {
                          setFieldValue(`${name}.${index}.code`, `${countryOptions?.[0].value}`);
                        }

                        const value = ev.target.value;
                        if (!validateField(validateFieldType, value)) {
                          return;
                        }
                        newData[index].data = newData[index]?.data ? newData[index]?.data : "";
                        newData[index].data = value;
                        setObjData(newData);
                        // setFieldValue(`${name}.${index}.code`, );
                        setFieldValue(`${name}.${index}.data`, ev?.target?.value);
                      }}
                      onBlur={(ev) => {
                        handleBlur(ev);
                      }}
                    />
                    {getError(`${name}`, index) && (
                      <div className="input-feedback" style={{ color: "red" }}>
                        Invalid data
                      </div>
                    )}
                  </div>

                  {/* delete icon */}
                  {!isViewOnly && objData?.length > 1 && (
                    <div
                      onClick={() => {
                        let prevData = [...objData];
                        prevData?.splice(index, 1);
                        setFieldValue(`${name}`, prevData);
                        setObjData(prevData);
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
            {!disableAdd && (
              <Grid item xs={4} className="grid-align-right add__more-group">
                <Button
                  disabled={isViewOnly}
                  onClick={handleObjData}
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
        </>
      ) : (
        <Grid container spacing={2} justifyContent="space-between" className="group__container">
          {emails &&
            emails?.map((ph, index) => {
              return (
                <Grid item key={index} className="email__container">
                  <div className="email-holder">
                    <OutlinedInput
                      name={`${name}.${index}`}
                      className={`email-input ${isViewOnly ? "disabled" : ""}`}
                      disabled={isViewOnly}
                      //   value={newValue[`${name}`][index] || ''}
                      value={emails?.[index] || ""}
                      error={getError(`${name}`, index)}
                      onChange={(ev) => {
                        const newEmails = [...emails];
                        const value = ev.target.value;
                        if (!validateField(validateFieldType, value)) {
                          return;
                        }
                        newEmails[index] = ev?.target?.value;
                        setEmails(newEmails);
                        if (returnType === "single") {
                          setFieldValue(name, ev?.target?.value);
                          return;
                        }
                        handleChange(ev);
                      }}
                      onBlur={(ev) => {
                        handleBlur(ev);
                      }}
                    />

                    {getError(`${name}`, index) && (
                      <div className="input-feedback" style={{ color: "red" }}>
                        Invalid Email Format
                      </div>
                    )}
                  </div>

                  {/* delete icon */}
                  {!isViewOnly && emails && emails?.length > 1 && (
                    <div
                      onClick={() => {
                        if (
                          inputFieldType?.[`${inputType}`] === inputFieldType?.EMAIL_OPTION ||
                          inputFieldType?.[`${inputType}`] === inputFieldType?.NORMAL_OPTION
                        ) {
                          let prevData = [...objData];
                          prevData?.splice(index, 1);
                          setFieldValue(`${name}`, prevData);
                          setObjData(prevData);
                        } else {
                          let prevEmails = [...emails];
                          prevEmails?.splice(index, 1);
                          setFieldValue(`${name}`, prevEmails);
                          setEmails(prevEmails);
                        }
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
          <Grid item xs={4} className="grid-align-right add__more-group">
            {!disableAdd && (
              <Button
                disabled={isViewOnly}
                onClick={handleEmails}
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
            )}
            {!!addAnotherButton && addAnotherButton}
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default MultiEmailInput;
