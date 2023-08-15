import { Button, Stack } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { globalResponseSetUrl } from "src/routers/routingsUrl";
import { usePathUrlSettor } from "src/store/zustand/globalStates/config";
import { permissionFilter } from "../generalSettings/OrganizationConfiguration";
import { usePermissionStore } from "src/store/zustand/permission";

export default function FinanceConfig() {
  const navigate = useNavigate();
  const location = useLocation();

  const { permissions } = usePermissionStore();

  const { routes, setCustomRoutes } = usePathUrlSettor();

  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <Stack direction="row" alignItems="center" className="config-filter-buttons">
      {globalResponseSetUrl
        ?.filter((item) => permissionFilter({ item, permissions }))
        ?.map((menu, ind) => (
          <Button
            className={isActive(`${`/config/${menu?.url}`}`)}
            onClick={() => {
              setCustomRoutes({
                backendUrl: menu.backendUrl,
              });
              navigate(`${`/config/${menu?.url}`}`);
            }}
          >
            {menu.label}
          </Button>
        ))}
    </Stack>
  );
}
