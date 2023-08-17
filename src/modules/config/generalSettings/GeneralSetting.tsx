import { Box } from "@mui/system";
import FullPageLoader from "src/components/FullPageLoader";
import { permissionList } from "src/constants/permission";
import { fetchApI } from "src/modules/apiRequest/apiRequest";
import BASDataTableUpdate from "src/modules/table/BASDataTable";
import { BASConfigTableProps } from "src/interfaces/configs";
import { useSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { usePermissionStore } from "src/store/zustand/permission";
import GeneralSettingLayout from "./GeneralSettingLayout";
import OrganizationConfiguration, { ConfigTableUrlUtils } from "./OrganizationConfiguration";
import {
  REGION_INITIAL_VALUE,
  TERRITORY_INITIAL_VALUE,
  LOCATION_INITIAL_VALUE,
  COUNTRY_INITIAL_VALUE,
} from "src/modules/config/filterOptionsList/index";
import CommonFilter, {
  FilteredValue,
  converToProperFormikFormat,
} from "src/modules/config/Filters/CommonFilter";
import CustomPopUp from "src/components/CustomPopup/index";
import useAppStore from "src/store/zustand/app";
import { usePayloadHook } from "src/constants/customHook/payloadOptions";
import useRegionStore from "src/store/zustand/generalSettings/region";
import useTerriotryStore from "src/store/zustand/generalSettings/territory";
import useCountryStore from "src/store/zustand/generalSettings/country";
import useLocationStore from "src/store/zustand/generalSettings/location";

export default function GeneralSetting() {
  const location = useLocation();
  const [value, setValue] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(0);
  const [pathName, setPathName] = React.useState({
    backendUrl: "",
    sectionTitle: "",
    buttonName: "",
    frontEndUrl: "",
    editFrontEndUrlGetter: null,
    deleteFieldName: "id",
    subSectionUrl: null,
  });
  const [deleteEndpoint, setDeleteEndpoint] = React.useState("");
  const [getFilterValue, setFilterValue] = React.useState(REGION_INITIAL_VALUE);
  const [presentFilter, setPresentFilter] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [keyName, setKeyName] = useState("");

  const { systemParameters }: any = useAppStore();
  const {
    fetchRegions,
    tableDatas: RegionTableData,
    tableActionHandler: RegionTableActionHandler,
    loading,
  }: any = useRegionStore();

  const {
    fetchCountrys,
    tableDatas: CountryTableData,
    tableActionHandler: CountryTableActionHandler,
    loading: countryLoading,
  }: any = useCountryStore();

  const {
    fetchTerriotrys,
    tableDatas: TerritoriesTableData,
    tableActionHandler: TerritoryTableActionHandler,
    loading: territoryLoading,
  }: any = useTerriotryStore();

  const {
    fetchLocations,
    tableDatas: LocationTableData,
    tableActionHandler: LocationTableActionHandler,
    loading: locationLoading,
  }: any = useLocationStore();

  const [urlUtils, setUrlUtils] = usePayloadHook();

  const { permissions } = usePermissionStore();
  const [openModal, setOpenModal] = useState(false);
  const [viewData, setViewData] = useState<any>({});

  function getReturnedParams({ location }: any) {
    let str = location.pathname || "";
    if (str.includes("/region")) {
      return "region";
    } else if (str.includes("/location")) {
      return "location";
    } else if (str.includes("/territory")) {
      return "territory";
    } else if (str.includes("/country")) {
      return "country";
    } else {
      return "";
    }
  }

  let returnedParams = getReturnedParams({ location });

  const getAllGeneralConfigs = async () => {
    setPathName((prev: any) => ({
      ...prev,
      backendUrl: `${returnedParams}`,
      buttonName: returnedParams,
    }));
    let apiRequestResponse = false;
    console.log({ urlUtils });
    switch (returnedParams) {
      case "location":
        apiRequestResponse = await fetchLocations({
          getAll: true,
          enqueueSnackbar,
          query: urlUtils,
        });
        setKeyName("location");
        break;
      case "region":
        apiRequestResponse = await fetchRegions({
          getAll: true,
          enqueueSnackbar,
          query: urlUtils,
        });
        break;
      case "country":
        setKeyName("name");
        apiRequestResponse = await fetchCountrys({
          getAll: true,
          enqueueSnackbar,
          query: urlUtils,
        });
        break;
      case "territory":
        apiRequestResponse = await fetchTerriotrys({
          getAll: true,
          enqueueSnackbar,
          query: urlUtils,
        });
        setKeyName("name");
        break;
      default:
        setKeyName("name");
        break;
    }
  };

  const onDataTableChange = ({ key, value }: any) => {
    setUrlUtils({
      ...urlUtils,
      [key]: value,
    });

    if (key === "filterQuery" && !value) {
      setPresentFilter(false);
      if (location.pathname.includes("region")) {
        setFilterValue(REGION_INITIAL_VALUE);
      } else if (location.pathname.includes("country")) {
        setFilterValue(COUNTRY_INITIAL_VALUE);
      } else if (location.pathname.includes("territory")) {
        setFilterValue(TERRITORY_INITIAL_VALUE);
      } else if (location.pathname.includes("location")) {
        setFilterValue(LOCATION_INITIAL_VALUE);
      }
    }
  };

  const prevUrlUtils = useRef<ConfigTableUrlUtils>();

  useEffect(() => {
    if (prevUrlUtils.current && prevUrlUtils.current !== urlUtils) {
      getAllGeneralConfigs();
    }

    prevUrlUtils.current = urlUtils;
  }, [urlUtils, urlUtils?.filterQuery, getFilterValue]);

  // clearing the search input value
  useEffect(() => {
    setUrlUtils((prev) => {
      return {
        ...prev,
        q: "",
        filterQuery: "",
      };
    });
    if (location.pathname.includes("region") && !presentFilter) {
      setFilterValue(REGION_INITIAL_VALUE);
    } else if (location.pathname.includes("country") && !presentFilter) {
      setFilterValue(COUNTRY_INITIAL_VALUE);
    } else if (location.pathname.includes("territory") && !presentFilter) {
      setFilterValue(TERRITORY_INITIAL_VALUE);
    } else if (location.pathname.includes("location") && !presentFilter) {
      setFilterValue(LOCATION_INITIAL_VALUE);
    }
  }, [location.pathname]);

  const tablePermissions: any = {
    region: permissionList.Region,
    country: permissionList.Country,
    territory: permissionList.Territory,
    location: permissionList.Location,
  };

  const tableUpdateDatas: any = {
    region: {
      data: RegionTableData,
      setterFn: async ({ datas, type }: any) => {
        await RegionTableActionHandler({ values: datas, enqueueSnackbar, type: type });
      },
    },
    country: {
      data: CountryTableData,
      setterFn: async ({ datas, type }: any) => {
        await CountryTableActionHandler({ values: datas, enqueueSnackbar, type: type });
      },
    },
    territory: {
      data: TerritoriesTableData,
      setterFn: async ({ datas, type }: any) => {
        await TerritoryTableActionHandler({ values: datas, enqueueSnackbar, type: type });
      },
    },
    location: {
      data: LocationTableData,
      setterFn: async ({ datas, type }: any) => {
        await LocationTableActionHandler({ values: datas, enqueueSnackbar, type: type });
      },
    },
  };

  return (
    <OrganizationConfiguration>
      <GeneralSettingLayout>
        <Box sx={{ p: "20px" }} className="config-holder loader__parent">
          {(loading || countryLoading || territoryLoading || locationLoading) && (
            <FullPageLoader className="custom__page-loader" />
          )}
          <CustomPopUp
            openModal={openModal}
            title={viewData?.name || ""}
            setOpenModal={() => {
              setOpenModal(false);
            }}
            // headers={generalSettingDatas?.headers}
            headers={tableUpdateDatas?.[returnedParams]?.data?.headers}
            viewData={viewData}
            chipOptions={["status"]}
          >
            {/* {JSON.stringify(viewData)} */}
          </CustomPopUp>
          <BASDataTableUpdate
            data={tableUpdateDatas?.[returnedParams]?.data}
            deletePath={deleteEndpoint}
            onDataChange={onDataTableChange}
            setterFunction={tableUpdateDatas?.[returnedParams]?.setterFn}
            configName={pathName?.buttonName}
            count={totalCount}
            tableIndicator={pathName}
            allowFilter={{
              filter: true,
              className: "filter__field",
              filteredOptionLength: presentFilter,
            }}
            onDelete={(data) => {
              console.log({ data });
            }}
            tableControls={(rowData: any) => {
              return {
                duplicate: !location.pathname.includes("/country"),
                view: true,
                requiredSelectIndication: true,
                archieved: true,
                add: true,
                edit: true,
                delete: true,
              };
            }}
            urlUtils={urlUtils}
            keyName={keyName}
            backendUrl={returnedParams}
            navigateTitle={{
              navigateMode: "view",
              column: returnedParams === "location" ? "location" : "name",
              navigate: true,
            }}
            tableOptions={{
              chipOptionsName: ["status"],
            }}
            permissions={permissions}
            permission={tablePermissions[returnedParams]}
            duplicate={true}
            onView={(data: any) => {
              setViewData(data);
              setOpenModal(true);
            }}
            onEdit={(data) => {
              console.log({ data });
            }}
            FilterComponent={({ filterModal, setFilterModal }: any) => {
              return (
                <CommonFilter
                  setFilterUrl={setUrlUtils}
                  filterModal={filterModal}
                  INITIAL_VALUES={converToProperFormikFormat({
                    data: getFilterValue,
                    getFilterValue,
                  })}
                  setFilterModal={setFilterModal}
                  setPresentFilter={setPresentFilter}
                  filterObj={{ getFilterValue, setFilterValue }}
                ></CommonFilter>
              );
            }}
            filterChildren={
              <FilteredValue
                getFilterValue={getFilterValue}
                setFilterValue={setFilterValue}
                onDataTableChange={onDataTableChange}
              />
            }
          ></BASDataTableUpdate>
        </Box>
      </GeneralSettingLayout>
    </OrganizationConfiguration>
  );
}
