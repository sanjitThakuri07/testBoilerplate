import { permissionList } from "src/constants/permission";
import { Button, Stack } from "@mui/material";

import { useNavigate, useLocation } from "react-router-dom";
import { permissionFilter } from "../generalSettings/OrganizationConfiguration";
import { usePermissionStore } from "src/store/zustand/permission";

export const subTabContainerUser = [
  {
    label: "User Roles & Permission",
    link: `/config/users/roles-and-permission`,
    permission: [permissionList.UserRole.view, permissionList.UserPermission.view],
    role: [],
  },
  {
    label: " User Department",
    link: "/config/users/user-department",
    permission: [permissionList.UserDepartment.view],
    role: [],
  },
  {
    label: " User",
    link: "/config/users/user",
    permission: [permissionList.OrganizationUser.view],
    role: [],
  },
  {
    label: "User Security",
    link: "/config/users/user-security",
    permission: [permissionList.UserSecurity.view],
    role: [],
  },
  // {
  //   label: 'System Parameters',
  //   link: '/config/users/system-parameters',
  //   permission: [],
  //   role: [],
  // },
];

const UserConfig = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { permissions } = usePermissionStore();

  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <Stack direction="row" alignItems="center" className="config-filter-buttons">
      {subTabContainerUser
        ?.filter((item) => permissionFilter({ item, permissions }))
        ?.map((tab: any, i: number) => {
          return (
            <Button key={i} className={isActive(tab.link)} onClick={() => navigate(`${tab?.link}`)}>
              {tab?.label}
            </Button>
          );
        })}
    </Stack>
  );
};

export default UserConfig;
