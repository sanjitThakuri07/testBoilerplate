import React, { useEffect } from "react";
import { useLocation } from "react-router";
import { getAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import { useConfigStore } from "globalStates/config";
import { Box } from "@mui/system";
import { CircularProgress } from "@mui/material";
import OrganizationConfiguration, {
  ConfigTableUrlUtils,
} from "../generalSettings/OrganizationConfiguration";
import BASDataTable from "../generalSettings/BASDataTable";
import { BASConfigTableProps } from "interfaces/configs";
import InspectionTypesLayout from "./InspectionTypesLayout";
import { permissionList } from "src/constants/permission";
import { usePermissionStore } from "src/store/zustand/permission";
import BASDataTableUpdate from "src/modules/table/BASDataTable";
import CommonFilter, { converToProperFormikFormat, FilteredValue } from "../Filters/CommonFilter";
import { INSPECTION_TYPES_INITIAL_VALUE } from "../filterOptionsList";
import { fetchTableData } from "src/modules/apiRequest/apiRequest";
import FullPageLoader from "src/components/FullPageLoader";
import CustomPopUp from "src/components/CustomPopup";
import { usePayloadHook } from "constants/customHook/payloadOptions";
import { lockFields } from "src/utils/url";

export default function InspectionTypes() {
  const location = useLocation();
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
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
  const [getFilterValue, setFilterValue] = React.useState(INSPECTION_TYPES_INITIAL_VALUE);
  const [presentFilter, setPresentFilter] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();
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

  const [openModal, setOpenModal] = React.useState(false);
  const [viewData, setViewData] = React.useState<any>({});

  const { permissions } = usePermissionStore();

  const getAllGeneralConfigs = async () => {
    let returnedParams = location.pathname.split("/").slice(-1).join("");
    setPathName((prev: any) => ({
      ...prev,
      backendUrl: `${returnedParams}`,
      buttonName: returnedParams,
    }));
    setLoading(true);
    setDeleteEndpoint(returnedParams);
    await fetchTableData({
      setData: setGeneralSettingsDatas,
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
      setFilterValue(INSPECTION_TYPES_INITIAL_VALUE);
    }
  };

  useEffect(() => {
    getAllGeneralConfigs();
  }, [urlUtils, location.pathname]);

  const tablePermissions: any = {
    "inspection-name": permissionList.InspectionName,
    "inspection-status": permissionList.InspectionStatus,
  };

  // clearing the search input value
  useEffect(() => {
    setUrlUtils((prev) => {
      return {
        ...prev,
        q: "",
        filterQuery: "",
      };
    });
  }, [location.pathname]);

  console.log({ pathName });

  return (
    <OrganizationConfiguration>
      <InspectionTypesLayout>
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
            urlUtils={urlUtils}
            backendUrl={pathName?.backendUrl}
            tableIndicator={pathName}
            tableControls={(rowData: any) => {
              let lockDEDL = location?.pathname?.includes("inspection-status")
                ? lockFields?.includes(rowData?.name)
                : false;

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
            tableOptions={{
              chipOptionsName: ["status"],
            }}
            navigateTitle={{
              navigateMode: "view",
              column: "name",
              navigate: true,
            }}
            permissions={permissions}
            permission={tablePermissions[pathName?.backendUrl]}
            allowFilter={{
              filter: true,
              className: "filter__field",
              filteredOptionLength: presentFilter,
            }}
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
          ></BASDataTableUpdate>
        </Box>
      </InspectionTypesLayout>
    </OrganizationConfiguration>
  );
}
