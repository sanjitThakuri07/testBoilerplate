/* eslint-disable react/no-unescaped-entities */

// no unused variables are allowed
// search for
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// in this file and correct

import React, { useEffect, useMemo, useState } from "react";
import { Chip, Tab, Tabs } from "@mui/material";
import { Stack, Box } from "@mui/system";
import DashboardHeader from "src/components/Dashboard/DashboardHeader";
import DashboardFilters from "src/components/Dashboard/DashboardFilters";
import { getAPI } from "src/lib/axios";
import { PrivateRoute } from "constants/variables";
import { useDashboardFilter } from "globalStates/dashboardFilter";
import CardIcon from "src/assets/icons/card_icon.svg";
import { AllTenants, PendingSignUps, Deactivated } from "src/components/Dashboard/DashboardStatus";
import { userDataStore } from "src/store/zustand/globalStates/userData";
import { useSnackbar } from "notistack";
import Pagination from "src/components/Pagination";
import { setErrorNotification } from "src/modules/apiRequest/apiRequest";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

type paginationData = {
  page: number;
  size: number;
};

const Dashboard: React.FC = () => {
  // tab value
  const [value, setValue] = React.useState(0);
  // loader
  const [loader, setLoader] = React.useState(true);

  const [panelHeader, setPanelHeader] = useState("All Tenants");

  // updating all the tenants status
  const [userData, setUserData] = useState({
    allUsers: [],
    allTenantCount: 0,
    pendingTenantCount: 0,
    deactivatedTenantCount: 0,
    pagination: {
      currentPage: 1,
      pages: 1,
      size: 12,
      noOfPages: 0,
      total: 0,
    },
  });
  const { enqueueSnackbar } = useSnackbar();

  const { allTenantCount, pendingTenantCount, deactivatedTenantCount } = userData;

  const { userType, profilePicture } = userDataStore();

  // getting all the filtered values
  const {
    setViewValue,
    tenantCreated,
    sortBy,
    searchValue,
    setSearchValue,
    setCountryFilters,
    countryFilters,
    setDebouncedSearch,
    debouncedSearch,
    view,
  } = useDashboardFilter();

  // handling search input after 1 seconds
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const endPointHandler = (pagination: paginationData) => {
    let api = "";
    let commonEndPoint = `${
      userType === "Platform_owner"
        ? `${PrivateRoute.ALL_TENANTS_USERS}`
        : `${PrivateRoute.ALL_ORGANIZATIONS_USERS}`
    }`;
    let commonQuery = `q=${debouncedSearch}&country=${countryFilters
      ?.map((country: any) => country?.id)
      .join(",")}&sort_by=${sortBy?.id}&day=${tenantCreated?.id}&page=${
      pagination?.page || 1
    }&size=${pagination?.size || 12}`;
    if (value === 0) {
      api = `${commonEndPoint}?${commonQuery}`;
    } else if (value === 1) {
      api = `${commonEndPoint}?is_signed_up=true&${commonQuery}`;
    } else if (value === 2) {
      api = `${commonEndPoint}?status=deactivate&${commonQuery}`;
    }
    return api;
  };

  const getAllStatusUser = async (signal: any, pagination: paginationData): Promise<void> => {
    setLoader(true);
    try {
      const { status, data } = await getAPI(endPointHandler(pagination), {
        signal,
      });
      setUserData((prev) => {
        return {
          ...prev,
          allUsers: data?.items,
          allTenantCount: data?.info?.all_users_count,
          pendingTenantCount: data?.info?.unsigned_users_count_len,
          deactivatedTenantCount: data?.info?.deactivated_count_len,
          pagination: {
            ...prev.pagination,
            currentPage: data?.page || 1,
            total: data?.total || 0,
            size: data?.size || 0,
            noOfPages: data?.pages || 0,
          },
        };
      });
    } catch (error) {
      setErrorNotification(error, enqueueSnackbar);
      // enqueueSnackbar('Something went wrong', { variant: 'error' });
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    getAllStatusUser(signal, {
      page: 1,
      size: userData?.pagination?.size,
    });
    tabPanelHandler();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, sortBy, tenantCreated, debouncedSearch, countryFilters]);

  const tabPanelHandler = () => {
    if (userType === "Platform_owner") {
      setPanelHeader("All Tenants");
    } else {
      setPanelHeader("All Organizations");
    }
  };

  // tabs label and counting
  const tabLabelHandler = (index: number) => {
    return (
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box>{index === 0 ? panelHeader : index === 1 ? "Pending Sign Ups" : "Deactivated"}</Box>
        <Box>
          <Chip
            sx={{ cursor: "pointer" }}
            label={
              index === 0
                ? allTenantCount
                : index === 1
                ? pendingTenantCount
                : deactivatedTenantCount
            }
          />
        </Box>
      </Stack>
    );
  };

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && <Box>{children}</Box>}
      </div>
    );
  }

  // resetting all the options values
  useEffect(() => {
    setSearchValue("");
    setDebouncedSearch("");
    setCountryFilters([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Box sx={{ padding: "30px 40px" }}>
      <DashboardHeader />
      <Box sx={{ width: "100%", marginTop: "40px" }}>
        <Tabs value={value} onChange={handleChange} sx={{ borderBottom: "2px solid #EAECF0" }}>
          <Tab className="tenants_tabs" label={tabLabelHandler(0)} sx={{ width: "250px" }} />
          <Tab className="tenants_tabs" label={tabLabelHandler(1)} sx={{ width: "250px" }} />
          <Tab className="tenants_tabs" label={tabLabelHandler(2)} sx={{ width: "250px" }} />
        </Tabs>
      </Box>
      {/* filters */}
      <DashboardFilters />
      <TabPanel value={value} index={0}>
        <AllTenants
          userData={userData}
          loader={loader}
          getAllStatusUser={getAllStatusUser}
          setUserData={setUserData}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <PendingSignUps
          userData={userData}
          loader={loader}
          getAllStatusUser={getAllStatusUser}
          setUserData={setUserData}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Deactivated
          userData={userData}
          loader={loader}
          getAllStatusUser={getAllStatusUser}
          setUserData={setUserData}
        />
      </TabPanel>
      <Pagination pagination={userData.pagination} changePage={getAllStatusUser} />
    </Box>
  );
};
export default Dashboard;
