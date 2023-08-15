import { Box } from "@mui/system";
import FullPageLoader from "src/components/FullPageLoader";
import { permissionList } from "src/constants/permission";
import { fetchApI } from "src/modules/apiRequest/apiRequest";
import GeneralSettingTableFilter from "src/modules/config/generalSettings/Filters/generalSettingTableFilter";
import BASDataTableUpdate from "src/modules/table/BASDataTable";
import { BASConfigTableProps } from "src/interfaces/configs";
import { useSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { usePermissionStore } from "src/store/zustand/permission";
import DeletableChips from "./Filters/FilterChip";
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
import { queryMaker } from "src/utils/keyFunction";
import useAppStore from "src/store/zustand/app";
import { usePayloadHook } from "src/constants/customHook/payloadOptions";

export default function GeneralSetting() {
  const location = useLocation();
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = useState(false);
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

  const [generalSettingDatas, setGeneralSettingsDatas] = React.useState<BASConfigTableProps>({
    items: [],
    headers: [],
    page: 1,
    pages: 1,
    size: 1,
    total: 0,
    archivedCount: 0,
  });

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
    switch (returnedParams) {
      case "location":
        setKeyName("location");
        break;
      default:
        setKeyName("name");
        break;
    }
    setLoading(true);
    const apiRequestResponse = await fetchApI({
      setterFunction: (data: any) => {
        setTotalCount(data.total);
        setDeleteEndpoint(returnedParams);
        setGeneralSettingsDatas((prev) => {
          return {
            ...prev,
            ...data,
            items: data.items,
            headers: data.headers,
            page: data.page,
            pages: data.pages,
            size: data.size,
            total: data.total,
            archivedCount: data?.info?.archived_count,
          };
        });
      },
      getAll: true,
      url: `${returnedParams}/`,
      queryParam: queryMaker(urlUtils),
      // enqueueSnackbar: enqueueSnackbar,
    });
    setLoading(false);
    if (!apiRequestResponse) {
      setGeneralSettingsDatas({
        items: [],
        headers: [],
        page: 1,
        pages: 1,
        size: 5,
        total: 0,
        archivedCount: 0,
      });
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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

  return (
    <OrganizationConfiguration>
      <GeneralSettingLayout>
        <Box sx={{ p: "20px" }} className="config-holder loader__parent">
          {loading && <FullPageLoader className="custom__page-loader" />}
          <CustomPopUp
            openModal={openModal}
            title={viewData?.name || ""}
            setOpenModal={() => {
              setOpenModal(false);
            }}
            headers={generalSettingDatas?.headers}
            viewData={viewData}
            chipOptions={["status"]}
          >
            {/* {JSON.stringify(viewData)} */}
          </CustomPopUp>
          <BASDataTableUpdate
            data={generalSettingDatas}
            deletePath={deleteEndpoint}
            onDataChange={onDataTableChange}
            setterFunction={setGeneralSettingsDatas}
            configName={pathName?.buttonName}
            count={totalCount}
            tableIndicator={pathName}
            allowFilter={{
              filter: true,
              className: "filter__field",
              filteredOptionLength: presentFilter,
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
