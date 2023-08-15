import * as Yup from "yup";
import { validateApi } from "src/components/validationSchema";

const PasswordSchema = ({ validationData }: any) =>
  Yup.object().shape({
    old_password: Yup.string().required("Current password is required!"),
    new_password: Yup.string()
      .required("Please enter your new password password.")
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
      .oneOf([Yup.ref("new_password")], "Password do not matched."),
  });

export default PasswordSchema;
