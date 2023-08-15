import { Box, Grid, Stack, Tab, Tabs, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import React, { ChangeEvent, useEffect, useState } from "react";
import { getAPI } from "src/lib/axios";
import Inspection_Status_DataTable from "./Inspection_Status_DataTable";
import { useConfigStore } from "src/store/zustand/globalStates/config";
import { useSnackbar } from "notistack";
import BASDataTable from "./BASDataTable";
import "./config.scss";
import { usePayloadHook } from "src/constants/customHook/payloadOptions";

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

const tabList: string[] = ["Inspection Name", "Inspection Status"];
export interface ConfigTableUrlUtils {
  q?: string;
  archived?: string;
  page: number;
  size: number;
  filterQuery: "";
}

const InspectionSubTabs = () => {
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const { regions, setRegions } = useConfigStore();
  const { enqueueSnackbar } = useSnackbar();
  const [urlUtils, setUrlUtils] = usePayloadHook();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const onDataTableChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setUrlUtils({
      ...urlUtils,
      q: ev.target.value,
    });
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          className="sub_tab"
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          TabIndicatorProps={{ style: { display: "none" } }}
          //variant="scrollable"
          //scrollButtons
          //allowScrollButtonsMobile
        >
          {tabList.map((tb, index) => (
            <Tab className="sub_tab_btn" label={tb} {...a11yProps(index)} key={tb} />
          ))}
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}></TabPanel>
      <TabPanel value={value} index={1}>
        {/* <BASDataTable data={regions} main_text={"All Inspection Status"} button_text={"Add Status"} add_url={"/config/inspections/add"} onDataChange={onDataTableChange} /> */}
        <BASDataTable
          data={regions}
          onDataChange={onDataTableChange}
          configName={""}
          deletePath={""}
          count={0}
        />
      </TabPanel>
    </Box>
  );
};

export default InspectionSubTabs;
