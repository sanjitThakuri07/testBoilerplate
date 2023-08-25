import React, { useEffect } from "react";
import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import "./config.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { permissionList } from "src/constants/permission";
import { checkPermission } from "src/utils/permission";
import { usePermissionStore } from "src/store/zustand/permission";
import { subTabContainerGeneral } from "../OverallConfiguration/GeneralSettingConfig";
import { subTabContainerUser } from "../OverallConfiguration/UserConfig";
import { subTabContainerInspection } from "../OverallConfiguration/InspectionConfig";

export interface ConfigTableUrlUtils {
  q?: string;
  archived?: string;
  page: number;
  size: number;
  filterQuery?: any;
}

interface LinkTabProps {
  label?: string;
  href?: string;
  tab?: any;
}

export const permissionFilter = ({ item, permissions }: any) => {
  const result = checkPermission({ permissions, permission: item.permission });
  return result;
};

export const tabContainerConfiguration = [
  {
    id: 1,
    label: "General Settings",
    link: "/config/general-settings/region",
    permission: [
      permissionList.Region.view,
      permissionList.Country.view,
      permissionList.Territory.view,
      permissionList.Location.view,
      permissionList.SystemParameters.view,
    ],
    role: [],
    subTabContainer: subTabContainerGeneral,
  },
  {
    id: 2,
    label: "Users",
    link: "/config/users/roles-and-permission",
    permission: [
      permissionList.UserPermission.view,
      permissionList.UserRole.view,
      permissionList.UserDepartment.view,
      permissionList.OrganizationUser.view,
      permissionList.UserSecurity.view,
    ],
    role: [],
    subTabContainer: subTabContainerUser,
  },
  {
    id: 3,
    label: "Notifications",
    link: "/config/notifications",
    permission: [permissionList.Alert.view],
    role: [],
    subTabContainer: [],
  },
  {
    id: 4,
    label: "Inspections types",
    link: "/config/inspection-types/inspection-name",
    permission: [permissionList.InspectionName.view, permissionList.InspectionStatus.view],
    role: [],
    subTabContainer: subTabContainerInspection,
  },
  {
    id: 5,
    label: "General Status",
    link: "/config/general-status",
    permission: [permissionList.GeneralStatus.view],
    role: [],
    subTabContainer: [],
  },
  {
    id: 6,
    label: "Contractors",
    link: "/config/contractors/all-contractors",
    permission: [permissionList.Contractor.view, permissionList.Service.view],
    role: [],
    subTabContainer: [],
  },
  {
    id: 7,
    label: "Attributes",
    link: "/config/global-response-set/status",
    permission: [
      permissionList.CustomAttributes.view,
      permissionList.InternalAttributes.view,
      permissionList.ExternalAttributes.view,
    ],
    role: [],
    subTabContainer: [],
  },
  {
    id: 8,
    label: "Activity",
    link: "/config/activity/status",
    permission: [permissionList.ActivityStatus.view],
    role: [],
    subTabContainer: [],
  },
  {
    id: 9,
    label: "Finance",
    link: "/config/finance/tariff-rate-types",
    permission: [permissionList.TariffRateType.view, permissionList.TariffRateType.view],
    role: [],
    subTabContainer: [],
  },
  {
    id: 10,
    label: "Findings & Recommendations",
    link: "/config/findings-recommendations",
    permission: [permissionList.FindingsCategory.view],
    role: [],
    subTabContainer: [],
  },

  // {
  //   label: 'Finance',
  //   link: '/config/finance/billing-agreement-names',
  // },
];

const OrganizationConfiguration = ({ children }: any) => {
  const [value, setValue] = React.useState(1);
  const [ignoreHeaderTab, setIgnoreHeaderTab] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { permissions } = usePermissionStore();
  const ignorePaths = [
    "region/add",
    "location/add",
    "country/add",
    "territory/add",
    "time-zone/add",
    "weather/add",
    "currency/add",
    "user-department/add",
    "user/add",
    "billing-agreement-names/add",
    "tariff-rate-types/add",
  ];

  // tab container

  function LinkTab(props: LinkTabProps) {
    const navigate = useNavigate();

    return (
      <Tab
        className="tenants_tabs"
        component="a"
        style={{ minWidth: "0px" }}
        onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
          props?.tab?.subTabContainer.length
            ? navigate(
                props?.tab?.subTabContainer?.filter((item: any) =>
                  permissionFilter({ item, permissions }),
                )?.[0]?.link,
              )
            : navigate(props.tab.link);

          event.preventDefault();
        }}
        {...props}
      />
    );
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    // setValue(newValue + 1);
    // const a = tabContainerConfiguration?.find((tab: any): any => tab?.id === newValue + 1)?.link;
  };

  useEffect(() => {
    // matching the route index for tab page
    let matchedIndex: any = tabContainerConfiguration.find((tab) =>
      tab.link?.includes(location.pathname.split("/").slice(2, 3).join("")),
    );
    setValue(matchedIndex?.id);

    if (location.pathname?.includes("add")) {
      setIgnoreHeaderTab(true);
    } else if (location.pathname?.includes("edit")) {
      setIgnoreHeaderTab(true);
    } else if (location.pathname?.includes("profile")) {
      setIgnoreHeaderTab(true);
    } else {
      setIgnoreHeaderTab(false);
    }
  }, [location.pathname]);

  return (
    <div className={`config-holder`}>
      {!ignoreHeaderTab && (
        <Box sx={{ padding: "29px 24px" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Stack direction="column">
                <Typography variant="h1" sx={{ marginBottom: "8px" }}>
                  Configuration
                </Typography>
              </Stack>
            </Box>
            <Box sx={{ zIndex: 1, cursor: "pointer" }}></Box>
          </Stack>
          <Box sx={{ width: "100%", marginTop: "40px" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabContainerConfiguration
                  .filter((item) => permissionFilter({ item, permissions }))
                  .findIndex((tab) => tab.id === value)}
                onChange={handleChange}
                aria-label="basic tabs example"
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
                sx={{ borderBottom: "2px solid #EAECF0" }}
              >
                {tabContainerConfiguration
                  .filter((item) => permissionFilter({ item, permissions }))
                  .map((tab, index) => {
                    return <LinkTab label={tab?.label} tab={tab} key={index} />;
                  })}
              </Tabs>
            </Box>
          </Box>
        </Box>
      )}
      {children}
    </div>
  );
};

export default OrganizationConfiguration;
