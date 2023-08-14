import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { permissionList } from "src/constants/permission";
import { useContractorServicesStore } from "globalStates/config";
import { BASConfigTableProps } from "interfaces/configs";
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
import { usePayloadHook } from "constants/customHook/payloadOptions";
import { lockFields } from "src/utils/url";

// =============== Contractor and services common component ==============
export default function Booking() {
  const location = useLocation();
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [totalCount, setTotalCount] = React.useState(0);
  const [pathName, setPathName] = React.useState({
    backendUrl: "",
    pathUrl: "",
    deleteFieldName: "",
  });
  const [deleteEndpoint, setDeleteEndpoint] = React.useState("");
  const [getFilterValue, setFilterValue] = React.useState(BOOKING_STATUS_FILTER_INITIAL_VALUE);
  const { enqueueSnackbar } = useSnackbar();
  const [presentFilter, setPresentFilter] = React.useState(false);

  const [openModal, setOpenModal] = React.useState(false);
  const [viewData, setViewData] = React.useState<any>({});

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

  const [urlUtils, setUrlUtils] = usePayloadHook();

  const { permissions } = usePermissionStore();

  const getData = async () => {
    let params = location.pathname.split("/").slice(-1).join("");
    // console.log({ params });
    // for api end point
    let returnedParams = "";
    let path = "";

    switch (params) {
      case "booking-status":
        returnedParams = "booking-status";
        path = "Booking Status";
        break;

      default:
        returnedParams = "";
        path = "";
    }
    setPathName({ backendUrl: returnedParams, pathUrl: path, deleteFieldName: "id" });
    setLoading(true);
    await fetchTableData({
      setData: setContractorData,
      api: returnedParams,
      setTotalCount,
      enqueueSnackbar,
      urlUtils,
    });
    setLoading(false);
    // try {
    //   setLoading(true);
    //   const { status, data } = await getAPI(`${returnedParams}/?q=&archived=&page=1&size=25`);
    //   if (status === 200) {
    //     const itemss = data.items || [];
    //     let newItems: any = [];
    //     if (itemss?.length > 0) {
    //       newItems = itemss?.map((item: any) => {
    //         let phone_numbers = item?.phone_numbers?.length
    //           ? item?.phone_numbers?.map((it: string) => it.split('/')?.reverse()[0])
    //           : [];
    //         return { ...item, phone_numbers };
    //       });
    //     }

    //     //setting common page data
    //     setContractorData((prev) => {
    //       return {
    //         ...prev,
    //         items: newItems || [],
    //         headers: data.headers,
    //         page: data.page,
    //         pages: data.pages,
    //         size: data.size,
    //         total: data.total,
    //         archivedCount: data?.info?.archived_count,
    //       };
    //     });

    //     setTotalCount(data.total);

    //     // setting data to right store
    //     if (path.toString().toLowerCase() === 'service') {
    //       setServices({
    //         items: data.items,
    //         headers: data.headers,
    //         page: data.page,
    //         pages: data.pages,
    //         size: data.size,
    //         total: data.total,
    //         archivedCount: data?.info?.archived_count,
    //       });
    //     }
    //   }
    // } catch (error: any) {
    //   setLoading(false);
    //   enqueueSnackbar(error.response.data.message || 'Something went wrong!', {
    //     variant: 'error',
    //   });
    // }
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
      setFilterValue(BOOKING_STATUS_FILTER_INITIAL_VALUE);
    }
  };

  useEffect(() => {
    getData();
  }, [urlUtils, location.pathname]);

  return (
    <OrganizationConfiguration>
      <Box sx={{ p: "20px" }} className="config-holder">
        {loading && (
          <Box
            sx={{
              position: "absolute",
              left: "55.5%",
              top: "50%",
              zIndex: 9999,
              transform: "translate(-50%, -50%)",
            }}
          >
            <CircularProgress color="inherit" />
          </Box>
        )}

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

        <BASDataTableUpdate
          data={contractorData}
          deletePath={deleteEndpoint}
          onDataChange={onDataTableChange}
          setterFunction={setContractorData}
          configName={pathName?.pathUrl}
          count={totalCount}
          urlUtils={urlUtils}
          keyName={"booking-status"}
          backendUrl={"booking-status"}
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
          permissions={permissions}
          permission={permissionList.BookingStatus}
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
