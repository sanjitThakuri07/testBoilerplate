import { Button, Stack } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { contractorsUrl } from "src/routers/routingsUrl";
import { usePathUrlSettor } from "src/store/zustand/globalStates/config";
import { permissionList } from "src/constants/permission";
import { permissionFilter } from "../generalSettings/OrganizationConfiguration";
import { usePermissionStore } from "src/store/zustand/permission";

export default function FinanceConfig() {
  const navigate = useNavigate();
  const location = useLocation();

  const { permissions } = usePermissionStore();

  const { routes, setCustomRoutes } = usePathUrlSettor();

  const tabContainer = [
    {
      label: "All Contractors",
      link: `/config/${contractorsUrl?.allContractors?.url}`,
      backendUrl: contractorsUrl?.allContractors?.backendUrl,
      permission: [permissionList.Contractor.view],
      role: [],
    },
    {
      label: "Services",
      link: `/config/${contractorsUrl?.services?.url}`,
      backendUrl: contractorsUrl?.services?.backendUrl,
      permission: [permissionList.Service.view],
      role: [],
    },
  ];
  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <Stack direction="row" alignItems="center" className="config-filter-buttons">
      {tabContainer
        ?.filter((item) => permissionFilter({ item, permissions }))
        ?.map((tab, i) => {
          return (
            <Button
              key={i}
              className={isActive(tab.link)}
              onClick={() => {
                navigate(tab.link);
                setCustomRoutes({
                  backendUrl: tab.backendUrl,
                });
              }}
            >
              {tab?.label}
            </Button>
          );
        })}
    </Stack>
  );
}
