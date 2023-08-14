import { create } from "zustand";
import { DashboardFilter } from "interfaces/dashboardFilter";
import CardIcon from "src/assets/icons/card_icon.svg";

export const useDashboardFilter = create<DashboardFilter>((set) => ({
  searchValue: "",
  debouncedSearch: "",
  sortBy: {
    id: "NEW_TO_OLD",
    label: "Newest to Oldest",
  },
  view: {
    id: "card",
    label: "card",
    icon: CardIcon,
  },
  tenantCreated: {
    id: "180",
    label: "Past 6 month",
  },
  countryFilters: [],

  setSearchValue: (payload) => set({ searchValue: payload }),
  setDebouncedSearch: (payload) => set({ debouncedSearch: payload }),
  setSortByValue: (payload) => set({ sortBy: payload }),
  setViewValue: (payload: any) => set({ view: payload }),
  setTenantCreatedValue: (payload) => set({ tenantCreated: payload }),
  setCountryFilters: (payload: any) => set({ countryFilters: payload }),
}));
