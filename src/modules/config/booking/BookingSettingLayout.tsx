import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { permissionList } from "src/constants/permission";
import { useContractorServicesStore } from "src/store/zustand/globalStates/config";
import { BASConfigTableProps } from "src/src/interfaces/configs";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { useLocation } from "react-router";
import { getAPI } from "src/lib/axios";
import { usePermissionStore } from "src/store/zustand/permission";
import OrganizationConfiguration, {
  ConfigTableUrlUtils,
} from "../generalSettings/OrganizationConfiguration";
import BASDataTableUpdate from "src/modules/table/BASDataTable";
import CommonFilter, { converToProperFormikFormat, FilteredValue } from "../Filters/CommonFilter";
import { BOOKING_STATUS_FILTER_INITIAL_VALUE } from "../filterOptionsList";
import { fetchTableData } from "src/modules/apiRequest/apiRequest";
import CustomPopUp from "src/components/CustomPopup";
import { usePayloadHook } from "src/constants/customHook/payloadOptions";
import { lockFields } from "src/utils/url";
import FullPageLoader from "src/components/FullPageLoader";
import useGeneralStatusStore from "src/store/zustand/generalStatus";

// =============== Contractor and services common component ==============
export default function Booking() {
  const location = useLocation();
  const [pathName, setPathName] = React.useState({
    backendUrl: "",
    pathUrl: "",
    deleteFieldName: "",
    tableTitle: "General Status",
  });
  const [getFilterValue, setFilterValue] = React.useState(BOOKING_STATUS_FILTER_INITIAL_VALUE);
  const { enqueueSnackbar } = useSnackbar();
  const [presentFilter, setPresentFilter] = React.useState(false);

  const [openModal, setOpenModal] = React.useState(false);
  const [viewData, setViewData] = React.useState<any>({});

  const {
    fetchGeneralStatuss,
    tableDatas: GeneralTableData,
    tableActionHandler: GeneralTableActionHandler,
    loading,
  }: any = useGeneralStatusStore();

  const { services, setServices } = useContractorServicesStore();

  const [urlUtils, setUrlUtils] = usePayloadHook();

  const { permissions } = usePermissionStore();

  const getData = async (signal?: any) => {
    let params = location.pathname.split("/").slice(-1).join("");
    // console.log({ params });
    // for api end point
    let returnedParams = "";
    let path = "";
    let apiRequestResponse = false;

    switch (params) {
      case "general-status":
        returnedParams = "general-status";
        path = "Booking Status";
        apiRequestResponse = await fetchGeneralStatuss({
          getAll: true,
          enqueueSnackbar,
          query: urlUtils,
          signal,
        });
        break;

      default:
        returnedParams = "";
        path = "";
    }
    setPathName((prev: any) => ({
      ...prev,
      backendUrl: returnedParams,
      pathUrl: path,
      deleteFieldName: "id",
    }));
  };

  const onDataTableChange = ({ key, value }: any) => {
    setUrlUtils({
      ...urlUtils,
      [key]: value,
    });

    if (key === "filterQuery" && !value) {
      setPresentFilter(false);
      setFilterValue(BOOKING_STATUS_FILTER_INITIAL_VALUE);
    }
  };

  useEffect(() => {
    let controller = new AbortController();

    getData(controller?.signal);

    return () => {
      controller?.abort();
    };
  }, [urlUtils, location.pathname]);

  const tableUpdateDatas: any = {
    general: {
      data: GeneralTableData,
      setterFn: async ({ datas, type }: any) => {
        await GeneralTableActionHandler({ values: datas, enqueueSnackbar, type: type });
      },
    },
  };

  console.log({ GeneralTableData });

  return (
    <OrganizationConfiguration>
      <Box sx={{ p: "20px" }} className="config-holder">
        {loading && <FullPageLoader />}

        <CustomPopUp
          openModal={openModal}
          title={viewData?.name || ""}
          setOpenModal={() => {
            setOpenModal(false);
          }}
          headers={tableUpdateDatas?.[`general`]?.data?.headers}
          viewData={viewData}
          chipOptions={["status"]}
        ></CustomPopUp>

        <BASDataTableUpdate
          data={tableUpdateDatas?.["general"]?.data}
          onDataChange={onDataTableChange}
          setterFunction={tableUpdateDatas?.["general"]?.setterFn}
          urlUtils={urlUtils}
          keyName={"general-status"}
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
          tableOptions={{
            chipOptionsName: ["status"],
          }}
          onView={(data: any) => {
            setViewData(data);
            setOpenModal(true);
          }}
          tableIndicator={pathName}
          // permissions={permissions}
          // permission={permissionList.BookingStatus}
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
    </OrganizationConfiguration>
  );
}
