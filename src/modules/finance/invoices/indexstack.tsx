import React, { useEffect } from "react";
import { Box } from "@mui/system";
import FullPageLoader from "src/components/FullPageLoader";
import { Button, CircularProgress, DialogContent, Stack, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { allRoutes } from "src/routers/routingsUrl";
import { usePathUrlSettor } from "src/store/zustand/globalStates/config";
import FinanceLayout from "../FinanceLayout";

const IndexStack = () => {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { routes, setCustomRoutes } = usePathUrlSettor();

  const isActiveSub = (path: string, default_status: boolean = false) => {
    if (default_status && location.pathname === "/finance/invoice") {
      return "active-default";
    }
    return location.pathname === path ? "active" : "";
  };

  return (
    <FinanceLayout>
      <Box sx={{ p: "20px" }} className="config-holder">
        {loading && <FullPageLoader />}
        <Stack
          direction="row"
          alignItems="center"
          className="config-filter-buttons-limited invoice__buttons"
        >
          <Button
            className={isActiveSub(`${allRoutes?.SidebarFinanceToBeInvoiced?.url}`, true)}
            onClick={() => {
              setCustomRoutes({
                backendUrl: allRoutes?.SidebarFinanceToBeInvoiced?.backendUrl,
              });
              navigate(`${allRoutes?.SidebarFinanceToBeInvoiced?.url}`);
            }}
          >
            To be Invoiced
          </Button>

          <Button
            className={isActiveSub(`${allRoutes?.SidebarFinanaceAllInvoices?.url}`)}
            onClick={() => {
              navigate(`${allRoutes?.SidebarFinanaceAllInvoices?.url}`);
              setCustomRoutes({
                backendUrl: allRoutes?.SidebarFinanaceAllInvoices?.backendUrl,
              });
            }}
          >
            All Invoices
          </Button>
        </Stack>
      </Box>
    </FinanceLayout>
  );
};

export default IndexStack;
