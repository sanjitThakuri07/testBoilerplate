import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { getAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import { useConfigStore } from "globalStates/config";
import { Box } from "@mui/system";
import { CircularProgress } from "@mui/material";
import OrganizationConfiguration, {
  ConfigTableUrlUtils,
} from "../generalSettings/OrganizationConfiguration";
import BASDataTable from "../generalSettings/BASDataTable";
import { BASConfigTableProps } from "interfaces/configs";
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
import { usePayloadHook } from "constants/customHook/payloadOptions";
import { lockFields } from "src/utils/url";

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
  const [userSettingData, setUserSettingData] = React.useState<BASConfigTableProps>({
    items: [],
    headers: [],
    page: 1,
    pages: 1,
    size: 1,
    total: 0,
    archivedCount: 0,
  });

  const [urlUtils, setUrlUtils] = usePayloadHook();

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
    setDeleteEndpoint(UserBaseUrl());
    setPathName((prev: any) => ({
      ...prev,
      backendUrl: `${UserBaseUrl()}`,
      buttonName: UserBaseUrl(),
    }));
    await fetchTableData({
      returnWholeData: false,
      setData: setUserSettingData,
      api: UserBaseUrl(),
      setTotalCount,
      enqueueSnackbar,
      urlUtils,
    });
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
            headers={userSettingData?.headers}
            viewData={viewData}
            chipOptions={["status"]}
          >
            {/* {JSON.stringify(viewData)} */}
          </CustomPopUp>
          {loading && <FullPageLoader className="custom__page-loader" />}

          <BASDataTableUpdate
            data={userSettingData}
            deletePath={deleteEndpoint}
            onDataChange={onDataTableChange}
            setterFunction={setUserSettingData}
            configName={userLabel}
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
