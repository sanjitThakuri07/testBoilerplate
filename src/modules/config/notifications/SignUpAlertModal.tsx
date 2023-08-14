import React from "react";
import { Box } from "@mui/material";
import { useAlertPopup } from "globalStates/alertPopup";
import { IOSSwitch } from "src/components/switch/IosSwitch";
import NotificationForm from "./NotificationForm";
import { TextSeperator } from "src/modules/utils";
import BackButton from "src/components/buttons/back";

export default function SignUpAlertModal({
  title,
  values,
  closeBox,
  setTableData,
  disabled,
  updateIndividualEmail,
}: any) {
  const { selectedSearchModule, setSelectedSearchModule, setAlertContainerValue } = useAlertPopup();

  let newTitle = TextSeperator(
    values?.perference_id
      ? Number(values?.perference_id)
        ? values?.perference?.name || ""
        : values?.perference_id
      : title,
  );
  return (
    <Box sx={{ maxHeight: "80vh", overflow: "auto" }} className="custom__alert-box">
      {/* <Box>SignUpAlertModal</Box> */}
      <div style={{ top: "17px", left: "17px", position: "fixed" }}>
        <BackButton
          onBackAction={() => {
            setAlertContainerValue("user-alert");
          }}
        />
      </div>
      <div className="notification__alert-heading">
        <h1>{newTitle}</h1>
        <span>Get notified when {newTitle} are added, updated or deleted.</span>
      </div>
      <NotificationForm
        values={values}
        closeBox={closeBox}
        newTitle={newTitle}
        setTableData={setTableData}
        disabled={disabled}
        updateIndividualEmail={updateIndividualEmail}
      />
    </Box>
  );
}
