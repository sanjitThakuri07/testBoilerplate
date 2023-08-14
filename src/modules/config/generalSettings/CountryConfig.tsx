import React, { ChangeEvent, useEffect, useMemo } from "react";
import { Box, Button, CircularProgress, Grid, Stack, Tab, Tabs, Typography } from "@mui/material";
import "./config.scss";
import ConfigFilter from "./ConfigFilter";
import UserFilter from "./UserFilter";
import InspectionSubTabs from "./InspectionSubTabs";
import BASDataTable from "./BASDataTable";
import { getAPI } from "src/lib/axios";
import { useConfigStore } from "src/store/zustand/globalStates/config";
import { useSnackbar } from "notistack";
import { useLocation, useNavigate } from "react-router-dom";
import TwoFactorAuthentication from "containers/setting/security/TwoFactorAuthentication";
import ConfigurationUsers from "../users";
import SystemParamaters from "../users/systemParamaters";
import FinanceConfig from "../finance";
import debouce from "lodash.debounce";
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
  filterQuery: "";
}

const CountryConfig = () => {
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const { regions, setRegions } = useConfigStore();
  const { enqueueSnackbar } = useSnackbar();
  const [pathName, setPathName] = React.useState<string>("");
  const [deleteEndpoint, setDeleteEndpoint] = React.useState<string>("");
  const [totalCount, setTotalCount] = React.useState<number>(0);
  const [urlUtils, setUrlUtils] = usePayloadHook();

  const location = useLocation();
  const navigate = useNavigate();

  const fetchRegions = async () => {
    let urlParam = "";
    if (location.pathname === "/config/countries") {
      urlParam = "country";
      setPathName("Countries");
      setDeleteEndpoint("country");
    } else if (location.pathname === "/config/regions") {
      urlParam = "region";
      setPathName("Regions");
      setDeleteEndpoint("region");
    } else if (location.pathname === "/config/locations") {
      urlParam = "location";
      setPathName("Locations");
      setDeleteEndpoint("location");
    } else if (location.pathname === "/config/territories") {
      urlParam = "territory";
      setPathName("Territories");
      setDeleteEndpoint("territory");
    } else if (location.pathname === "/config/department") {
      urlParam = "user-department";
      setPathName("department");
      setDeleteEndpoint("user-department");
    }
    if (value === 0) {
      try {
        setLoading(true);
        const { status, ...response } = await getAPI(
          `${urlParam}/?q=${urlUtils.q}&archived=${urlUtils.archived}&page=${urlUtils.page}&size=${urlUtils.size}`,
        );

        if (status === 200) {
          setLoading(false);
          const { data } = response;
          setRegions(data);
          setTotalCount(data.total);
        }
      } catch (error: any) {
        setLoading(false);
        enqueueSnackbar(error.response.data.message || "Something went wrong!", {
          variant: "error",
        });
      }
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

  const debouncedResults = useMemo(() => {
    return debouce(onDataTableChange, 1000);
  }, [urlUtils.q]);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  useEffect(() => {
    fetchRegions();
  }, [urlUtils, location.pathname, urlUtils.q, urlUtils.archived, urlUtils.page, urlUtils.size]);

  const style = {
    background: "rgba(52, 64, 84, 0.7)",
    backdropFilter: "blur(8px)",
  };

  return (
    <div className={`config-holder `}>
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
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
              sx={{ borderBottom: "2px solid #EAECF0" }}
            >
              {tabList.map((tb, index) => (
                <Tab
                  className="tenants_tabs"
                  label={tb}
                  {...a11yProps(index)}
                  key={tb}
                  // onClick={() => {
                  //   navigate(`/config/${tb.toLocaleLowerCase().replace(' ', '-')}`);
                  // }}
                />
              ))}
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <ConfigFilter />

            {loading && (
              <Box
                sx={{
                  position: "absolute",
                  left: "55.5%",
                  top: "50%",
                  zIndex: 9999,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <CircularProgress color="inherit" />
              </Box>
            )}
            <BASDataTable
              data={regions}
              deletePath={deleteEndpoint}
              onDataChange={debouncedResults}
              configName={pathName}
              count={totalCount}
              urlUtils={urlUtils}
            />
          </TabPanel>

          <TabPanel value={value} index={1}>
            <UserFilter />

            <ConfigurationUsers />

            {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TwoFactorAuthentication />
            </Box> */}
          </TabPanel>
          <TabPanel value={value} index={2}>
            Hello tab 2
          </TabPanel>
          <TabPanel value={value} index={3}>
            <InspectionSubTabs />
          </TabPanel>
          <TabPanel value={value} index={6}>
            <FinanceConfig />
          </TabPanel>
        </Box>
      </Box>
    </div>
  );
};

export default CountryConfig;
