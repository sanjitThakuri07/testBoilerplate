import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { permissionList } from "src/constants/permission";
import BASDataTable from "src/modules/table/BASDataTable";
import {
  activityStatusStore,
  activityTypeStore,
  useContractorServicesStore,
} from "src/store/zustand/globalStates/config";
import { BASConfigTableProps } from "src/interfaces/configs";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router";
import { getAPI } from "src/lib/axios";
import { usePermissionStore } from "src/store/zustand/permission";
import OrganizationConfiguration, {
  ConfigTableUrlUtils,
} from "../generalSettings/OrganizationConfiguration";
import FullPageLoader from "src/components/FullPageLoader";
import ActivityLayout from "./ActivityLayout";
import { fetchTableData } from "src/modules/apiRequest/apiRequest";
import { ACTIVITY_FILTER_INITIAL_VALUE } from "src/modules/config/filterOptionsList/index";
import CommonFilter, {
  FilteredValue,
  converToProperFormikFormat,
} from "src/modules/config/Filters/CommonFilter";
import CustomPopUp from "src/components/CustomPopup/index";
import { usePayloadHook } from "constants/customHook/payloadOptions";
import { lockFields } from "src/utils/url";

// =============== Activity ==============
export default function Activity() {
  const location = useLocation();
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [totalCount, setTotalCount] = React.useState(0);
  const [pathName, setPathName] = React.useState({
    backendUrl: "",
    pathUrl: "",
    deleteFieldName: "id",
  });
  const [deleteEndpoint, setDeleteEndpoint] = React.useState("");
  const [getFilterValue, setFilterValue] = React.useState(ACTIVITY_FILTER_INITIAL_VALUE);
  const [presentFilter, setPresentFilter] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [tableData, setTableData] = React.useState<BASConfigTableProps>({
    items: [],
    headers: [],
    page: 1,
    pages: 1,
    size: 1,
    total: 0,
    archivedCount: 0,
  });
  const { services, setServices } = useContractorServicesStore();
  const { activityType, setActivityType } = activityTypeStore();
  const { statusType, setActivityStatus } = activityStatusStore();
  const [openModal, setOpenModal] = useState(false);
  const [viewData, setViewData] = useState<any>({});

  const [urlUtils, setUrlUtils] = usePayloadHook();

  const { permissions } = usePermissionStore();

  const getData = async () => {
    let params = location.pathname.split("/").slice(-1).join("");
    // for api end point
    let returnedParams = "";
    let path = "";

    switch (params) {
      case "types":
        returnedParams = "activity-type";
        path = "Activity Type";
        break;
      case "status":
        returnedParams = "activity-status";
        path = "Activity Status";
        break;
      default:
        returnedParams = "";
        path = "";
    }
    setLoading(true);
    setPathName((prev: any) => ({
      ...prev,
      backendUrl: returnedParams,
      pathUrl: path,
      deleteFieldName: "id",
    }));
    await fetchTableData({
      setData: setTableData,
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
      setFilterValue(ACTIVITY_FILTER_INITIAL_VALUE);
    }
  };

  useEffect(() => {
    getData();
  }, [urlUtils, location.pathname]);

  return (
    <OrganizationConfiguration>
      <ActivityLayout>
        <Box sx={{ p: "20px" }} className="config-holder loader__parent">
          {loading && <FullPageLoader className="custom__page-loader" />}
          <CustomPopUp
            openModal={openModal}
            title={viewData?.name || ""}
            setOpenModal={() => {
              setOpenModal(false);
            }}
            headers={tableData?.headers}
            viewData={viewData}
            chipOptions={["status"]}
          >
            {/* {JSON.stringify(viewData)} */}
          </CustomPopUp>
          <BASDataTable
            data={tableData}
            deletePath={deleteEndpoint}
            onDataChange={onDataTableChange}
            configName={pathName?.pathUrl}
            backendUrl={pathName?.backendUrl}
            count={totalCount}
            setterFunction={setTableData}
            urlUtils={urlUtils}
            tableControls={(rowData: any) => {
              let lockDEDL = lockFields?.includes(rowData?.name);
              return {
                duplicate: !lockDEDL,
                view: true,
                requiredSelectIndication: !lockDEDL,
                archieved: true,
                add: true,
                edit: !lockDEDL,
                delete: !lockDEDL,
              };
            }}
            onView={(data: any) => {
              setViewData(data);
              setOpenModal(true);
            }}
            navigateTitle={{ navigateMode: "view", column: "name", navigate: true }}
            allowFilter={{
              filter: true,
              className: "filter__field",
              filteredOptionLength: presentFilter,
            }}
            tableOptions={{
              chipOptionsName: ["status"],
            }}
            permissions={permissions}
            permission={permissionList.ActivityStatus}
            tableIndicator={pathName}
            duplicate={true}
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
      </ActivityLayout>
    </OrganizationConfiguration>
  );
}
