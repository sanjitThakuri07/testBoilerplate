import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import { permissionList } from "src/constants/permission";
import React from "react";
import { usePermissionStore } from "src/store/zustand/permission";
import { checkPermission } from "src/utils/permission";
import OrganizationAddress from "./OrganizationAddress";
import OrganizationDetails from "./OrganizationDetails";
import OrganizationFormat from "./OrganizationFormat";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  const { permissions } = usePermissionStore();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3, pb: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Organization = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const { permissions } = usePermissionStore();

  return (
    <Box sx={{ padding: "30px 40px" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Box>
          <Stack direction="column">
            <Typography variant="h1" sx={{ marginBottom: "8px" }}>
              Organisation
            </Typography>
          </Stack>
        </Box>
      </Stack>
      <Box sx={{ width: "100%", marginTop: "40px" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            sx={{ borderBottom: "2px solid #EAECF0" }}
          >
            <Tab className="tenants_tabs" label="Global Settings" {...a11yProps(0)} />
            {/* <Tab className="tenants_tabs" label="System Logs" {...a11yProps(1)} /> */}
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          {checkPermission({
            permissions,
            permission: permissionList.Organization.view,
          }) ? (
            <OrganizationDetails />
          ) : null}

          {checkPermission({
            permissions,
            permission: permissionList.Organization.view,
          }) ? (
            <OrganizationFormat />
          ) : null}

          {checkPermission({
            permissions,
            permission: permissionList.Organization.view,
          }) ? (
            <OrganizationAddress />
          ) : null}
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
      </Box>
    </Box>
  );
};

export default Organization;
