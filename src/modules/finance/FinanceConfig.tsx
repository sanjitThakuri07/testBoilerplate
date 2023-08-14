import { Button, Stack, Typography } from "@mui/material";
import { searchParamObject } from "containers/utils";
import { usePathUrlSettor } from "globalStates/config";
import { useLocation, useNavigate } from "react-router-dom";
import { allRoutes } from "routers/routingsUrl";
import "./finance.scss";
import { permissionList } from "src/constants/permssion";
import { permissionFilter } from "src/modules/config/generalSettings/OrganizationConfiguration";
import { usePermissionStore } from "src/store/zustand/permission";

export const tabContainerFinance = [
  {
    label: "Finance",
    link: allRoutes?.SidebarFinanceToBeInvoiced?.url,
    backendUrl: allRoutes?.SidebarFinanceToBeInvoiced?.backendUrl,
    permission: [permissionList.Invoice.view],
    role: [],
  },
  {
    label: "Tariffs",
    link: allRoutes?.SidebarFinanceTariffs?.url,
    backendUrl: allRoutes?.SidebarFinanceTariffs?.backendUrl,
    permission: [permissionList.Tariffs.view],
    role: [],
  },
];

function FinanceConfig() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchObject = searchParamObject(null, location);
  const { permissions } = usePermissionStore();

  const { routes, setCustomRoutes } = usePathUrlSettor();

  const isActive = (path: string, default_status: boolean = false) => {
    return location.pathname === path ||
      (default_status && location.pathname !== "/finance/tariffs")
      ? "active"
      : "";
  };

  return (
    <>
      {!!!searchObject?.[`tariff`] && (
        <>
          <Typography
            variant="h1"
            mt={2}
            className="finance__heading"
            sx={{
              paddingBottom: "1rem",
              marginTop: "2rem",
              marginBottom: "1rem",
              borderBottom: "2px solid #EAECF0",
            }}
          >
            Finance
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            className="config-filter-buttons finance__buttons"
          >
            {tabContainerFinance
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
        </>
      )}
    </>
  );
}

export default FinanceConfig;
