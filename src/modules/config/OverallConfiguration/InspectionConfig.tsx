import { permissionList } from "src/constants/permission";
import { Button, Stack } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { permissionFilter } from "../generalSettings/OrganizationConfiguration";
import { usePermissionStore } from "src/store/zustand/permission";

export const subTabContainerInspection = [
  {
    label: "Inspection Name",
    link: `/config/inspection-types/inspection-name`,
    permission: [permissionList.InspectionName.view],
    role: [],
  },
  // {
  //   label: "Inspection Status",
  //   link: "/config/inspection-types/inspection-status",
  //   permission: [permissionList.InspectionStatus.view],
  //   role: [],
  // },
];
export default function InspectionTypesConfig() {
  const navigate = useNavigate();
  const location = useLocation();

  const { permissions } = usePermissionStore();

  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <Stack direction="row" alignItems="center" className="config-filter-buttons">
      {subTabContainerInspection
        ?.filter((item) => permissionFilter({ item, permissions }))
        ?.map((tab, i) => {
          return (
            <Button key={i} className={isActive(tab.link)} onClick={() => navigate(`${tab?.link}`)}>
              {tab?.label}
            </Button>
          );
        })}
    </Stack>
  );
}
