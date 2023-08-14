import { ConfigTableUrlUtils } from "@src/modules/config/generalSettings/OrganizationConfiguration";
import { Breadcrumbs, Button, CircularProgress, Link, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import AddModal from "src/components/AddModal/AddModal";
import EditView from "src/components/ViewEdit";
import BackButton from "src/components/buttons/back";
import { permissionList as PERMISSIONLIST } from "src/constants/permission";
import { userRolesStore } from "src/store/zustand/globalStates/config";
import { UserRolesProps } from "src/interfaces/configs";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Link as Href, useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteAPI, getAPI, putAPI } from "src/lib/axios";
import AddUserRole from "./AddUserRole";
import PermissionForm from "./PermissionForm";
import RoleCard from "./RoleCard";

export default function RolesAndPermission() {
  const [configName, setConfigName] = useState({
    singular: "",
    plural: "",
    pathname: "",
    parent_path: "",
    api_pathname: "",
  });
  const [loading, setLoading] = useState(false);
  const [generalCardContainer, setGeneralCardContainer] = useState([]);
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isRoleExpanded, setIsRoleExpanded] = useState(true);
  const [trackLabel, setTrackLabel] = useState("");
  const [deleteId, setDeleteId] = useState<number | null | undefined>(null);
  const [openModal, setOpenModal] = useState(false);
  const [permissionList, setPermissionList] = useState<any>([]);
  const [refresh, setRefresh] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const [roleName, setRoleName] = useState<any>([]);
  const [urlUtils, setUrlUtils] = useState<ConfigTableUrlUtils>({
    page: 1,
    size: 25,
    archived: "",
    q: "",
  });
  const { roleID } = useParams();

  const location = useLocation();
  const navigate = useNavigate();
  const {
    roles: { items },
    setUserRoles,
    deleteUserRoles,
  } = userRolesStore();

  const [currentRole, setCurrentRoles] = useState<UserRolesProps>({
    name: "",
    status: "Active",
    permissions: [],
  });

  const DynamicTableChanger = () => {
    if (location.pathname.includes("roles-and-permission")) {
      setConfigName({
        singular: "User Role and Permission",
        plural: "User Roles and Permission",
        pathname: "roles-and-permission",
        parent_path: "users",
        api_pathname: "user-role",
      });
    }
  };

  const fetchRoleAPI = () => {
    getAPI(`user-role/${roleID}`)
      .then((response) => {
        // console.log(response.data, "Response Data")
        setRoleName(response.data);
        // return response.data
        // setRoleName(response.data.name)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const UpdateRole = (datas: any) => {
    setIsSubmitting(true);
    putAPI(`user-role/${roleID}`, datas)
      .then((response) => {
        setRefresh(true);
        enqueueSnackbar(response.data.message || "Role updated successfully!", {
          variant: "success",
        });
        setIsSubmitting(false);
        navigate("/config/users/roles-and-permission", { replace: true });
      })
      .catch((err) => {
        setIsSubmitting(false);
        enqueueSnackbar(err.code || "Failed to Update Role!", {
          variant: "error",
        });
      });
  };

  useEffect(() => {
    fetchRoleAPI();
  }, [roleID]);

  useEffect(() => {
    if (refresh) {
      getAllGeneralCard();
      fetchRoleAPI();
      setRefresh(false);
    }
  }, [refresh]);
  const readOnly = location.pathname?.includes("view");

  const breadcrumbs = [
    <Link key="0" href="/">
      <img src="/assets/icons/home.svg" alt="home" />
    </Link>,
    <Link underline="hover" key="1" color="inherit">
      <Href to={"/config/general-settings/region"}>General Settings</Href>
    </Link>,
    <Link underline="hover" key="2" color="inherit">
      <Href to={`/config/${configName.parent_path}/${configName.pathname}`}>
        {configName.singular}
      </Href>
    </Link>,
    <Typography key="3" color="text.primary">
      {roleID && !readOnly ? "Edit " : readOnly ? "View " : "Add "} {configName.singular}
    </Typography>,
  ];
  const getAllGeneralCard = async () => {
    setLoading(true);
    try {
      const { status, ...response } = await getAPI(
        `${configName.api_pathname}/?q=${urlUtils.q}&archived=${urlUtils.archived}&page=${urlUtils.page}&size=${urlUtils.size}`,
      );
      if (status === 200) {
        const { data } = response;
        setGeneralCardContainer(data?.items);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const sliceRole = () => {
    let sliceRole = [];
    if (isRoleExpanded) {
      sliceRole = generalCardContainer?.slice(0, 3);
    } else {
      sliceRole = generalCardContainer?.slice(0);
    }
    return sliceRole;
  };
  const handleNavigateToEdit = (id?: number) => {
    navigate(`/config/${configName.parent_path}/${configName.pathname}/edit/${id}`);
  };

  // ---------USER ROLES FUNCTIONS----------------
  const handleDeleteRole = (id?: number) => {
    // if (!id) return;
    // const region = items.find((rg) => rg.id === id);
    // region && setCurrentRegion(region);
    let filteredData: any = generalCardContainer.filter((label: any) => label?.id === id);
    setTrackLabel(filteredData[0]?.name);
    setDeleteId(id);
    setOpenModal(true);

    let datas = {
      config_ids: [id],
    };

    deleteAPI("user-role/", datas)
      .then((response) => {
        fetchRoleAPI();
        console.log(response.data, "response data");
        setRefresh(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editRole = (id?: number) => {
    // if (!id) return;
    const role = items.find((rg) => rg.id === id);
    role && setCurrentRoles(role);
    const reginForm = document.querySelector(".role-form-holder");
    reginForm?.scrollIntoView({
      behavior: "smooth",
    });
  };
  const listPermission = async () => {
    const { data } = await getAPI(`user-permission/`);
    setPermissionList(data);
  };
  useEffect(() => {
    DynamicTableChanger();
    if (!configName?.api_pathname) return;
    getAllGeneralCard();
    listPermission();
  }, [configName.api_pathname]);

  useEffect(() => {
    if (isSuccess) {
      getAllGeneralCard();
      setIsSuccess(false);
    }
  }, [isSuccess]);

  return (
    <div className="add-region-config-holder position-relative">
      <AddModal
        openModal={openAddModal}
        setOpenModal={() => setOpenAddModal(!openAddModal)}
        confirmationHeading={"a New User Role"}
        confirmationDesc="Fill in the details to add the new user."
      >
        <AddUserRole setOpenAddModal={setOpenAddModal} setIsSuccess={setIsSuccess} />
      </AddModal>
      <div className="header-block">
        <BackButton />
        <div className="breadcrumbs-holder">
          <Breadcrumbs
            separator={<img src="/assets/icons/chevron-right.svg" alt="right" />}
            aria-label="breadcrumb"
          >
            {breadcrumbs}
          </Breadcrumbs>
        </div>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <div className="left">
            <Typography variant="h3" color="primary">
              {roleID && !readOnly ? "Edit " : readOnly ? "View " : "Add "} {configName.singular}
            </Typography>
            <Typography variant="body1" component="p">
              {roleID && !readOnly ? "Edit " : readOnly ? "View " : "Add "} all the details of your{" "}
              {configName.singular.toLowerCase()} here.
            </Typography>
          </div>
          {!readOnly && (
            <div className="right">
              <Button
                variant="contained"
                startIcon={<img src="/assets/icons/create_icon.svg" alt="icon-upload" />}
                onClick={() => setOpenAddModal(true)}
              >
                Add Another Role
              </Button>
            </div>
          )}
        </Stack>
      </div>
      {!readOnly && (
        <div className="border-wrapper-role">
          {/* loading */}
          {loading && (
            <Box
              sx={{
                position: "absolute",
                left: "55.5%",
                top: "50%",
                zIndex: 9999,
                transform: "translate(-50%, -50%)",
              }}
            >
              <CircularProgress color="inherit" />
            </Box>
          )}
          {generalCardContainer.length > 0 && (
            <div className="regions">
              <div className="regions-area" key={Number(loading)}>
                {sliceRole()?.map((card: UserRolesProps) => (
                  <RoleCard
                    {...card}
                    key={card.id}
                    status={card.status}
                    navigate={handleNavigateToEdit}
                    handleDeleteRole={handleDeleteRole}
                    editRole={editRole}
                  />
                ))}
              </div>
              {generalCardContainer?.length > 3 && (
                <div className="btn-holder">
                  <Button variant="contained" onClick={() => setIsRoleExpanded(!isRoleExpanded)}>
                    View {!isRoleExpanded ? "Less" : "More"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <EditView permission={PERMISSIONLIST.UserRole.edit} />
      <PermissionForm
        isSubmitting={isSubmitting}
        formData={roleName}
        onCreate={() => {}}
        onEdit={UpdateRole}
        onBack={() => navigate("/config/users/roles-and-permission", { replace: true })}
        permissions={(permissionList && permissionList) || []}
        permissionsModels={[]}
        disabled={readOnly}
      />
    </div>
  );
}
