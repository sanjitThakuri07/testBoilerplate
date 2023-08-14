import { permissionList } from "src/constants/permission";
import { Button, Stack } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { permissionFilter } from "../generalSettings/OrganizationConfiguration";
import { usePermissionStore } from "src/store/zustand/permission";

export default function FinanceConfig() {
  const navigate = useNavigate();
  const location = useLocation();

  const { permissions } = usePermissionStore();

  const tabContainer = [
    // {
    //   label: 'Billing Agreement Names',
    //   link: `/config/finance/billing-agreement-names`,
    //   permission: [permissionList.BillingAgreement.view, permissionList.BillingPlan.view],
    //   role: [],
    // },
    {
      label: "Tariff Rate Types",
      link: "/config/finance/tariff-rate-types",
      permission: [permissionList.TariffRateType.view],
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
            <Button key={i} className={isActive(tab.link)} onClick={() => navigate(`${tab?.link}`)}>
              {tab?.label}
            </Button>
          );
        })}
    </Stack>
  );
}
