import * as Yup from "yup";
import { checkCharSymbol, checkNumber, checkUpperCase } from "src/utils/keyFunction";

type ErrorType = {
  has_character?: string;
  has_uppercase?: string;
  has_number?: string;
  length?: string;
  all?: string;
};

export function validateApi({ data, value }: any): any {
  let {
    has_character = false,
    has_uppercase = false,
    min_password_length = 8,
    has_number = false,
  } = data || {};

  let error: ErrorType = {};

  let checkValue: any = value?.length >= min_password_length;
  if (has_character && has_uppercase && has_number) {
    checkValue = (checkUpperCase(value) && checkCharSymbol(value) && checkNumber(value)) || false;
    error.all = `Password must contain an uppercase letter, symbol and number`;
  } else if (has_character && has_number) {
    checkValue = (checkCharSymbol(value) && checkNumber(value)) || false;
    error.has_character = "Password must contain symbols and numbers";
  } else if (has_uppercase && has_number) {
    checkValue = (checkUpperCase(value) && checkNumber(value)) || false;
    error.has_character = "Password must contain atleast one uppercase letter and a number";
  } else if (has_number) {
    checkValue = checkNumber(value) || false;
    error.has_character = "Password must contain atleast one number";
  } else if (has_uppercase) {
    checkValue = (checkUpperCase(value) && checkNumber(value)) || false;
    error.has_character = "Password must contain atleast one uppercase letter and a number";
  }
  if (min_password_length) {
    checkValue = checkValue && value?.length >= min_password_length;
    error.length =
      value?.length >= min_password_length
        ? ``
        : `Password must be of atleast ${min_password_length} characters length long`;
  }

  return { status: checkValue, errors: error };
}

// sign up validation
export const SignInSchema = Yup.object().shape({
  login_id: Yup.string().required("Email is required"),

  password: Yup.string().required("Password is required"),
});

// proper email validation
export const validEmailSchema = Yup.object().shape({
  email: Yup.string().email("Enter valid email").required("Email is required"),
});

// set new password validation
export const setNewPasswordSchema = ({ validationData }: any) => {
  // Yup.object().shape({
  //   password: Yup.string()
  //     .required('Please enter your password.')
  //     .matches(
  //       /^.{8,14}$/,
  //       'Password must be more than 8 characters and smaller than 15 characters.',
  //     )
  //     .matches(/^(?=.*[A-Z]).*$/, 'Password must contain at least one upper case character.')
  //     .matches(
  //       // eslint-disable-next-line no-useless-escape
  //       /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/,
  //       'Password must contain at least one special characters.',
  //     ),

  //   confirmPassword: Yup.string()
  //     .required('Please retype your password.')
  //     .oneOf([Yup.ref('password')], 'Password do not matched.'),
  // });

  return Yup.object().shape({
    password: Yup.string()
      .required("Please enter your password.")
      .test({
        message: (value: any) => {
          let messageObject = validateApi?.({ data: validationData, value: value?.value })?.errors;
          let string = Object.values(messageObject || {})?.reduce(
            (acc: any, mssg: any, index: number, wholeArr: any) => {
              return (acc = acc + mssg + (wholeArr?.length - 1 === index ? "" : "<br/>"));
            },
            "",
          );
          return string;
        },
        name: "Password Check",
        test: (value: any) => {
          return validateApi?.({ data: validationData, value: value })?.status || false;
        },
      }),
    confirmPassword: Yup.string()
      .required("Please retype your password.")
      .test({
        message: (value: any) => {
          let messageObject = validateApi?.({ data: validationData, value: value?.value })?.errors;
          let string = Object.values(messageObject || {})?.reduce(
            (acc: any, mssg: any, index: number, wholeArr: any) => {
              return (acc = acc + mssg + (wholeArr?.length - 1 === index ? "" : "<br/>"));
            },
            "",
          );
          return string;
        },
        name: "Password Check",
        test: (value: any) => {
          return validateApi?.({ data: validationData, value: value })?.status || false;
        },
      })
      .oneOf([Yup.ref("password")], "Password do not matched."),
  });
};

// ---------------- User Department schemas --------------------
export const UserDepartmentSchema = Yup.object().shape({
  name: Yup.string()
    .required("Department name is required")
    .max(25, "Name cannot be more than 25 characters"),
  notification_email: Yup.array().of(Yup.string().email()).nullable(),
});

// organization users schema
export const OrgUsersSchema = ({ validationData }: any) =>
  Yup.object().shape({
    full_name: Yup.string()
      .required("Full name is required")
      .max(30, "Name cannot be more than 30 characters"),
    login_id: Yup.string().email("Enter valid email").required("Email is required"),
    role_id: Yup.string().required("User Role is required"),
    user_department_id: Yup.string().required("User Department is required"),
    status: Yup.string().required("Status is required"),
    password: Yup.string()
      .required("Please enter your password.")
      .test({
        message: (value: any) => {
          let messageObject = validateApi?.({ data: validationData, value: value?.value })?.errors;
          let string = Object.values(messageObject || {})?.reduce(
            (acc: any, mssg: any, index: number, wholeArr: any) => {
              return (acc = acc + mssg + (wholeArr?.length - 1 === index ? "" : "<br/>"));
            },
            "",
          );
          return string;
        },
        name: "Password Check",
        test: (value: any) => {
          return validateApi?.({ data: validationData, value: value })?.status || false;
        },
      }),
    confirm_password: Yup.string()
      .required("Please retype your password.")
      .test({
        message: (value: any) => {
          let messageObject = validateApi?.({ data: validationData, value: value?.value })?.errors;
          let string = Object.values(messageObject || {})?.reduce(
            (acc: any, mssg: any, index: number, wholeArr: any) => {
              return (acc = acc + mssg + (wholeArr?.length - 1 === index ? "" : "<br/>"));
            },
            "",
          );
          return string;
        },
        name: "Password Check",
        test: (value: any) => {
          return validateApi?.({ data: validationData, value: value })?.status || false;
        },
      })
      .oneOf([Yup.ref("password")], "Password do not matched."),
  });

// user profile update
export const UserProfileSchema = Yup.object().shape({
  full_name: Yup.string()
    .required("Full name is required")
    .max(30, "Name cannot be more than 30 characters"),
  org_owner_email: Yup.string()
    .email("Enter valid email")
    .required("Organization owner email is required"),
  // phone: phoneNumberValidationSchema.fields.phoneNumber,
  role: Yup.string().required("User Role is required").nullable(),
  designation: Yup.string().required("Designation is required"),
  // user_department_id: Yup.string().required("User Department is required"),
});
export const CustomerUserProfileSchema = Yup.object().shape({
  full_name: Yup.string()
    .required("Full name is required")
    .max(30, "Name cannot be more than 30 characters"),
  org_owner_email: Yup.string()
    .email("Enter valid email")
    .required("Organization owner email is required"),
  // phone: phoneNumberValidationSchema.fields.phoneNumber,
  // role: Yup.string().required('User Role is required').nullable(),
  // designation: Yup.string().required('Designation is required'),
  // user_department_id: Yup.string().required("User Department is required"),
});

// email id content schemas
export const EmailIdContentSchema = Yup.object().shape({
  emailTo: Yup.string().email("Enter valid email").required("Email is required field"),
});

// name: '',
// type: '',
// adjustment: '',
// description: '',
export const PriceAdjustmentSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  // adjustment: Yup.string().required('Adjustment is required'),

  adjustment: Yup.number().when("type", {
    is: "percent",
    then: Yup.number()
      .min(-100, "Adjustment must be greater than or equal to 0")
      .max(100, "Adjustment must be less than or equal to 100")
      .required("Adjustment is required"),
    otherwise: Yup.number().required("Adjustment is required"),
  }),
});

// export const PreviewFormContainerSchema = Yup.object().shape({});
