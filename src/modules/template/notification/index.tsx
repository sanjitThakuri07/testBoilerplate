import { useTemplateAccessStore } from "../store/templateAccessStore";
import { useEffect, useState } from "react";
import { Breadcrumbs, Button, Link, Stack, Typography } from "@mui/material";
import { Link as Href, useParams } from "react-router-dom";

import AddModal from "src/components/AddModal/AddModalTest";

import NotificationForm from "./AccessForm";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import FullPageLoader from "src/components/FullPageLoader";
import { useSnackbar } from "notistack";
import GroupsIcon from "@mui/icons-material/Groups";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";
import { useOrganizationUserStore } "src/store/zustand/users/organizationUserStore";
import { useUserRoleStore } "src/store/zustand/users/userRoleStore";
import BackButton from "src/components/buttons/back";

const optionTypes: any = {
  1: "Start",
  2: "Start, Edit",
  3: "Start, Edit, Delete",
};

const reportOptionTypes: any = {
  1: "View",
  2: "View, Edit",
  3: "View, Edit, Delete",
};

const roleTypes: any = {
  1: "Owner",
  2: "All Users",
  3: "Roles",
  4: "User",
};

const NotificationControl = ({ notifyModal, setNotifyModal, setNotifyData, ...attr }: any) => {
  const {
    postTemplateAccess,
    updateTemplateAccess,
    getTemplateAccesss,
    deleteTemplateAccess,
    templateAccess,
    isLoading,
  } = useTemplateAccessStore();

  const [configName, setConfigName] = useState({
    singular: "Templates",
    plural: "",
    pathname: "",
    parent_path: "template",
  });

  let { values, parentIndex, notifyData }: any = attr;

  const { userRoles, getUserRoles } = useUserRoleStore();
  const { organizationUsers, getOrganizationUsers } = useOrganizationUserStore();
  const enqueueSnackbar = useSnackbar();

  const [selected, setSelected] = useState<any>(undefined);
  const [showModal, setShowModal] = useState<any>(undefined);

  const handleModalShow = (mode: any) => setShowModal(mode);
  const handleModalClose = () => setNotifyModal(undefined);

  const params = useParams();

  const { templateId } = params;

  useEffect(() => {
    getTemplateAccesss({ query: { template: templateId } });
    getOrganizationUsers({});
    getUserRoles({});
  }, []);

  return (
    <>
      <AddModal
        confirmationHeading={"Notify"}
        openModal={notifyModal}
        setOpenModal={() => handleModalClose()}
      >
        <NotificationForm
          formData={notifyData?.length ? notifyData?.[0] : null}
          templateId={templateId}
          isLoading={isLoading}
          handleModalClose={handleModalClose}
          userRoles={userRoles}
          organizationUsers={organizationUsers}
          onCreate={async ({ values, userRoles }: any) => {
            setNotifyData?.(values);
          }}
          onUpdate={async ({ templateAccessId, datas }: any) => {
            if (
              await updateTemplateAccess({
                templateAccessId,
                values: datas,
                userRoles,
                organizationUsers,
              })
            ) {
              setNotifyModal?.(false);
            }
          }}
          {...attr}
        />
      </AddModal>

      <ConfirmationModal
        openModal={showModal === "delete"}
        setOpenModal={() => handleModalClose()}
        handelConfirmation={async () => {
          await deleteTemplateAccess([selected.id], enqueueSnackbar);
          handleModalClose();
          setSelected(undefined);
        }}
        confirmationHeading={`Do you sure want to delete`}
        status="warning"
        confirmationIcon="src/assets/icons/icon-feature.svg"
      />
    </>
  );
};

export default NotificationControl;
