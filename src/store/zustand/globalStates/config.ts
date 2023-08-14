import { create } from 'zustand';
import {
  BASConfigCountryTableProps,
  BASConfigFinanceBillingAgreementTableProps,
  BASConfigLocationTableProps,
  BASConfigTableProps,
  BASConfigTerritoryTableProps,
  BillingAgreementProps,
  CountryProps,
  LocationProps,
  RegionProps,
  TerritoryProps,
  serviceProps,
  contractorTableProps,
  contractorProps,
  activityTypeProps,
  activityTypeTableProps,
  activityStatusTableProps,
  UserRolesProps,
  userRolesTypeTableProps,
} from 'interfaces/configs';

interface ConfigStore {
  regions: BASConfigTableProps;
  setRegions: (region: BASConfigTableProps) => void;
  addRegions: (region: RegionProps) => void;
  updateRegions: (region: RegionProps) => void;
  deleteRegions: (id: number) => void;

  territories: BASConfigTerritoryTableProps;
  setTerritories: (territory: BASConfigTerritoryTableProps) => void;
  addTerritories: (territory: TerritoryProps) => void;
  updateTerritories: (territory: TerritoryProps) => void;
  deleteTerritories: (id: number) => void;

  countries: BASConfigCountryTableProps;
  setCountries: (country: BASConfigCountryTableProps) => void;
  addCountries: (country: CountryProps) => void;
  updateCountries: (country: CountryProps) => void;
  deleteCountries: (id: number) => void;

  locations: BASConfigLocationTableProps;
  setLocations: (location: BASConfigLocationTableProps) => void;
  addLocations: (location: LocationProps) => void;
  updateLocations: (location: LocationProps) => void;
  deleteLocations: (id: number) => void;
}

interface configContractorStore {
  services: BASConfigTableProps;
  setServices: (service: BASConfigTableProps) => void;
  addServices: (service: serviceProps) => void;
  updateServices: (service: serviceProps) => void;
  deleteServices: (id: number) => void;
}

interface ConfigDepartmentStore {
  departments: BASConfigTableProps;
  setDepartments: (department: BASConfigTableProps) => void;
  addDepartments: (departments: RegionProps[]) => void;
  updateDepartments: (department: RegionProps) => void;
  deleteDepartments: (id: number) => void;
}

interface FinanceBillingAgreementStore {
  billingAgreements: BASConfigFinanceBillingAgreementTableProps;
  setBillingAgreements: (billingAgreement: BASConfigFinanceBillingAgreementTableProps) => void;
  addBillingAgreements: (billingAgreement: BillingAgreementProps) => void;
  updateBillingAgreements: (billingAgreement: BillingAgreementProps) => void;
  deleteBillingAgreements: (id: number) => void;
}

interface globalPathSetter {
  routes: { frontendUrl?: string; backendUrl?: any };
  setCustomRoutes: (data: { frontendUrl?: string; backendUrl?: string }) => void;
}

interface configContractorAllContractorStore {
  allContractor: contractorTableProps;
  setContractor: (contractor: contractorTableProps) => void;
  addContractor?: (contractor: contractorProps) => void;
  updateContractor?: (contractor: any) => void;
  delteContractor?: (id: number) => void;
}

interface activityType {
  activityType: activityTypeTableProps;
  setActivityType: (activityType: activityTypeTableProps) => void;
  addActivityType: (activityType: activityTypeProps) => void;
  updateActivityType: (activityType: activityTypeProps) => void;
  deleteActivityType: (id: number) => void;
}

interface activityStatus {
  statusType: BASConfigTableProps;
  setActivityStatus: (status: BASConfigTableProps) => void;
  addActivityStatus: (status: serviceProps) => void;
  updateActivityStatus: (status: serviceProps) => void;
  deleteActivityStatus: (id: number) => void;
}
interface userRolesStore {
  roles: userRolesTypeTableProps;
  setUserRoles: (role: userRolesTypeTableProps) => void;
  addUserRoles: (role: UserRolesProps) => void;
  updateUserRoles: (role: UserRolesProps) => void;
  deleteUserRoles: (id: number) => void;
}

export const useConfigStore = create<ConfigStore>((set) => ({
  regions: {
    items: [],
    page: 1,
    pages: 1,
    size: 1,
    total: 0,
    headers: [],
  },
  setRegions: (regionsPayload: BASConfigTableProps) =>
    set({
      regions: regionsPayload,
    }),
  addRegions: (region: RegionProps) => {
    set((state) => {
      const oldRegions = { ...state.regions };
      state.regions = {
        ...oldRegions,
        items: [region, ...oldRegions.items],
      };
      return state;
    });
  },
  updateRegions: (region: RegionProps) => {
    set((state) => {
      const oldRegions = { ...state.regions };
      state.regions = {
        ...oldRegions,
        items: oldRegions.items.map((rg) => {
          if (rg.id === region.id) return region;
          return rg;
        }),
      };
      return state;
    });
  },
  deleteRegions: (id: number) => {
    set((state) => {
      const tempRegionsItems = state.regions.items;
      const updateRegions: BASConfigTableProps = {
        ...state.regions,
        items: tempRegionsItems.filter((rg) => rg.id !== id),
      };
      state.regions = updateRegions;
      return state;
    });
  },

  // Territories
  territories: {
    items: [],
    page: 1,
    pages: 1,
    size: 1,
    total: 0,
    headers: [],
  },
  setTerritories: (territoriesPayload: BASConfigTerritoryTableProps) =>
    set({
      territories: territoriesPayload,
    }),
  addTerritories: (territory: TerritoryProps) => {
    set((state) => {
      const oldTerritories = { ...state.territories };
      state.territories = {
        ...oldTerritories,
        items: [territory, ...oldTerritories.items],
      };
      return state;
    });
  },
  updateTerritories: (territory: TerritoryProps) => {
    set((state) => {
      const oldTerritories = { ...state.territories };
      state.territories = {
        ...oldTerritories,
        items: oldTerritories.items.map((rg) => {
          if (rg.id === territory.id) return territory;
          return rg;
        }),
      };
      return state;
    });
  },
  deleteTerritories: (id: number) => {
    set((state) => {
      const tempTerritoriesItems = state.territories.items;
      const updateTerritories: BASConfigTerritoryTableProps = {
        ...state.territories,
        items: tempTerritoriesItems.filter((rg) => rg.id !== id),
      };
      state.territories = updateTerritories;
      return state;
    });
  },

  // Countries
  countries: {
    items: [],
    page: 1,
    pages: 1,
    size: 1,
    total: 0,
    headers: [],
  },
  setCountries: (countriesPayload: BASConfigCountryTableProps) =>
    set({
      countries: countriesPayload,
    }),
  addCountries: (country: CountryProps) => {
    set((state) => {
      const oldCountries = { ...state.countries };
      state.countries = {
        ...oldCountries,
        items: [country, ...oldCountries.items],
      };
      return state;
    });
  },
  updateCountries: (country: CountryProps) => {
    set((state) => {
      const oldCountries = { ...state.countries };
      state.countries = {
        ...oldCountries,
        items: oldCountries.items.map((rg) => {
          if (rg.id === country.id) return country;
          return rg;
        }),
      };
      return state;
    });
  },
  deleteCountries: (id: number) => {
    set((state) => {
      const tempCountriesItems = state.countries.items;
      const updateCountries: BASConfigCountryTableProps = {
        ...state.countries,
        items: tempCountriesItems.filter((rg) => rg.id !== id),
      };
      state.countries = updateCountries;
      return state;
    });
  },

  // Locations
  locations: {
    items: [],
    page: 1,
    pages: 1,
    size: 1,
    total: 0,
    headers: [],
  },
  setLocations: (locationsPayload: BASConfigLocationTableProps) =>
    set({
      locations: locationsPayload,
    }),
  addLocations: (location: LocationProps) => {
    set((state) => {
      const oldLocations = { ...state.locations };
      state.locations = {
        ...oldLocations,
        items: [location, ...oldLocations.items],
      };
      return state;
    });
  },
  updateLocations: (location: LocationProps) => {
    set((state) => {
      const oldLocations = { ...state.locations };
      state.locations = {
        ...oldLocations,
        items: oldLocations.items.map((rg) => {
          if (rg.id === location.id) return location;
          return rg;
        }),
      };
      return state;
    });
  },
  deleteLocations: (id: number) => {
    set((state) => {
      const tempLocationsItems = state.locations.items;
      const updateLocations: BASConfigLocationTableProps = {
        ...state.locations,
        items: tempLocationsItems.filter((rg) => rg.id !== id),
      };
      state.locations = updateLocations;
      return state;
    });
  },
}));

export const useDepartmentConfigStore = create<ConfigDepartmentStore>((set) => ({
  departments: {
    items: [],
    page: 1,
    pages: 1,
    size: 1,
    total: 0,
    headers: [],
  },
  setDepartments: (departmentsPayload: BASConfigTableProps) =>
    set({
      departments: departmentsPayload,
    }),
  addDepartments: (departments: RegionProps[]) => {
    set((state) => {
      const oldDepartments = { ...state.departments };
      state.departments = {
        ...oldDepartments,
        items: [...departments, ...oldDepartments.items],
      };
      return state;
    });
  },
  updateDepartments: (department: RegionProps) => {
    set((state) => {
      const oldDepartments = { ...state.departments };
      state.departments = {
        ...oldDepartments,
        items: oldDepartments.items.map((rg) => {
          if (rg.id === department.id) return department;
          return rg;
        }),
      };
      return state;
    });
  },
  deleteDepartments: (id: number) => {
    set((state) => {
      const tempDepartmentsItems = state.departments.items;
      const updateDepartments: BASConfigTableProps = {
        ...state.departments,
        items: tempDepartmentsItems.filter((rg) => rg.id !== id),
      };
      state.departments = updateDepartments;
      return state;
    });
  },
}));

export const useFinanceBillingAgreementStore = create<FinanceBillingAgreementStore>((set) => ({
  billingAgreements: {
    items: [],
    page: 1,
    pages: 1,
    size: 1,
    total: 0,
    headers: [],
  },
  setBillingAgreements: (billingAgreementsPayload: BASConfigFinanceBillingAgreementTableProps) =>
    set({
      billingAgreements: billingAgreementsPayload,
    }),

  addBillingAgreements: (billingAgreement: BillingAgreementProps) => {
    set((state) => {
      const oldBillingAgreements = { ...state.billingAgreements };
      state.billingAgreements = {
        ...oldBillingAgreements,
        items: [billingAgreement, ...oldBillingAgreements.items],
      };
      return state;
    });
  },

  updateBillingAgreements: (billingAgreement: BillingAgreementProps) => {
    set((state) => {
      const oldBillingAgreements = { ...state.billingAgreements };
      state.billingAgreements = {
        ...oldBillingAgreements,
        items: oldBillingAgreements.items.map((rg) => {
          if (rg.id === billingAgreement.id) return billingAgreement;
          return rg;
        }),
      };
      return state;
    });
  },
  deleteBillingAgreements: (id: number) => {
    set((state) => {
      const tempBillingAgreementsItems = state.billingAgreements.items;
      const updateBillingAgreements: BASConfigFinanceBillingAgreementTableProps = {
        ...state.billingAgreements,
        items: tempBillingAgreementsItems.filter((rg) => rg.id !== id),
      };
      state.billingAgreements = updateBillingAgreements;
      return state;
    });
  },
}));

// contractor store
export const useContractorServicesStore = create<configContractorStore>((set) => ({
  services: {
    items: [],
    page: 1,
    pages: 1,
    size: 1,
    total: 0,
    headers: [],
  },
  setServices: (servicesPayload: BASConfigTableProps) =>
    set({
      services: servicesPayload,
    }),
  addServices: (service: serviceProps) => {
    set((state) => {
      const oldServices = { ...state.services };
      state.services = {
        ...oldServices,
        items: [service, ...oldServices.items],
      };
      return state;
    });
  },
  updateServices: (service: serviceProps) => {
    set((state) => {
      const oldServices = { ...state.services };
      state.services = {
        ...oldServices,
        items: oldServices.items.map((rg) => {
          if (rg.id === service.id) return service;
          return rg;
        }),
      };
      return state;
    });
  },
  deleteServices: (id: number) => {
    set((state) => {
      const tempServicesItems = state.services.items;
      const updateServices: BASConfigTableProps = {
        ...state.services,
        items: tempServicesItems.filter((rg) => rg.id !== id),
      };
      state.services = updateServices;
      return state;
    });
  },
}));

// setting dynamic path
export const usePathUrlSettor = create<globalPathSetter>((set) => ({
  routes: {
    backendUrl: '',
    frontEndUrl: '',
  },
  setCustomRoutes: (routePayload: { backendUrl?: any; fronEndUrl?: '' }) => {
    set({ routes: routePayload });
  },
}));

// contractor all-contractor part-1 store
export const useContractorAllContractorStore = create<configContractorAllContractorStore>(
  (set) => ({
    allContractor: {
      items: [],
      page: 1,
      pages: 1,
      size: 1,
      total: 0,
      headers: [],
    },
    setContractor: (contractorPayload: contractorTableProps) =>
      set({
        allContractor: contractorPayload,
      }),
    addContractor: (contractor: contractorProps) => {
      set((state) => {
        const oldContractor = { ...state.allContractor };
        state.allContractor = {
          ...oldContractor,
          items: [contractor, ...oldContractor.items],
        };
        return state;
      });
    },
    updateContractor: (contractor: contractorProps) => {
      set((state) => {
        const oldContractor = { ...state.allContractor };
        state.allContractor = {
          ...oldContractor,
          items: oldContractor.items.map((rg) => {
            if (rg.id === contractor.id) return contractor;
            return rg;
          }),
        };
        return state;
      });
    },
    deleteContractor: (id: number) => {
      set((state) => {
        const tempContractorItems = state.allContractor.items;
        const updateContractor: contractorTableProps = {
          ...state.allContractor,
          items: tempContractorItems.filter((rg) => rg.id !== id),
        };
        state.allContractor = updateContractor;
        return state;
      });
    },
  }),
);

// activity store
export const activityTypeStore = create<activityType>((set) => ({
  activityType: {
    items: [],
    page: 1,
    pages: 1,
    size: 1,
    total: 0,
    headers: [],
  },
  setActivityType: (activityTypePayload: activityTypeTableProps) =>
    set({
      activityType: activityTypePayload,
    }),
  addActivityType: (activity: activityTypeProps) => {
    set((state) => {
      const oldActivityType = { ...state.activityType };
      state.activityType = {
        ...oldActivityType,
        items: [activity, ...oldActivityType.items],
      };
      return state;
    });
  },
  updateActivityType: (activity: activityTypeProps) => {
    set((state) => {
      const oldActivityType = { ...state.activityType };
      state.activityType = {
        ...oldActivityType,
        items: oldActivityType.items.map((rg) => {
          if (rg?.id === activity?.id) return activity;
          return rg;
        }),
      };
      return state;
    });
  },
  deleteActivityType: (id: number) => {
    set((state) => {
      const tempActivityTypeItems = state.activityType.items;
      const updateActivityType: activityTypeTableProps = {
        ...state.activityType,
        items: tempActivityTypeItems.filter((rg) => rg.id !== id),
      };
      state.activityType = updateActivityType;
      return state;
    });
  },
}));

export const activityStatusStore = create<activityStatus>((set) => ({
  statusType: {
    items: [],
    page: 1,
    pages: 1,
    size: 1,
    total: 0,
    headers: [],
  },
  setActivityStatus: (activityStatusTypePayload: activityStatusTableProps) =>
    set({
      statusType: activityStatusTypePayload,
    }),
  addActivityStatus: (activity: serviceProps) => {
    set((state) => {
      const oldActivityStatus = { ...state.statusType };
      state.statusType = {
        ...oldActivityStatus,
        items: [activity, ...oldActivityStatus.items],
      };
      return state;
    });
  },
  updateActivityStatus: (activity: serviceProps) => {
    set((state) => {
      const oldActivityStatus = { ...state.statusType };
      state.statusType = {
        ...oldActivityStatus,
        items: oldActivityStatus.items.map((rg) => {
          if (rg?.id === activity?.id) return activity;
          return rg;
        }),
      };
      return state;
    });
  },
  deleteActivityStatus: (id: number) => {
    set((state) => {
      const tempActivityStatusItems = state.statusType.items;
      const updateActivityStatus: activityStatusTableProps = {
        ...state.statusType,
        items: tempActivityStatusItems.filter((rg) => rg.id !== id),
      };
      state.statusType = updateActivityStatus;
      return state;
    });
  },
}));
export const userRolesStore = create<userRolesStore>((set) => ({
  roles: {
    items: [],
    page: 1,
    pages: 1,
    size: 1,
    total: 0,
    headers: [],
  },
  setUserRoles: (userRolesPayload: userRolesTypeTableProps) =>
    set({
      roles: userRolesPayload,
    }),
  addUserRoles: (userRoles: UserRolesProps) => {
    set((state) => {
      const oldUserRoles = { ...state.roles };
      state.roles = {
        ...oldUserRoles,
        items: [userRoles, ...oldUserRoles.items],
      };
      return state;
    });
  },
  updateUserRoles: (userRoles: UserRolesProps) => {
    set((state) => {
      const oldUserRoles = { ...state.roles };
      state.roles = {
        ...oldUserRoles,
        items: oldUserRoles.items.map((rg) => {
          if (rg?.id === userRoles?.id) return userRoles;
          return rg;
        }),
      };
      return state;
    });
  },
  deleteUserRoles: (id: number) => {
    set((state) => {
      const tempUserRolesItems = state.roles.items;
      const updateUserRoles: userRolesTypeTableProps = {
        ...state.roles,
        items: tempUserRolesItems.filter((rg) => rg.id !== id),
      };
      state.roles = updateUserRoles;
      return state;
    });
  },
}));
