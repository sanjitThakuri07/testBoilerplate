import { useEffect, useState } from "react";
import { Breadcrumbs, Button, Link, Stack, Typography } from "@mui/material";
import { Link as Href, useLocation, useParams } from "react-router-dom";

import AddModal from "src/components/AddModal/AddModalTest";

import AccessForm from "./AccessForm";
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
import { useTemplateAccessStore } from  "src/modules/template/store/templateAccessStore";
import { useBookingTemplateAccessStore } from  "src/modules/template/store/bookingTemplateAccessStore";
import { useQuotationTemplateAccessStore } from  "src/modules/template/store/quotationTemplateAccessStore";

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

const AccessControl = ({}: any) => {
  const {
    postTemplateAccess,
    updateTemplateAccess,
    getTemplateAccesss,
    deleteTemplateAccess,
    templateAccess,
    isLoading: isLoadingTemplate,
  } = useTemplateAccessStore();
  const {
    postBookingTemplateAccess,
    updateBookingTemplateAccess,
    getBookingTemplateAccesss,
    deleteBookingTemplateAccess,
    bookingTemplateAccess,
    isLoading: isLoadingBookingTemplateAccess,
  } = useBookingTemplateAccessStore();
  const {
    postQuotationTemplateAccess,
    updateQuotationTemplateAccess,
    getQuotationTemplateAccesss,
    deleteQuotationTemplateAccess,
    quotationTemplateAccess,
    isLoading: isLoadingQuotationTemplateAccess,
  } = useQuotationTemplateAccessStore();

  const [configName, setConfigName] = useState({
    singular: "Templates",
    plural: "",
    pathname: "",
    parent_path: "template",
  });

  const { userRoles, getUserRoles } = useUserRoleStore();
  const { organizationUsers, getOrganizationUsers } = useOrganizationUserStore();
  const enqueueSnackbar = useSnackbar();

  const [selected, setSelected] = useState<any>(undefined);
  const [showModal, setShowModal] = useState<any>(undefined);

  const handleModalShow = (mode: any) => setShowModal(mode);
  const handleModalClose = () => setShowModal(undefined);

  const params = useParams();
  const location = useLocation();
  const isQuotation = location.pathname.includes("quotations");
  const isBooking = location.pathname.includes("bookings");

  const [refresh, setRefresh] = useState(false);

  const templatesAccess = isBooking
    ? bookingTemplateAccess
    : isQuotation
    ? quotationTemplateAccess
    : [];

  const postAccessTemplate = isBooking
    ? postBookingTemplateAccess
    : isQuotation
    ? postQuotationTemplateAccess
    : null;

  const updateAccessTemplate = isBooking
    ? updateBookingTemplateAccess
    : isQuotation
    ? updateQuotationTemplateAccess
    : null;

  const deleteAccessTemplate = isBooking
    ? deleteBookingTemplateAccess
    : isQuotation
    ? deleteQuotationTemplateAccess
    : null;

  const isLoadingAccess = isBooking
    ? isLoadingBookingTemplateAccess
    : isQuotation
    ? isLoadingQuotationTemplateAccess
    : null;

  const parentPath = isBooking
    ? "/bookings/all-booking-templates"
    : isQuotation
    ? "/quotations/all-quotation-templates"
    : "/";

  const typeName = isBooking ? "Booking" : isQuotation ? "Quotation" : null;

  const { templateId } = params;

  const breadcrumbs = [
    <Link key="0" href="/">
      <img src="/src/assets/icons/home.svg" alt="home" />
    </Link>,
    <Link underline="hover" key="2" color="inherit">
      <Href
        style={{
          textDecoration: "none",
        }}
        to={`${parentPath}`}
      >
        {typeName} {configName.singular}
      </Href>
    </Link>,
    <Typography key="3" color="text.primary">
      {typeName} Template Access Control
    </Typography>,
  ];

  useEffect(() => {
    if (isBooking) {
      getBookingTemplateAccesss({ query: { template: templateId } });
    } else if (isQuotation) {
      getQuotationTemplateAccesss({ query: { template: templateId } });
    }
    getOrganizationUsers({});
    getUserRoles({});
  }, [refresh]);

  return (
    <>
      <AddModal
        confirmationHeading={"Add new access rule"}
        openModal={showModal === "create" || showModal === "edit"}
        setOpenModal={() => handleModalClose()}
      >
        <AccessForm
          templateType={isBooking ? "booking" : isQuotation ? "quotation" : ""}
          formData={showModal === "edit" ? selected : null}
          templateId={templateId}
          isLoading={isLoadingAccess}
          handleModalClose={handleModalClose}
          userRoles={userRoles}
          organizationUsers={organizationUsers}
          onCreate={async ({ values, userRoles }: any) => {
            if (await postAccessTemplate({ values, userRoles })) {
              handleModalClose();
              setRefresh(!refresh);
            }
          }}
          onUpdate={async ({ templateAccessId, datas }: any) => {
            if (
              await updateAccessTemplate({
                templateAccessId,
                values: datas,
                userRoles,
                organizationUsers,
              })
            ) {
              setShowModal(false);
              setRefresh(!refresh);
            }
          }}
        />
      </AddModal>

      <ConfirmationModal
        openModal={showModal === "delete"}
        setOpenModal={() => handleModalClose()}
        handelConfirmation={async () => {
          await deleteAccessTemplate([selected.id], enqueueSnackbar);
          handleModalClose();
          setSelected(undefined);
        }}
        confirmationHeading={`Do you sure want to delete`}
        status="warning"
        confirmationIcon="src/assets/icons/icon-feature.svg"
      />

      {isLoadingAccess && <FullPageLoader />}
      <div id="AccessControl">
        <div className="header-block">
          <BackButton />
          <div className="breadcrumbs-holder">
            <Breadcrumbs
              separator={<img src="/src/assets/icons/chevron-right.svg" alt="right" />}
              aria-label="breadcrumb"
            >
              {breadcrumbs}
            </Breadcrumbs>
          </div>
          {/* <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            style={{
              marginTop: '20px',
            }}>
            <div className="left">
              <Typography variant="h3" color="primary">
                Schedule Inspection
              </Typography>
              <Typography variant="body1" component="p">
                You can schedule inspection ofor a smooth inspection
              </Typography>
            </div>
          </Stack> */}
        </div>
        <div className="access_control_container">
          <div className="access_control__wrapper">
            <div className="title">{templatesAccess?.items?.[0]?.template}</div>
            <h2>Who can access this template and its inspections?</h2>
            <div className="row">
              <div className="column_wrapper">
                {[
                  `${typeName} Template available to`,
                  "Access level",
                  `${typeName} Inspection results available to`,
                  "Access level",
                ].map((list: string) => (
                  <div className="column">
                    <div>
                      <b>{list}</b>
                    </div>
                  </div>
                ))}
              </div>

              {templatesAccess?.items?.map((ar: any) => (
                <div className="column_wrapper">
                  <div className="column">
                    <div>
                      {ar?.owner ? (
                        <div className="column_item">
                          <AccountCircleIcon />
                          <span className="item_list">{ar?.owner}</span>
                          <div>(Owner)</div>
                        </div>
                      ) : ar?.inspection_available_type === 2 ? (
                        <div className="column_item">
                          <GroupsIcon /> <div>{roleTypes[`${ar?.inspection_available_type}`]}</div>
                        </div>
                      ) : ar?.inspection_available_type === 3 ? (
                        <div className="column_item">
                          <AdminPanelSettingsIcon />
                          <div> {ar?.inspection_groups?.name} </div>
                          <div>(Roles)</div>
                        </div>
                      ) : ar?.inspection_available_type === 4 && ar?.inspection_users?.length ? (
                        ar?.inspection_users?.map((user: any) => (
                          <div className="column_item">
                            <PersonIcon />
                            <span className="item_list">{user.full_name}</span>
                            <div>(Users)</div>
                          </div>
                        ))
                      ) : (
                        "-"
                      )}
                    </div>
                  </div>
                  <div className="column">
                    <div>{optionTypes[`${ar.inspection_access_level}`]}</div>
                  </div>
                  <div className="column">
                    <div>
                      {ar?.report_available_type === 2 ? (
                        <div className="column_item">
                          <GroupsIcon /> <div>{roleTypes[`${ar?.report_available_type}`]}</div>
                        </div>
                      ) : ar?.report_available_type === 3 ? (
                        <div className="column_item">
                          <AdminPanelSettingsIcon />
                          <div> {ar?.report_groups?.name} </div>
                          <div>(Roles)</div>
                        </div>
                      ) : ar?.report_available_type === 4 && ar?.report_users?.length ? (
                        ar?.report_users?.map((user: any) => (
                          <div className="column_item">
                            <PersonIcon />
                            <span className="item_list">{user.full_name}</span>
                            <div>(Users)</div>
                          </div>
                        ))
                      ) : (
                        "-"
                      )}
                    </div>
                  </div>
                  <div className="column">
                    <div className="actions">
                      <div>{reportOptionTypes[`${ar.report_access_level}`]} </div>
                      {ar.id === templatesAccess?.items?.[0]?.id ? null : (
                        <div className="action">
                          <div
                            onClick={() => {
                              setSelected(ar);
                              handleModalShow("edit");
                            }}
                          >
                            <img src="/src/assets/icons/icon-edit.svg" alt="edit" />
                          </div>
                          <div
                            onClick={() => {
                              setSelected(ar);
                              handleModalShow("delete");
                            }}
                          >
                            <img src="/src/assets/icons/icon-trash.svg" alt="delete" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="column" style={{ borderBottom: "none" }}>
                <Button variant="contained" onClick={() => handleModalShow("create")}>
                  + Add New Rules
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccessControl;
