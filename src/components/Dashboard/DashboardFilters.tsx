import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import Grid from "@mui/material/Grid";
import CardIcon from "src/assets/icons/card_icon.svg";
import TableIcon from "src/assets/icons/table_icon.svg";
import AutocompleteInput from "src/components/AutocompleteInput/AutocompleteInput";
import SearchFieldInput from "src/components/SerachFieldInput/SearchFieldInput";
import { Divider, Button, Stack, Chip } from "@mui/material";
import { useDashboardFilter } from "globalStates/dashboardFilter";
import CloseIcon from "@mui/icons-material/Close";
import CountryFilter from "src/components/CountryFilter/CountryFilter";
import CheckingSearchInput from "src/components/CheckingSearchInput";
import { userDataStore } from "src/store/zustand/globalStates/userData";

export default function DashboardFilters() {
  const {
    searchValue,
    setSearchValue,
    sortBy,
    setSortByValue,
    view,
    setViewValue,
    tenantCreated,
    setTenantCreatedValue,
    setCountryFilters,
    setDebouncedSearch,
  } = useDashboardFilter();

  const [locationModal, setLocationModal] = React.useState(false);
  const [locations, setLocations] = React.useState<any>([]);
  const { userType } = userDataStore();

  const sortByOptions = [
    {
      id: "OLD_TO_NEW",
      label: "Oldest to Newest",
    },
    {
      id: "NEW_TO_OLD",
      label: "Newest to Oldest",
    },
    {
      id: "ATOZ",
      label: "A to Z",
    },
    {
      id: "ZTOA",
      label: "Z to A",
    },
  ];

  const viewOptions = [
    {
      id: "card",
      label: "Card",
      icon: CardIcon,
    },
    {
      id: "table",
      label: "Table",
      icon: TableIcon,
    },
  ];

  const tenantCreatedOptions = [
    {
      id: "7",
      label: "Past 7 days",
    },
    {
      id: "30",
      label: "Past 1 month",
    },
    {
      id: "90",
      label: "Past 3 month",
    },
    {
      id: "180",
      label: "Past 6 month",
    },
    {
      id: "1",
      label: "Recently",
    },
    // {
    //   id: 'custom',
    //   label: 'Custom',
    // },
  ];

  // removing the country
  const locationRemoveHandler = (country: any) => {
    let filteredLocation = locations.filter((loca: any) => loca.id !== country.id);
    setLocations(filteredLocation);
    setCountryFilters([...filteredLocation]);
  };

  return (
    <>
      {/* country filters */}
      <CountryFilter
        locationModal={locationModal}
        setLocationModal={setLocationModal}
        locations={locations}
        setLocations={setLocations}
      />

      <Box sx={{ width: "100%", marginTop: "30px" }}>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={6}>
            <Box>
              <SearchFieldInput
                label="Search here"
                placeholder={
                  userType === "Platform_owner"
                    ? "Search for tenants here"
                    : "Search for organizations here"
                }
                value={searchValue}
                setValue={setSearchValue}
                options={[{ id: "", label: "" }]}
                setDebouncedSearch={setDebouncedSearch}
              />
            </Box>
          </Grid>
          <Grid container xs={6} item spacing={2}>
            <Grid item xs={4}>
              <AutocompleteInput
                options={sortByOptions}
                value={sortBy}
                setValue={setSortByValue}
                placeholder="Sort By"
                label="Sort by"
              />
            </Grid>
            <Grid item xs={4}>
              <AutocompleteInput
                options={viewOptions}
                value={view}
                setValue={setViewValue}
                placeholder="View"
                label="View"
              />
            </Grid>
            <Grid item xs={4}>
              <AutocompleteInput
                options={tenantCreatedOptions}
                value={tenantCreated}
                setValue={setTenantCreatedValue}
                placeholder={
                  userType === "Platform_owner" ? "Tenant created" : "Organizations created"
                }
                label={userType === "Platform_owner" ? "Tenant created" : "Organizations created"}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          sx={{ mt: 2, mb: 2 }}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box className="pill-holder">
            {Array?.isArray(locations) &&
              locations?.map((loca) => {
                return (
                  <Chip
                    key={loca.id}
                    label={loca.name}
                    variant="outlined"
                    deleteIcon={<CloseIcon />}
                    onDelete={() => locationRemoveHandler(loca)}
                  />
                );
              })}
          </Box>
          <Button
            onClick={() => setLocationModal(true)}
            size="small"
            sx={{
              background: "#fff",
              border: "1px solid #D0D5DD",
              fontWeight: "500",
              height: "46px",
              fontSize: "15px",
            }}
            variant="outlined"
            startIcon={<img src="/assets/icons/globe.svg" alt="location" />}
          >
            Location Filters
          </Button>
        </Grid>
        <Divider />
      </Box>
    </>
  );
}
