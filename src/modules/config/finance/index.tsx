import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { getAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import { useConfigStore } from "src/store/zustand/globalStates/config";
import { Box } from "@mui/system";
import { CircularProgress } from "@mui/material";
import OrganizationConfiguration, {
  ConfigTableUrlUtils,
} from "../generalSettings/OrganizationConfiguration";
import BASDataTable from "../generalSettings/BASDataTable";
import { BASConfigTableProps } from "src/src/interfaces/configs";
import FinanceSettingLayout from "./FinanceSettingLayout";
import { permissionList } from "src/constants/permission";
import { usePermissionStore } from "src/store/zustand/permission";
import BASDataTableUpdate from "src/modules/table/BASDataTable";
import CommonFilter, { converToProperFormikFormat, FilteredValue } from "../Filters/CommonFilter";
import { FINANCE_FILTER_INITIAL_VALUE } from "../filterOptionsList";
import FullPageLoader from "src/components/FullPageLoader";
import { fetchTableData } from "src/modules/apiRequest/apiRequest";
import CustomPopUp from "src/components/CustomPopup/index";
import { usePayloadHook } from "src/constants/customHook/payloadOptions";

export default function FinanceConfiguration() {
  const location = useLocation();
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [totalCount, setTotalCount] = React.useState(0);
  const [pathName, setPathName] = React.useState({
    backendUrl: "",
    pathUrl: "",
    deleteFieldName: "id",
  });
  const [keyName, setKeyName] = React.useState("");
  const [deleteEndpoint, setDeleteEndpoint] = React.useState("");
  const [getFilterValue, setFilterValue] = React.useState(FINANCE_FILTER_INITIAL_VALUE);
  const [presentFilter, setPresentFilter] = React.useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [viewData, setViewData] = useState<any>({});

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

  const { permissions } = usePermissionStore();

  const getAllGeneralConfigs = async () => {
    let returnedParams = location.pathname.split("/").slice(-1).join("");
    setKeyName(returnedParams);
    setPathName({ backendUrl: returnedParams, pathUrl: returnedParams, deleteFieldName: "id" });
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
      setFilterValue(FINANCE_FILTER_INITIAL_VALUE);
    }
  };

  useEffect(() => {
    getAllGeneralConfigs();
  }, [urlUtils, location.pathname]);

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

  const tabPermissions: any = {
    "billing-agreement-names": permissionList.TariffRateType,
    "tariff-rate-types": permissionList.TariffRateType,
  };

  return (
    <OrganizationConfiguration>
      <FinanceSettingLayout>
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
            configName={pathName?.pathUrl}
            count={totalCount}
            urlUtils={urlUtils}
            keyName={keyName}
            backendUrl={pathName?.backendUrl}
            tableIndicator={pathName}
            onView={(data: any) => {
              setViewData(data);
              setOpenModal(true);
            }}
            tableOptions={{
              chipOptionsName: ["status"],
            }}
            permissions={permissions}
            permission={tabPermissions[pathName?.backendUrl]}
            allowFilter={{
              filter: true,
              className: "filter__field",
              filteredOptionLength: presentFilter,
            }}
            duplicate={true}
            navigateTitle={{ navigateMode: "view", column: "name", navigate: true }}
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
      </FinanceSettingLayout>
    </OrganizationConfiguration>
  );
}
