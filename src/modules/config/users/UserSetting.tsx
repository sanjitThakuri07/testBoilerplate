import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useSnackbar } from "notistack";
import UsersRoleStore from "src/store/zustand/userSettings/userRole/index";
import { Box } from "@mui/system";
import OrganizationConfiguration, {
  ConfigTableUrlUtils,
} from "../generalSettings/OrganizationConfiguration";
import { BASConfigTableProps } from "src/src/interfaces/configs";
import UsersSettingLayout from "./UserSettingLayout";
import { usePermissionStore } from "src/store/zustand/permission";
import { permissionList } from "src/constants/permission";
import BASDataTableUpdate from "src/modules/table/BASDataTable";
import AddModal from "src/components/AddModal/AddModal";
import AddUserRole from "./RolesAndPermission/AddUserRole";
import CommonFilter, { converToProperFormikFormat, FilteredValue } from "../Filters/CommonFilter";
import { USER_ROLE_AND_PERMISSION_FILTER_INITIAL_VALUE } from "../filterOptionsList";
import { fetchTableData } from "src/modules/apiRequest/apiRequest";
import FullPageLoader from "src/components/FullPageLoader";
import CustomPopUp from "src/components/CustomPopup";
import { usePayloadHook } from "src/constants/customHook/payloadOptions";
import { lockFields } from "src/utils/url";
import useDepartmentStore from "src/store/zustand/userSettings/userDepartment";
import useUserOrgStore from "src/store/zustand/userSettings/userOrg";

// =============== USER DEPARTMENT AND USERS COMMON COMPONENT ==============
export default function UserSetting() {
  const location = useLocation();
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [totalCount, setTotalCount] = React.useState(0);
  const [userLabel, setUserLabel] = React.useState("");
  const [deleteEndpoint, setDeleteEndpoint] = React.useState("");
  const [pathName, setPathName] = React.useState({
    backendUrl: "",
    sectionTitle: "",
    buttonName: "",
    frontEndUrl: "",
    editFrontEndUrlGetter: null,
    deleteFieldName: "id",
    subSectionUrl: null,
  });
  const [getFilterValue, setFilterValue] = React.useState(
    USER_ROLE_AND_PERMISSION_FILTER_INITIAL_VALUE,
  );
  const { enqueueSnackbar } = useSnackbar();
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [presentFilter, setPresentFilter] = React.useState(false);

  const [urlUtils, setUrlUtils] = usePayloadHook();

  const {
    fetchRoles,
    tableActionHandler: RoleTableActionHandler,
    tableDatas: RoleTableDatas,
    loading: RoleLoading,
  }: any = UsersRoleStore();
  const {
    fetchDepartments,
    tableActionHandler: DepartmentTableActionHandler,
    tableDatas: DepartmentTableDatas,
    loading: DepartmentLoading,
  }: any = useDepartmentStore();
  const {
    fetchUserOrgs,
    tableActionHandler: OrgUserTableActionHandler,
    loading: OrganizationLoading,
    tableDatas: OrgUserTableDatas,
  }: any = useUserOrgStore();

  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [viewData, setViewData] = useState<any>({});

  const { permissions } = usePermissionStore();

  const UserBaseUrl = () => {
    let url = "";
    if (location.pathname === "/config/users/roles-and-permission") {
      url = "user-role";
      setUserLabel("User Roles & Permissions");
    } else if (location.pathname === "/config/users/user-department") {
      url = "user-department";
      setUserLabel("User Department");
    } else if (location.pathname === "/config/users/user") {
      url = "organization-user";
      setUserLabel("Organization User");
    }
    return url;
  };

  const tabPermissions: any = {
    "User Roles & Permissions": permissionList.UserRole,
    "User Department": permissionList.UserDepartment,
    "Organization User": permissionList.OrganizationUser,
  };

  const getAllUserSettings = async () => {
    setLoading(true);
    let url: string = UserBaseUrl();
    setPathName((prev: any) => ({
      ...prev,
      backendUrl: `${url}`,
      buttonName: userLabel,
    }));
    switch (url) {
      case "user-role":
        await fetchRoles({ query: urlUtils, getAll: true, enqueueSnackbar });
        break;
      case "user-department":
        await fetchDepartments({ query: urlUtils, getAll: true });
        break;
      case "organization-user":
        await fetchUserOrgs({ query: urlUtils, getAll: true });
        break;
      default:
        break;
    }

    setLoading(false);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const onDataTableChange = ({ key, value }: any) => {
    setUrlUtils({
      ...urlUtils,
      [key]: value,
    });

    if (key === "filterQuery" && !value) {
      setFilterValue(USER_ROLE_AND_PERMISSION_FILTER_INITIAL_VALUE);
      setPresentFilter(false);
    }
  };

  useEffect(() => {
    getAllUserSettings();
  }, [urlUtils, location.pathname]);

  useEffect(() => {
    if (isSuccess) {
      getAllUserSettings();
      setIsSuccess(false);
    }
  }, [isSuccess]);

  // clearing the search input value
  useEffect(() => {
    setUrlUtils((prev) => {
      return {
        ...prev,
        q: "",
        filterQuery: "",
      };
    });
  }, [location.pathname]);

  function getComlumnName() {
    let lastUrl = location.pathname.split("/").reverse()?.[0] || "";
    return lastUrl === "user" ? "full_name" : "name";
  }

  const duplicate =
    location.pathname.includes("/users/roles-and-permission") ||
    location.pathname.includes("/user-department")
      ? true
      : false;

  const tableUpdateDatas: any = {
    ["roles-and-permission"]: {
      data: RoleTableDatas,
      setterFn: async ({ datas, type }: any) => {
        await RoleTableActionHandler({ values: datas, enqueueSnackbar, type: type });
      },
    },
    ["user-department"]: {
      data: DepartmentTableDatas,
      setterFn: async ({ datas, type }: any) => {
        await DepartmentTableActionHandler({ values: datas, enqueueSnackbar, type: type });
      },
    },
    ["user"]: {
      data: OrgUserTableDatas,
      setterFn: async ({ datas, type }: any) => {
        await OrgUserTableActionHandler({ values: datas, enqueueSnackbar, type: type });
      },
    },
  };

  let returnedParams = location.pathname?.toString().split("/")?.reverse()?.[0];
  return (
    <OrganizationConfiguration>
      <AddModal
        openModal={openAddModal}
        setOpenModal={() => setOpenAddModal(!openAddModal)}
        confirmationHeading={"a New User Role"}
        confirmationDesc="Fill in the details to add the new user."
      >
        <AddUserRole setOpenAddModal={setOpenAddModal} setIsSuccess={setIsSuccess} />
      </AddModal>

      <UsersSettingLayout>
        <Box sx={{ p: "20px" }} className="config-holder loader__parent">
          <CustomPopUp
            openModal={openModal}
            title={viewData?.name || ""}
            setOpenModal={() => {
              setOpenModal(false);
            }}
            headers={tableUpdateDatas?.[`${returnedParams}`]?.data?.headers}
            viewData={viewData}
            chipOptions={["status"]}
          ></CustomPopUp>
          {(RoleLoading || DepartmentLoading || OrganizationLoading) && (
            <FullPageLoader className="custom__page-loader" />
          )}

          <BASDataTableUpdate
            data={tableUpdateDatas?.[`${returnedParams}`]?.data || []}
            // deletePath={deleteEndpoint}
            onDataChange={onDataTableChange}
            setterFunction={tableUpdateDatas?.[`${returnedParams}`]?.setterFn || null}
            // configName={userLabel}
            count={totalCount}
            tableIndicator={pathName}
            tableControls={(rowData: any) => {
              let lockDEDL = location?.pathname?.includes("roles-and-permission")
                ? lockFields?.includes(rowData?.name)
                : false;

              return {
                duplicate: !lockDEDL,
                view: true,
                requiredSelectIndication: !lockDEDL,
                archieved: true,
                add: true,
                edit: true,
                delete: !lockDEDL,
              };
            }}
            onView={(data: any) => {
              setViewData(data);
              setOpenModal(true);
            }}
            onAdd={
              location.pathname.includes("users/roles-and-permission")
                ? () => {
                    setOpenAddModal(!openAddModal);
                  }
                : null
            }
            urlUtils={urlUtils}
            keyName={"user-role"}
            backendUrl={"user-role"}
            tableOptions={{
              chipOptionsName: ["status"],
            }}
            permissions={permissions}
            permission={tabPermissions[userLabel]}
            navigateTitle={{
              navigateMode: "view",
              column: getComlumnName(),
              navigate: true,
            }}
            handleSearch={(e: any) => {
              setUrlUtils({
                ...urlUtils,
                q: e,
              });
            }}
            allowFilter={{
              filter: true,
              className: "filter__field",
              filteredOptionLength: presentFilter,
            }}
            duplicate={duplicate}
            FilterComponent={({ filterModal, setFilterModal }: any) => {
              return (
                <CommonFilter
                  setFilterUrl={setUrlUtils}
                  filterModal={filterModal}
                  INITIAL_VALUES={converToProperFormikFormat({
                    data: getFilterValue,
                    getFilterValue,
                  })}
                  setFilterModal={setFilterModal}
                  setPresentFilter={setPresentFilter}
                  filterObj={{ getFilterValue, setFilterValue }}
                ></CommonFilter>
              );
            }}
            filterChildren={
              <FilteredValue
                getFilterValue={getFilterValue}
                setFilterValue={setFilterValue}
                onDataTableChange={onDataTableChange}
              />
            }
          ></BASDataTableUpdate>
        </Box>
      </UsersSettingLayout>
    </OrganizationConfiguration>
  );
}
