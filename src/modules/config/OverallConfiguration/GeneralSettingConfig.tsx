import { permissionList } from "src/constants/permission";
import { Button, Stack } from "@mui/material";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { permissionFilter } from "../generalSettings/OrganizationConfiguration";
import { usePermissionStore } from "src/store/zustand/permission";
import { PrivateRoute } from "constants/variables";

export const subTabContainerGeneral = [
  {
    id: 1,
    label: "Region",
    link: "/config/general-settings/region",
    permission: [permissionList.Region.view],
    role: [],
  },
  {
    id: 2,
    label: "Country",
    link: "/config/general-settings/country",
    permission: [permissionList.Country.view],
    role: [],
  },
  {
    id: 3,
    label: "Territory",
    link: "/config/general-settings/territory",
    permission: [permissionList.Territory.view],
    role: [],
  },
  {
    id: 4,
    label: "Location",
    link: "/config/general-settings/location",
    permission: [permissionList.Location.view],
    role: [],
  },
  {
    id: 5,
    label: "System Parameters",
    link: PrivateRoute.configuration.general_settings.SYSTEM_PARAMETERS.HOME,
    permission: [permissionList.SystemParameters.view],
    role: [],
  },
];

const GeneralSettingConfig = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { permissions } = usePermissionStore();

  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <Stack direction="row" alignItems="center" className="config-filter-buttons">
      {subTabContainerGeneral
        .filter((item) => permissionFilter({ item, permissions }))
        ?.map((subTab: any) => (
          <Button className={isActive(subTab.link)} onClick={() => navigate(subTab.link)}>
            {subTab.label}
          </Button>
        ))}

      {/* <Button
        className={isActive("/config/general-settings/time-zone")}
        onClick={() => navigate("/config/general-settings/time-zone")}
      >
        Time Zone
      </Button>
      <Button
        className={isActive("/config/general-settings/weather")}
        onClick={() => navigate("/config/general-settings/weather")}
      >
        Weather
      </Button> */}
      {/* <Button
        className={isActive("/config/general-settings/currency")}
        onClick={() => navigate("/config/general-settings/currency")}
      >
        Currency
      </Button> */}
    </Stack>
  );
};

export default GeneralSettingConfig;
