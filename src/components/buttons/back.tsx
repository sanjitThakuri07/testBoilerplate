import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SaveIcon from "src/assets/icons/save_icon.svg";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";

const BackButton = ({ onBackAction, backRoute }: any) => {
  const [open, setOpen] = React.useState(false);
  const [hidden, setHidden] = useState(false);

  const navigate = useNavigate();
  const path = window.location.pathname;

  const handleBack = () => {
    if (
      path === "/add-tenant" ||
      path === "/add-organization" ||
      path === "/config/notifications"
    ) {
      setOpen(true);
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    if (path.includes("template")) {
      setHidden(true);
    }
  }, [path]);

  return (
    <>
      {hidden ? null : (
        <Button
          onClick={handleBack}
          startIcon={<img src="/src/assets/icons/back.svg" alt="back button" />}
          sx={{
            textTransform: "capitalize",
          }}
        >
          Back
        </Button>
      )}

      <ConfirmationModal
        openModal={open}
        setOpenModal={setOpen}
        confirmationIcon={SaveIcon}
        handelConfirmation={() => {
          backRoute
            ? navigate(backRoute)
            : onBackAction
            ? (() => {
                onBackAction();
              })()
            : navigate(-1);
        }}
        confirmationHeading={"Are you sure you want to go back?"}
        confirmationDesc={"Any unsaved changes shall not be stored in the system."}
        status={"Normal"}
        IsSingleBtn={false}
      />
    </>
  );
};

export default BackButton;
