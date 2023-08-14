
export interface DashboardFilter {
  searchValue: any;
  debouncedSearch: any,
  sortBy: any;
  view: any;
  tenantCreated: any;
  countryFilters: any;
  // setter functions
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  setDebouncedSearch: React.Dispatch<React.SetStateAction<string>>;
  setSortByValue: React.Dispatch<React.SetStateAction<string>>;
  setViewValue: any;
  setTenantCreatedValue: React.Dispatch<React.SetStateAction<string>>;
  setCountryFilters: any;
}
