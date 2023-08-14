import { Box, Grid, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect } from "react";
import Profile from "./profile";
import AccountSecurity from "./security";
import AuditLog from "./auditLogs";
import Notifications from "./notifications";
import { useLocation, useNavigate } from "react-router-dom";
import { RoutesNameUrl } from "src/routers/routingsUrl";
import BackButton from "src/components/buttons/back";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const Setting: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectTab = searchParams.get("select");
  const chooseTab = RoutesNameUrl[`${selectTab}`];
  const [value, setValue] = React.useState(chooseTab?.id);
  const navigate = useNavigate();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    const routeObj = Object.values(RoutesNameUrl).find((routeObj) => routeObj?.id === newValue);
    navigate(`/settings?select=${routeObj?.url}`);
  };

  useEffect(() => {
    if (chooseTab) {
      setValue(chooseTab?.id);
    } else {
      navigate(`/settings?select=${RoutesNameUrl?.profile?.url}`);
    }
  }, [chooseTab]);

  return (
    <div
      className="setting-tab-holder"
      style={{
        padding: "0 20px",
      }}
    >
      <Typography variant="h1" color="primary" className="heading">
        Settings
      </Typography>
      <BackButton />
      <Grid container>
        <Grid item xs={2}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            className="setting-tabs"
            TabIndicatorProps={{
              style: { display: "none" },
            }}
          >
            <Tab label="Edit Profile" {...a11yProps(0)} />
            <Tab label="Account Security" {...a11yProps(1)} />
            <Tab label="Audit Logs" {...a11yProps(2)} />
            <Tab label="Notifications" {...a11yProps(3)} />
          </Tabs>
        </Grid>
        <Grid item xs={10}>
          <TabPanel value={value} index={0}>
            <Profile />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <AccountSecurity />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <AuditLog />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <Notifications />
          </TabPanel>
        </Grid>
      </Grid>
    </div>
  );
};
export default Setting;
