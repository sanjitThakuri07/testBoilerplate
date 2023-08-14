import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useSnackbar } from "notistack";
import { useConfigStore } from "globalStates/config";
import { Box } from "@mui/system";
import { CircularProgress } from "@mui/material";
import OrganizationConfiguration, {
  ConfigTableUrlUtils,
} from "src/modules/config/generalSettings/OrganizationConfiguration";
import BASDataTable from "src/modules/table/BASDataTable";
import { deleteAPI, getAPI } from "src/lib/axios";
import { BASConfigTableProps } from "interfaces/configs";
import { useContractorServicesStore } from "globalStates/config";
import FullPageLoader from "src/components/FullPageLoader";
import { fetchApI } from "src/modules/apiRequest/apiRequest";
import { usePermissionStore } from "src/store/zustand/permission";
import { permissionList } from "src/constants/permission";
import { fetchTableData } from "src/modules/apiRequest/apiRequest";
import {
  CONTRACTOR_FILTER_INITIAL_VALUE,
  SERVICES_FILTER_INITIAL_VALUE,
} from "src/modules/config/filterOptionsList/index";
import CommonFilter, {
  FilteredValue,
  converToProperFormikFormat,
} from "src/modules/config/Filters/CommonFilter";
import CustomPopUp from "src/components/CustomPopup/index";

// =============== Contractor and services common component ==============
export default function NotificationList() {
  const location = useLocation();
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [totalCount, setTotalCount] = React.useState(0);
  const [pathName, setPathName] = React.useState({
    backendUrl: "/sdfid",
    pathUrl: "",
    deleteFieldName: "id",
  });
  const [deleteEndpoint, setDeleteEndpoint] = React.useState("");
  const [getFilterValue, setFilterValue] = React.useState(CONTRACTOR_FILTER_INITIAL_VALUE);
  const [presentFilter, setPresentFilter] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [contractorData, setContractorData] = React.useState<BASConfigTableProps>({
    items: [],
    headers: [],
    page: 1,
    pages: 1,
    size: 1,
    total: 0,
    archivedCount: 0,
  });

  const { services, setServices } = useContractorServicesStore();

  const [openModal, setOpenModal] = useState(false);
  const [viewData, setViewData] = useState<any>({});

  const [urlUtils, setUrlUtils] = React.useState<ConfigTableUrlUtils>({
    page: 1,
    size: 5,
    archived: "",
    q: "",
    filterQuery: "",
  });

  const { permissions } = usePermissionStore();

  const getData = async () => {
    let params = location.pathname.split("/").slice(-1).join("");
    // for api end point
    let returnedParams = "";
    let path = "";

    switch (params) {
      case "services":
        // setFilterValue(SERVICES_FILTER_INITIAL_VALUE);
        returnedParams = "organization-service";
        path = "Service";
        break;
      case "all-contractors":
        // setFilterValue(CONTRACTOR_FILTER_INITIAL_VALUE);
        returnedParams = "contractors";
        path = "Contractors";
        break;
      default:
        returnedParams = "notification-message";
        path = "";
    }
    setLoading(true);
    setPathName({
      backendUrl: returnedParams,
      pathUrl: path,
      deleteFieldName: "id",
    });
    setDeleteEndpoint(returnedParams);
    await fetchTableData({
      returnWholeData: true,
      setData: (data: any) => {
        setContractorData((prev) => {
          const itemss = data.items || [];
          let newItems: any = [];
          if (itemss?.length > 0) {
            newItems = itemss?.map((item: any) => {
              let phone_numbers = item?.phone_numbers?.length
                ? item?.phone_numbers?.map((it: string) => it.split("/")?.reverse()[0])
                : [];
              return { ...item, phone_numbers };
            });
          }
          return {
            ...prev,
            items: newItems || [],
            headers: data.headers,
            page: data.page,
            pages: data.pages,
            size: data.size,
            total: data.total,
            archivedCount: data?.info?.archived_count,
          };
        });
      },
      api: returnedParams,
      setTotalCount,
      enqueueSnackbar,
      urlUtils,
    });
    setLoading(false);
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
      if (pathName?.backendUrl?.includes("contractors")) {
        setFilterValue(CONTRACTOR_FILTER_INITIAL_VALUE);
      } else if (pathName?.backendUrl?.includes("organiztion-service")) {
        setFilterValue(CONTRACTOR_FILTER_INITIAL_VALUE);
      }
    }
  };

  useEffect(() => {
    getData();
    if (location?.pathname?.includes("all-contractors") && !presentFilter) {
      setFilterValue(CONTRACTOR_FILTER_INITIAL_VALUE);
    } else if (location?.pathname?.includes("services") && !presentFilter) {
      setFilterValue(SERVICES_FILTER_INITIAL_VALUE);
    }
  }, [urlUtils, location.pathname]);

  const tabPermissions: any = {
    Contractors: permissionList.Contractor,
    Service: permissionList.Service,
  };

  return (
    <>
      <Box sx={{ p: "20px" }} className="config-holder loader__parent">
        {loading && <FullPageLoader className="custom__page-loader" />}
        <CustomPopUp
          openModal={openModal}
          title={viewData?.name || ""}
          setOpenModal={() => {
            setOpenModal(false);
          }}
          headers={contractorData?.headers}
          viewData={viewData}
          chipOptions={["status"]}
        >
          {/* {JSON.stringify(viewData)} */}
        </CustomPopUp>
        <BASDataTable
          data={contractorData}
          deletePath={deleteEndpoint}
          onDataChange={onDataTableChange}
          configName={pathName?.pathUrl}
          backendUrl={pathName?.backendUrl}
          tableIndicator={pathName}
          count={totalCount}
          urlUtils={urlUtils}
          setterFunction={setContractorData}
          onView={(data: any) => {
            setViewData(data);
            setOpenModal(true);
          }}
          navigateTitle={{
            navigateMode: "view",
            column: "name",
            navigate: true,
          }}
          allowFilter={{
            filter: true,
            className: "filter__field",
            filteredOptionLength: presentFilter,
          }}
          permissions={permissions}
          tableOptions={{
            chipOptionsName: ["status"],
          }}
          permission={tabPermissions[pathName?.pathUrl]}
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
        />
      </Box>
    </>
  );
}
