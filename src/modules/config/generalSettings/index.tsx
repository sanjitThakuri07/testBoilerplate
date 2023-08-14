import { Box, Button, Grid, Stack, Tab, Tabs, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import React, { ChangeEvent, useEffect, useState } from "react";
import { getAPI } from "src/lib/axios";
import BASDataTable from "./BASDataTable";
import InspectionSubTabs from "./InspectionSubTabs";
import { useConfigStore } from "globalStates/config";
import { useSnackbar } from "notistack";
import { usePayloadHook } from "constants/customHook/payloadOptions";

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

const tabList: string[] = [
  "General Settings",
  "Users",
  "Notifications",
  "Inspection types",
  "Booking Status",
  "Contractors",
  "Finance",
];

export interface ConfigTableUrlUtils {
  q?: string;
  archived?: string;
  page: number;
  size: number;
  filterQuery?: string;
  to_date?: string;
  from_date?: string;
}

const Config = (): JSX.Element => {
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const { regions, setRegions } = useConfigStore();
  const { enqueueSnackbar } = useSnackbar();

  const [urlUtils, setUrlUtils] = usePayloadHook();

  const fetchRegions = async () => {
    try {
      setLoading(true);
      const { status, ...response } = await getAPI(
        `region/?q=${urlUtils.q}&archived=${urlUtils.archived}&page=${urlUtils.page}&size=${urlUtils.size}`,
      );

      if (status === 200) {
        setLoading(false);
        const { data } = response;
        setRegions(data);
      }
    } catch (error: any) {
      setLoading(false);
      enqueueSnackbar(error.response.data.message || "Something went wrong!", {
        variant: "error",
      });
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const onDataTableChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setUrlUtils({
      ...urlUtils,
      q: ev.target.value,
    });
  };

  useEffect(() => {
    fetchRegions();
  }, [urlUtils]);

  return (
    <div className="config-holder">
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
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              sx={{ borderBottom: "2px solid #EAECF0" }}
              //variant="scrollable"
              //scrollButtons
              //allowScrollButtonsMobile
            >
              {tabList.map((tb, index) => (
                <Tab className="config_tabs" label={tb} {...a11yProps(index)} key={tb} />
              ))}
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}></TabPanel>
          <TabPanel value={value} index={1}></TabPanel>
          <TabPanel value={value} index={2}></TabPanel>
          <TabPanel value={value} index={3}>
            <InspectionSubTabs />
          </TabPanel>
        </Box>
      </Box>
    </div>
  );
};

export default Config;
