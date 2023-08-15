import { MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import EmailIdContent from "./EmailIdContent";
import { SnackbarProvider } from "notistack";

type PopupProps = {
  setEmailOpen: () => void;
  backendFieldsForEmail?: string[];
  emailOpen?: boolean;
  values?: { to: string[]; subject: string; contentState: any };
  setInForm?: any;
  parentFormik?: any;
  disabled?: boolean;
  fetchAPIFunction?: Function;
  // Other props for the popup component
};

const Popup: React.FC<PopupProps> = ({
  setEmailOpen,
  backendFieldsForEmail,
  emailOpen,
  values,
  setInForm,
  parentFormik,
  disabled,
  fetchAPIFunction,
  ...otherProps
}) => {
  return (
    <>
      {!!emailOpen &&
        ReactDOM.createPortal(
          <div className="fixed__popup">
            <EmailIdContent
              setEmailOpen={setEmailOpen}
              backendFieldsForEmail={backendFieldsForEmail}
              parentValues={values}
              setInForm={setInForm}
              parentFormik={parentFormik}
              disabled={disabled}
              fetchAPIFunction={fetchAPIFunction}
            />
          </div>,
          document.getElementById("root") as Element | DocumentFragment, // Render the popup outside the current component hierarchy
        )}
    </>
  );
};

const EmailPopUpBox = ({
  setEmailOpen,
  emailOpen,
  backendFieldsForEmail,
  values,
  setInForm,
  parentFormik,
  disabled,
  fetchAPIFunction,
}: any) => {
  return (
    <div className="">
      <Popup
        setEmailOpen={setEmailOpen}
        emailOpen={emailOpen}
        backendFieldsForEmail={backendFieldsForEmail}
        values={values}
        setInForm={setInForm}
        parentFormik={parentFormik}
        disabled={disabled}
        fetchAPIFunction={fetchAPIFunction}
      />
    </div>
  );
};

export default EmailPopUpBox;
